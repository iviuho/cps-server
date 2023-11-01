import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { ApiModule } from '@src/twitch/api.module';
import { TokenModule } from '@src/twitch/token/token.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [ApiModule, TokenModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
