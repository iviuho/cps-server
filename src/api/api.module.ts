import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ApiService } from './api.service';
import { TokenModule } from './token/token.module';

@Module({
  imports: [HttpModule, TokenModule],
  exports: [ApiService],
  providers: [ApiService],
})
export class ApiModule {}
