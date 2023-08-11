import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppAccessToken } from '@src/entity/token';

import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppAccessToken]), HttpModule],
  exports: [TokenService],
  providers: [TokenService],
})
export class TokenModule {}
