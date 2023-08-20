import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.dev.env',
    }),
  ],
  exports: [ConfigService],
  providers: [ConfigService],
})
export class ConfigModule {}
