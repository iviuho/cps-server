import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Eventsub, EventsubStatus } from '@src/entity/eventsub';

import { ApiService } from '@src/api/api.service';
import { UserService } from '@src/user/user.service';

@Injectable()
export class EventsubService {
  constructor(
    @InjectRepository(Eventsub)
    private readonly eventsubRepository: Repository<Eventsub>,
    private readonly apiService: ApiService,
    private readonly userService: UserService
  ) {}

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

    const eventsub = this.eventsubRepository.create({
      ...subscription,
      createdAt: subscription.created_at,
    });

    return await this.eventsubRepository.save(eventsub);
  }

  async unsubscribeUserAuthorization(): Promise<Eventsub> {
    const subscription = await this.eventsubRepository.findOneOrFail({ where: { type: 'user.authorization.grant' } });

    await this.apiService.unsubscribeEvent(subscription.id);
    return await this.eventsubRepository.softRemove(subscription);
  }

  async subscribe(channel: string): Promise<Eventsub> {
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

    const eventsub = this.eventsubRepository.create({
      ...subscription,
      createdAt: subscription.created_at,
      target: user,
    });

    return await this.eventsubRepository.save(eventsub);
  }

  async unsubsribe(channel: string): Promise<Eventsub> {
    const subscription = await this.eventsubRepository.findOneOrFail({ where: { target: { login: channel } } });

    await this.apiService.unsubscribeEvent(subscription.id);
    return await this.eventsubRepository.softRemove(subscription);
  }

  async changeEventsubStatus(id: string, status: EventsubStatus): Promise<Eventsub> {
    return await this.eventsubRepository.save({ id, status });
  }
}
