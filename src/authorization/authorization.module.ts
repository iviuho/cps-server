import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Authorization } from '@src/entity/authorization';

import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { JwtModule } from '@src/utils/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Authorization]), JwtModule],
  exports: [AuthorizationService],
  controllers: [AuthorizationController],
  providers: [AuthorizationService],
})
export class AuthorizationModule {}
