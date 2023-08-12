import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { GetUserApiRequest, GetUserApiResponse } from './api.interface';

import { TokenService } from './token/token.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService
  ) {}

  async getUser(params: GetUserApiRequest): Promise<GetUserApiResponse> {
    const { token } = await this.tokenService.findLatestToken();

    const response = await this.httpService.axiosRef.get(
      'https://api.twitch.tv/helix/users',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': this.tokenService.clientId,
        },
        params,
      }
    );

    return response.data;
  }
}
