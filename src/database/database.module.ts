import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Authorization } from '@src/entity/authorization';
import { Comment } from '@src/entity/comment';
import { Token } from '@src/entity/token';
import { User } from '@src/entity/user';

import { ConfigModule } from '@src/config/config.module';
import { ConfigService } from '@src/config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        entities: [Authorization, Comment, Token, User],
        synchronize: true,
        timezone: 'Z',
        ...configService.rds,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
