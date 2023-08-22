import { Module } from '@nestjs/common';

import { ConfigModule } from '@src/config/config.module';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [ConfigModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
