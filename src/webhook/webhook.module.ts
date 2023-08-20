import { Module } from '@nestjs/common';

import { ConfigModule } from '@src/config/config.module';
import { EventsubModule } from '@src/api/eventsub/eventsub.module';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [ConfigModule, EventsubModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
