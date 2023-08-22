import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Eventsub } from '@src/entity/eventsub';

import { ApiService } from '@src/api/api.service';

@Injectable()
export class EventsubService {
  constructor(
    @InjectRepository(Eventsub)
    private readonly eventsubRepository: Repository<Eventsub>,
    private readonly apiService: ApiService
  ) {}

  async subscribe(channel: string) {
    const subscription = await this.apiService.subscribeChannelPointRedemption(channel);
    const { id, created_at: createdAt, status, type, version } = subscription;

    return await this.eventsubRepository.save({ id, createdAt, status, type, version });
  }
}
