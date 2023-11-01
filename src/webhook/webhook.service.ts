import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '@src/authorization/authorization.service';
import { UserService } from '@src/user/user.service';
import * as EventDto from '@src/twitch/event.interface';

@Injectable()
export class WebhookService {
  constructor(private readonly authorizationService: AuthorizationService, private readonly userService: UserService) {}

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
    }
  }
}
