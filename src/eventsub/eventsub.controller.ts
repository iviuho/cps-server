import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { EventsubService } from './eventsub.service';

@Controller('eventsub')
export class EventsubController {
  constructor(private readonly eventsubService: EventsubService) {}

  @Get()
  async getSubscriptions() {
    return await this.eventsubService.getSubscriptions();
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
