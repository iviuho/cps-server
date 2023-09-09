import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

interface RdsConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get clientId() {
    return this.nestConfigService.getOrThrow<string>('TWITCH_CLIENT_ID');
  }

  get clientSecret() {
    return this.nestConfigService.getOrThrow<string>('TWITCH_CLIENT_SECRET');
  }

  get extensionSecret() {
    return this.nestConfigService.getOrThrow<string>('TWITCH_EXTENSION_SECRET');
  }

  get env() {
    return process.env.NODE_ENV === 'production' ? 'production' : 'development';
  }

  get rds(): RdsConfig {
    return {
      host: this.nestConfigService.getOrThrow('RDS_HOST'),
      port: this.nestConfigService.getOrThrow('RDS_PORT'),
      username: this.nestConfigService.getOrThrow('RDS_USERNAME'),
      password: this.nestConfigService.getOrThrow('RDS_PASSWORD'),
      database: this.nestConfigService.getOrThrow('RDS_DATABASE'),
    };
  }
}
