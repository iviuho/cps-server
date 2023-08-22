import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from '@src/comment/comment.module';
import { DatabaseModule } from '@src/database/database.module';
import { EventsubModule } from '@src/eventsub/eventsub.module';
import { UserModule } from '@src/user/user.module';
import { WebhookModule } from '@src/webhook/webhook.module';

@Module({
  imports: [DatabaseModule, CommentModule, EventsubModule, UserModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
