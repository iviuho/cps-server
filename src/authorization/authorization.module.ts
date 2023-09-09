import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Authorization } from '@src/entity/authorization';

import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { ConfigModule } from '@src/config/config.module';
import { ConfigService } from '@src/config/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Authorization]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ secret: Buffer.from(configService.extensionSecret, 'base64') }),
    }),
  ],
  exports: [AuthorizationService],
  controllers: [AuthorizationController],
  providers: [AuthorizationService],
})
export class AuthorizationModule {}
