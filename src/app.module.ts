import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@src/auth/auth.module';
import { AuthorizationModule } from '@src/authorization/authorization.module';
import { CommentModule } from '@src/comment/comment.module';
import { DatabaseModule } from '@src/database/database.module';
import { EventsubModule } from '@src/eventsub/eventsub.module';
import { UserModule } from '@src/user/user.module';
import { WebhookModule } from '@src/webhook/webhook.module';

@Module({
  imports: [AuthModule, AuthorizationModule, CommentModule, DatabaseModule, EventsubModule, UserModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
