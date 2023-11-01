import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { ApiModule } from '@src/twitch/api.module';
import { JwtModule } from '@src/utils/jwt/jwt.module';
import { TokenModule } from '@src/twitch/token/token.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [ApiModule, JwtModule, TokenModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
