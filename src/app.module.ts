import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from '@src/comment/comment.module';
import { DatabaseModule } from '@src/database/database.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [DatabaseModule, CommentModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
