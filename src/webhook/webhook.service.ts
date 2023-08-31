import { Injectable } from '@nestjs/common';

import { CommentService } from '@src/comment/comment.service';
import { EventsubService } from '@src/eventsub/eventsub.service';
import { EventsubStatus } from '@src/entity/eventsub';
import { UserService } from '@src/user/user.service';
import * as EventDto from '@src/api/event.interface';

@Injectable()
export class WebhookService {
  constructor(
    private readonly commentService: CommentService,
    private readonly eventsubService: EventsubService,
    private readonly userService: UserService
  ) {}

  async handleNotification(type: string, event: any) {
    console.log(event);

    switch (type) {
      case 'user.authorization.grant':
        const { user_login } = event as EventDto.UserAuthGrant;
        await this.userService.getUserByLoginFromApi(user_login);
        break;

      case 'channel.channel_points_custom_reward_redemption.add':
        const {
          broadcaster_user_id: to,
          user_id: from,
          user_input: content,
        } = event as EventDto.ChannelPointCustomRewardRedemptionAdd;

        await this.commentService.createComment(to, from, content);
        break;
    }
  }

  async enableEventsub(subscriptionId: string) {
    await this.eventsubService.changeEventsubStatus(subscriptionId, EventsubStatus.ENABLED);
  }
}
