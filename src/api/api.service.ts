import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from '@src/entity/user';

import { ConfigService } from '@src/config/config.service';
import { GetUserApiRequest, GetUserApiResponse, SubscribeApiRequest, SubscribeApiResponse } from './api.interface';
import { TokenService } from './token/token.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService
  ) {}

  private async getCredential() {
    const { token } = await this.tokenService.findLatestToken();

    return {
      Authorization: `Bearer ${token}`,
      'Client-Id': this.configService.clientId,
    };
  }

  private HttpError(status: number) {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return new BadRequestException();
      case HttpStatus.UNAUTHORIZED:
        return new UnauthorizedException();
      case HttpStatus.FORBIDDEN:
        return new ForbiddenException();
      case HttpStatus.NOT_FOUND:
        return new NotFoundException();
      case HttpStatus.CONFLICT:
        return new ConflictException();
      default:
        return new Error(`api request failed with status code: ${status}`);
    }
  }

  async getUser(params: GetUserApiRequest): Promise<User> {
    const response = await this.httpService.axiosRef.get<GetUserApiResponse>('https://api.twitch.tv/helix/users', {
      headers: await this.getCredential(),
      params,
    });

    const { status, data } = response;
    const [userDataFromApi] = data.data;

    if (status === HttpStatus.OK && userDataFromApi) {
      const user: User = {
        login: userDataFromApi.login,
        nickname: userDataFromApi.display_name,
        uid: userDataFromApi.id,
      };

      return user;
    }

    throw this.HttpError(status);
  }

  async subscribeEvent(params: SubscribeApiRequest) {
    params.transport.secret = this.configService.clientSecret;

    const response = await this.httpService.axiosRef.post<SubscribeApiResponse>(
      'https://api.twitch.tv/helix/eventsub/subscriptions',
      params,
      { headers: await this.getCredential() }
    );

    const { status, data } = response;
    const [subscription] = data.data;

    if (status === HttpStatus.ACCEPTED) {
      return subscription;
    }

    throw this.HttpError(status);
  }

  async unsubscribeEvent(id: string) {
    const response = await this.httpService.axiosRef.delete('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: await this.getCredential(),
      params: { id },
    });

    const { status } = response;

    if (status === HttpStatus.NO_CONTENT) {
      return;
    }

    throw this.HttpError(status);
  }
}
