import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Eventsub, EventsubStatus } from '@src/entity/eventsub';
import { User } from '@src/entity/user';

import { ApiService } from '@src/api/api.service';
import { UserService } from '@src/user/user.service';
import { Subscription } from '@src/api/api.interface';

@Injectable()
export class EventsubService {
  constructor(
    @InjectRepository(Eventsub)
    private readonly eventsubRepository: Repository<Eventsub>,
    private readonly apiService: ApiService,
    private readonly userService: UserService
  ) {}

  private async createEventsub(subscription: Subscription, target?: User): Promise<Eventsub> {
    const eventsub = this.eventsubRepository.create({
      ...subscription,
      createdAt: subscription.created_at,
      target,
    });

    return await this.eventsubRepository.save(eventsub);
  }

  private async removeEventsub(eventsub: Eventsub): Promise<Eventsub> {
    await this.apiService.unsubscribeEvent(eventsub.id);
    return await this.eventsubRepository.softRemove(eventsub);
  }

  async changeEventsubStatus(id: string, status: EventsubStatus): Promise<Eventsub> {
    switch (status) {
      case EventsubStatus.AUTHORIZATION_REVOKED:
      case EventsubStatus.FAILED:
      case EventsubStatus.FAILURES_EXCEEDED:
      case EventsubStatus.MODERATOR_REMOVED:
      case EventsubStatus.USER_REMOVED:
      case EventsubStatus.VERSION_REMOVED:
        await this.eventsubRepository.softRemove({ id });
        break;
    }

    return await this.eventsubRepository.save({ id, status });
  }

  async getSubscriptions(): Promise<Eventsub[]> {
    const subscriptions = await this.eventsubRepository.find();
    return subscriptions;
  }

  async subscribeUserAuthorization(): Promise<Eventsub> {
    const subscription = await this.apiService.subscribeEvent({
      type: 'user.authorization.grant',
      version: '1',
      condition: { client_id: this.apiService.clientId },
      transport: {
        method: 'webhook',
        callback: 'https://cps-server.com/webhook',
      },
    });

    return await this.createEventsub(subscription);
  }

  async unsubscribeUserAuthorization(): Promise<Eventsub> {
    const eventsub = await this.eventsubRepository.findOneOrFail({ where: { type: 'user.authorization.grant' } });
    return await this.removeEventsub(eventsub);
  }

  async subscribeUserRevokation(): Promise<Eventsub> {
    const subscription = await this.apiService.subscribeEvent({
      type: 'user.authorization.revoke',
      version: '1',
      condition: { client_id: this.apiService.clientId },
      transport: {
        method: 'webhook',
        callback: 'https://cps-server.com/webhook',
      },
    });

    return await this.createEventsub(subscription);
  }

  async unsubscribeUserRevokation(): Promise<Eventsub> {
    const eventsub = await this.eventsubRepository.findOneOrFail({ where: { type: 'user.authorization.revoke' } });
    return await this.removeEventsub(eventsub);
  }

  async subscribeChannelPointRewardRedemption(channel: string): Promise<Eventsub> {
    const user = await this.userService.getUserByLogin(channel);
    const subscription = await this.apiService.subscribeEvent({
      type: 'channel.channel_points_custom_reward_redemption.add',
      version: '1',
      condition: { broadcaster_user_id: user.uid },
      transport: {
        method: 'webhook',
        callback: 'https://cps-server.com/webhook',
      },
    });

    return await this.createEventsub(subscription, user);
  }

  async unsubscribeChannelPointRewardRedemption(channel: string): Promise<Eventsub> {
    const eventsub = await this.eventsubRepository.findOneOrFail({ where: { target: { login: channel } } });
    return await this.removeEventsub(eventsub);
  }
}
