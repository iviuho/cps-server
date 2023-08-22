import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Eventsub } from '@src/entity/eventsub';

import { ApiModule } from '@src/api/api.module';
import { EventsubService } from './eventsub.service';
import { EventsubController } from './eventsub.controller';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Eventsub]), ApiModule, UserModule],
  exports: [EventsubService],
  controllers: [EventsubController],
  providers: [EventsubService],
})
export class EventsubModule {}
