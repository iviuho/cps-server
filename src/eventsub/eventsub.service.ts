import { Injectable } from '@nestjs/common';

import { ApiService } from '@src/api/api.service';

@Injectable()
export class EventsubService {
  constructor(private readonly apiService: ApiService) {}

  async unsubsribe(id: string) {
    return await this.apiService.unsubscribeEvent(id);
  }

  async getSubscriptions() {
    const subscriptions = await this.apiService.getSubscriptions();
    return subscriptions;
  }

  async subscribeUserAuthorization() {
    return await this.apiService.subscribeEvent({
      type: 'user.authorization.grant',
      version: '1',
      condition: { client_id: this.apiService.clientId },
      transport: {
        method: 'webhook',
        callback: 'https://cps-server.com/webhook',
      },
    });
  }

  async subscribeUserRevokation() {
    return await this.apiService.subscribeEvent({
      type: 'user.authorization.revoke',
      version: '1',
      condition: { client_id: this.apiService.clientId },
      transport: {
        method: 'webhook',
        callback: 'https://cps-server.com/webhook',
      },
    });
  }

  async subscribeChannelPointRewardRedemption(broadcasterId: string, rewardId?: string) {
    return await this.apiService.subscribeEvent({
      type: 'channel.channel_points_custom_reward_redemption.add',
      version: '1',
      condition: { broadcaster_user_id: broadcasterId, reward_id: rewardId },
      transport: {
        method: 'webhook',
        callback: 'https://cps-server.com/webhook',
      },
    });
  }
}
