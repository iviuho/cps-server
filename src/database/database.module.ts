import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppAccessToken } from '@src/entity/token';
import { Comment } from '@src/entity/comment';
import { User } from '@src/entity/user';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('RDS_HOST'),
        port: configService.get<number>('RDS_PORT'),
        username: configService.get<string>('RDS_USERNAME'),
        password: configService.get<string>('RDS_PASSWORD'),
        database: configService.get<string>('RDS_DATABASE'),
        entities: [AppAccessToken, Comment, User],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
