import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { ApiModule } from '@src/api/api.module';
import { TokenModule } from '@src/api/token/token.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [ApiModule, TokenModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
