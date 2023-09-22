import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { EventsubService } from './eventsub.service';
import { UserService } from '@src/user/user.service';

export interface CreateEventsubDto {
  type: string;
  condition: any;
}

@Controller('eventsub')
export class EventsubController {
  constructor(private readonly eventsubService: EventsubService, private readonly userService: UserService) {}

  @Get()
  async getSubscriptions() {
    return await this.eventsubService.getSubscriptions();
  }

  @Post()
  async subscribe(@Body() body: CreateEventsubDto) {
    const { type, condition } = body;

    switch (type) {
      case 'user.authorization.grant':
        return await this.eventsubService.subscribeUserAuthorization();

      case 'user.authorization.revoke':
        return await this.eventsubService.subscribeUserRevokation();

      case 'channel.channel_points_custom_reward_redemption.add':
        const target = await this.userService.getUserByLogin(condition);
        return await this.eventsubService.subscribeChannelPointRewardRedemption(target.uid);

      default:
        throw new BadRequestException();
    }
  }

  @Delete(':id')
  async unsubsribe(@Param('id') id: string) {
    return await this.eventsubService.unsubsribe(id);
  }
}
