import { BadRequestException, Body, Controller, Header, Headers, Post, UseGuards } from '@nestjs/common';

import { EventsubHeader, EventsubMessageType, WebhookDto } from '@src/api/api.interface';
import { WebhookGuard } from './webhook.guard';

@Controller('webhook')
export class WebhookController {
  @UseGuards(WebhookGuard)
  @Post()
  @Header('Content-Type', 'text/plain')
  async listener(@Headers(EventsubHeader.MESSAGE_TYPE) messageType: EventsubMessageType, @Body() body: WebhookDto) {
    const { subscription } = body;

    switch (messageType) {
      case EventsubMessageType.NOTIFICATION:
        console.log(`webhook notification: ${subscription.id} - ${subscription.type}`);
        // handle event
        break;

      case EventsubMessageType.VERIFICATION:
        console.log(`webhook verification: ${subscription.id} - ${subscription.type}`);
        // update eventsub
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
