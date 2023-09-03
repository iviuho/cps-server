import { Module } from '@nestjs/common';

import { ConfigModule } from '@src/config/config.module';
import { CommentModule } from '@src/comment/comment.module';
import { EventsubModule } from '@src/eventsub/eventsub.module';
import { GrantModule } from '@src/grant/grant.module';
import { UserModule } from '@src/user/user.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [ConfigModule, CommentModule, EventsubModule, GrantModule, UserModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
