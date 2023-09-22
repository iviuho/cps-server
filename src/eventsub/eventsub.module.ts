import { Module } from '@nestjs/common';

import { ApiModule } from '@src/api/api.module';
import { EventsubService } from './eventsub.service';
import { EventsubController } from './eventsub.controller';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [ApiModule, UserModule],
  controllers: [EventsubController],
  providers: [EventsubService],
})
export class EventsubModule {}
