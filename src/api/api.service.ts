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

import { TokenType } from '@src/entity/token';
import { User } from '@src/entity/user';

import { ConfigService } from '@src/config/config.service';
import {
  GetExtensionSecretResponse,
  GetUserRequest,
  GetUserResponse,
  SubscribeRequest,
  SubscribeResponse,
} from './api.interface';
import { TokenService } from './token/token.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService
  ) {}

  get clientId() {
    return this.configService.clientId;
  }

  get clientSecret() {
    return this.configService.clientSecret;
  }

  private async getCredential() {
    const { token } = await this.tokenService.getToken(TokenType.App);

    return {
      Authorization: `Bearer ${token}`,
      'Client-Id': this.clientId,
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

  async getUser(params: GetUserRequest): Promise<User> {
    const response = await this.httpService.axiosRef.get<GetUserResponse>('https://api.twitch.tv/helix/users', {
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

  async subscribeEvent(params: SubscribeRequest) {
    params.transport.secret = this.configService.clientSecret;

    const response = await this.httpService.axiosRef.post<SubscribeResponse>(
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

  async getExtensionSecret() {
    const response = await this.httpService.axiosRef.get<GetExtensionSecretResponse>(
      'https://api.twitch.tv/helix/extensions/jwt/secrets',
      {
        headers: await this.getCredential(),
        params: { extension_id: this.clientId },
      }
    );

    const { status, data } = response;

    if (status === HttpStatus.OK) {
      const [{ secrets }] = data.data;
      return secrets;
    }

    throw this.HttpError(status);
  }
}
