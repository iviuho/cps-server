import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Config } from '@src/entity/config';

import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { JwtModule } from '@src/utils/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Config]), JwtModule],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
