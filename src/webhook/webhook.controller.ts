import { BadRequestException, Body, Controller, Get, Header, Headers, Post, Query, UseGuards } from '@nestjs/common';

import { EventsubStatus } from '@src/entity/eventsub';

import { AuthResult, EventsubHeader, EventsubMessageType, WebhookDto } from '@src/api/api.interface';
import { EventsubService } from '@src/eventsub/eventsub.service';
import { WebhookGuard } from './webhook.guard';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly eventsubService: EventsubService) {}

  @Get()
  async authListener(@Query() query: AuthResult) {
    let result;

    if (query.code) {
      result = { ...query, scope: query.scope?.split(' ') };
    } else {
      result = { ...query, error_description: query.error_description?.replaceAll('+', ' ') };
    }

    console.log(result);
    return result;
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
        // handle event
        break;

      case EventsubMessageType.VERIFICATION:
        console.log(`webhook verification: ${subscription.id} - ${subscription.type}`);
        await this.eventsubService.changeEventsubStatus(subscription.id, EventsubStatus.ENABLED);
        return body.challenge;

      case EventsubMessageType.REVOCATION:
        console.log(`webhook revocation: ${subscription.id} - ${subscription.type}`);
        // remove eventsub
        break;

      default:
        throw new BadRequestException();
    }
  }
}
