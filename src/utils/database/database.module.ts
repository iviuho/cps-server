import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Authorization } from '@src/entity/authorization';
import { Config } from '@src/entity/config';
import { Token } from '@src/entity/token';
import { User } from '@src/entity/user';

import { ConfigModule } from '@src/utils/config/config.module';
import { ConfigService } from '@src/utils/config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        entities: [Authorization, Config, Token, User],
        synchronize: true,
        timezone: 'Z',
        ...configService.rds,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
