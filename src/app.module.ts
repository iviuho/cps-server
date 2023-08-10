import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppAccessToken } from './entity/token';
import { User } from './entity/user';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
        entities: [AppAccessToken, User],
        synchronize: true,
      }),
    }),
    TokenModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
