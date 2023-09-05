import { Injectable } from '@nestjs/common';

import { EventsubStatus } from '@src/entity/eventsub';

import { AuthorizationService } from '@src/authorization/authorization.service';
import { CommentService } from '@src/comment/comment.service';
import { EventsubService } from '@src/eventsub/eventsub.service';
import { UserService } from '@src/user/user.service';
import * as EventDto from '@src/api/event.interface';

@Injectable()
export class WebhookService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly commentService: CommentService,
    private readonly eventsubService: EventsubService,
    private readonly userService: UserService
  ) {}

  async handleNotification(type: string, event: any) {
    console.log(event);

    switch (type) {
      case 'user.authorization.grant':
        const { client_id, user_id, user_login, user_name } = event as EventDto.UserAuthGrant;

        const { uid } = await this.userService.createUser(user_id, user_login, user_name);
        await this.authorizationService.createGrant(client_id, uid);
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

  async revokeEventsub(subscriptionId: string) {
    await this.eventsubService.changeEventsubStatus(subscriptionId, EventsubStatus.AUTHORIZATION_REVOKED);
  }
}
