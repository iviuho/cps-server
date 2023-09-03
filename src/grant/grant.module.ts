import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Grant } from '@src/entity/grant';

import { GrantController } from './grant.controller';
import { GrantService } from './grant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grant])],
  exports: [GrantService],
  controllers: [GrantController],
  providers: [GrantService],
})
export class GrantModule {}
