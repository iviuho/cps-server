import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ApiService } from './api.service';
import { ConfigModule } from '@src/utils/config/config.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [HttpModule, ConfigModule, TokenModule],
  exports: [ApiService],
  providers: [ApiService],
})
export class ApiModule {}
