import { Controller, Param, Post } from '@nestjs/common';

import { EventsubService } from './eventsub.service';

@Controller('eventsub')
export class EventsubController {
  constructor(private readonly eventsubService: EventsubService) {}

  @Post(':channel')
  async subscribe(@Param('channel') channel: string) {
    return await this.eventsubService.subscribe(channel);
  }
}
