import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '@src/authorization/authorization.service';
import { CommentService } from '@src/comment/comment.service';
import { UserService } from '@src/user/user.service';
import * as EventDto from '@src/api/event.interface';

@Injectable()
export class WebhookService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly commentService: CommentService,
    private readonly userService: UserService
  ) {}

  async handleNotification(type: string, event: any) {
    console.log(event);

    switch (type) {
      case 'user.authorization.grant': {
        const { client_id, user_id, user_login, user_name } = event as EventDto.UserAuthorizationGrant;

        const { uid } = await this.userService.createUser(user_id, user_login, user_name);
        await this.authorizationService.createAuthorization(client_id, uid);
        break;
      }

      case 'user.authorization.revoke': {
        const { client_id, user_id } = event as EventDto.UserAuthorizationRevoke;

        await this.authorizationService.removeAuthorization(client_id, user_id);
        break;
      }

      case 'channel.channel_points_custom_reward_redemption.add': {
        const {
          broadcaster_user_id: to,
          user_id: from,
          user_input: content,
        } = event as EventDto.ChannelPointCustomRewardRedemptionAdd;

        await this.commentService.createComment(to, from, content);
        break;
      }
    }
  }
}
