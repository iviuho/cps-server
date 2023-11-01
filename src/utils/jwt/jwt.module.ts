import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    Jwt.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ secret: Buffer.from(configService.extensionSecret, 'base64') }),
    }),
  ],
  exports: [Jwt],
})
export class JwtModule {}
