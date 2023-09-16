import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { ConfigModule } from '@src/config/config.module';
import { ConfigService } from '@src/config/config.service';
import { TokenModule } from '@src/api/token/token.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ secret: Buffer.from(configService.extensionSecret, 'base64') }),
    }),
    TokenModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
