import { Module } from '@nestjs/common';

import { AuthorizationModule } from '@src/authorization/authorization.module';
import { ConfigModule } from '@src/config/config.module';
import { CommentModule } from '@src/comment/comment.module';
import { EventsubModule } from '@src/eventsub/eventsub.module';
import { UserModule } from '@src/user/user.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [AuthorizationModule, ConfigModule, CommentModule, EventsubModule, UserModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
