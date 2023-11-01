import { Module } from '@nestjs/common';

import { ApiModule } from '@src/twitch/api.module';
import { EventsubService } from './eventsub.service';
import { EventsubController } from './eventsub.controller';
import { TokenModule } from '@src/twitch/token/token.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [ApiModule, TokenModule, UserModule],
  controllers: [EventsubController],
  providers: [EventsubService],
})
export class EventsubModule {}
