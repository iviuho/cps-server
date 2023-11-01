import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from '@src/entity/token';

import { ConfigModule } from '@src/utils/config/config.module';
import { JwtModule } from '@src/utils/jwt/jwt.module';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), HttpModule, ConfigModule, JwtModule],
  exports: [TokenService],
  providers: [TokenService],
})
export class TokenModule {}
