import { BadRequestException, Body, Controller, Get, Header, Headers, Post, Query, UseGuards } from '@nestjs/common';

import {
  AuthFailed,
  AuthPayload,
  AuthSuccess,
  EventsubHeader,
  EventsubMessageType,
  WebhookDto,
} from '@src/api/api.interface';
import { WebhookGuard } from './webhook.guard';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  async handleGrantUserRedirection(@Query() query: AuthPayload) {
    if (query.code) {
      const { code, scope } = query as AuthSuccess;
      console.log({ code, scope: scope.split(' ') });

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
    @Body() body: WebhookDto
  ) {
    const { subscription } = body;

    switch (messageType) {
      case EventsubMessageType.NOTIFICATION:
        console.log(`webhook notification: ${subscription.id} - ${subscription.type}`);

        await this.webhookService.handleNotification(subscription.type, body.event);
        return;

      case EventsubMessageType.VERIFICATION:
        console.log(`webhook verification: ${subscription.id} - ${subscription.type}`);

        await this.webhookService.enableEventsub(subscription.id);
        return body.challenge;

      case EventsubMessageType.REVOCATION:
        console.log(`webhook revocation: ${subscription.id} - ${subscription.type}`);
        // remove eventsub
        return;

      default:
        throw new BadRequestException();
    }
  }
}
