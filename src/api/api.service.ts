import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';

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

  async getUser(params: GetUserApiRequest): Promise<User> {
    const { token } = await this.tokenService.findLatestToken();

    const response = await this.httpService.axiosRef.get<GetUserApiResponse>('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': this.configService.clientId,
      },
      params,
    });

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

    throw new NotFoundException();
  }

  async subscribeEvent(params: SubscribeApiRequest) {
    const { token } = await this.tokenService.findLatestToken();

    const response = await this.httpService.axiosRef.post<SubscribeApiResponse>(
      'https://api.twitch.tv/helix/eventsub/subscriptions',
      params,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': this.configService.clientId,
        },
      }
    );

    const { status, data } = response;
    const [subscription] = data.data;

    if (status === 200) {
      return subscription;
    }

    throw Error('subsribe failed');
  }

  async subscribeChannelPointRedemption(channel: string) {
    return await this.subscribeEvent({
      type: 'channel.channel_points_custom_reward_redemption.add',
      version: '1',
      condition: { broadcaster_user_id: channel },
      transport: {
        method: 'webhook',
        callback: 'https://cps-server.com/webhook',
        secret: this.configService.clientSecret,
      },
    });
  }
}
