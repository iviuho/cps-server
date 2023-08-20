import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppAccessToken } from '@src/entity/token';
import { Comment } from '@src/entity/comment';
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
        entities: [AppAccessToken, Comment, User],
        synchronize: true,
        ...configService.rds,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
