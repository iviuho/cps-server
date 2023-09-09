import { BadRequestException, Body, Controller, Get, Header, Headers, Post, Query, UseGuards } from '@nestjs/common';
import * as moment from 'moment';

import {
  AuthFailed,
  AuthPayload,
  AuthSuccess,
  EventsubHeader,
  EventsubMessageType,
  WebhookDto,
} from '@src/api/api.interface';
import { TokenService } from '@src/api/token/token.service';
import { WebhookGuard } from './webhook.guard';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly tokenService: TokenService, private readonly webhookService: WebhookService) {}

  @Get()
  async handleAuthorizationUserRedirection(@Query() query: AuthPayload) {
    if (query.code) {
      const { code, scope } = query as AuthSuccess;
      const token = await this.tokenService.generateUserAccessToken(code);
      console.log({ code, scope: scope.split(' '), token });

      return '성공적으로 권한을 부여했습니다.';
    } else {
      const { error, error_description } = query as AuthFailed;
      console.log({ error, error_description });

      return '권한 부여에 실패했습니다.';
    }
  }

  @UseGuards(WebhookGuard)
  @Post()
  @Header('Content-Type', 'text/plain')
  async eventsubListener(
    @Headers(EventsubHeader.MESSAGE_TYPE) messageType: EventsubMessageType,
    @Headers(EventsubHeader.MESSAGE_TIMESTAMP) timestamp: string,
    @Body() body: WebhookDto
  ) {
    if (moment.utc().diff(timestamp, 'minutes') > 10) {
      console.log(`message_timestamp field is older than 10 minutes: ${timestamp}`);
      return;
    }

    const { subscription } = body;

    switch (messageType) {
      case EventsubMessageType.NOTIFICATION:
        console.log(`webhook notification: ${subscription.id} - ${subscription.type}`);

        await this.webhookService.handleNotification(subscription.type, body.event);
        return;

      case EventsubMessageType.VERIFICATION:
        console.log(`webhook verification: ${subscription.id} - ${subscription.type}`);

        await this.webhookService.handleVerification(subscription.id);
        return body.challenge;

      case EventsubMessageType.REVOCATION:
        console.log(`webhook revocation: ${subscription.id} - ${subscription.type}`);

        await this.webhookService.handleRevocation(subscription.id, subscription.status);
        return;

      default:
        throw new BadRequestException();
    }
  }
}
