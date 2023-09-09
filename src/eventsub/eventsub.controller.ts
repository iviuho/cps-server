import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { EventsubService } from './eventsub.service';

@Controller('eventsub')
export class EventsubController {
  constructor(private readonly eventsubService: EventsubService) {}

  @Get()
  async getSubscriptions() {
    return await this.eventsubService.getSubscriptions();
  }

  @Post('authorization')
  async subscribeUserAuthorization() {
    return await this.eventsubService.subscribeUserAuthorization();
  }

  @Delete('authorization')
  async unsubsribeUserAuthorization() {
    return await this.eventsubService.unsubscribeUserAuthorization();
  }

  @Post('revokation')
  async subscribeUserRevokation() {
    return await this.eventsubService.subscribeUserRevokation();
  }

  @Delete('revokation')
  async unsubscribeUserRevokation() {
    return await this.eventsubService.unsubscribeUserRevokation();
  }

  @Post(':channel')
  async subscribe(@Param('channel') channel: string) {
    return await this.eventsubService.subscribeChannelPointRewardRedemption(channel);
  }

  @Delete(':channel')
  async unsubsribe(@Param('channel') channel: string) {
    return await this.eventsubService.unsubscribeChannelPointRewardRedemption(channel);
  }
}
