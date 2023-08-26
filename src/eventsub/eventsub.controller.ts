import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { EventsubService } from './eventsub.service';

@Controller('eventsub')
export class EventsubController {
  constructor(private readonly eventsubService: EventsubService) {}

  @Get()
  async getSubscriptions() {
    return await this.eventsubService.getSubscriptions();
  }

  @Post('/grant')
  async subscribeUserGrant() {
    return await this.eventsubService.subscribeUserGrant();
  }

  @Delete('/grant')
  async unsubsribeUserGrant() {
    return await this.eventsubService.unsubscribeUserGrant();
  }

  @Post(':channel')
  async subscribe(@Param('channel') channel: string) {
    return await this.eventsubService.subscribe(channel);
  }

  @Delete(':channel')
  async unsubsribe(@Param('channel') channel: string) {
    return await this.eventsubService.unsubsribe(channel);
  }
}
