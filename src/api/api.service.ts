import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { User } from '@src/entity/user';

import { GetUserApiRequest, GetUserApiResponse } from './api.interface';
import { TokenService } from './token/token.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService
  ) {}

  async getUser(params: GetUserApiRequest): Promise<User> {
    const { token } = await this.tokenService.findLatestToken();

    const response = await this.httpService.axiosRef.get<GetUserApiResponse>(
      'https://api.twitch.tv/helix/users',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': this.tokenService.clientId,
        },
        params,
      }
    );

    const { status, data } = response;
    const [userDataFromApi] = data.data;

    if (status === 200 && userDataFromApi) {
      const user: User = {
        login: userDataFromApi.login,
        nickname: userDataFromApi.display_name,
        uid: userDataFromApi.id,
      };

      return user;
    }

    throw Error('user data not found from api');
  }
}