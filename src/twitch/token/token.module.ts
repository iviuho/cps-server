import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from '@src/entity/token';

import { ConfigModule } from '@src/utils/config/config.module';
import { ConfigService } from '@src/utils/config/config.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ secret: Buffer.from(configService.extensionSecret, 'base64') }),
    }),
    TypeOrmModule.forFeature([Token]),
    HttpModule,
    ConfigModule,
  ],
  exports: [JwtModule, TokenService],
  providers: [TokenService],
})
export class TokenModule {}
