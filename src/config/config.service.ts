import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Config, ConfigType } from '@src/entity/config';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>
  ) {}

  async getConfig(type: ConfigType, uid: string) {
    return await this.configRepository.findOneByOrFail({ type, user: { uid } });
  }

  async setConfig(type: ConfigType, uid: string, body: any) {
    const config = await this.configRepository.findOne({ where: { type, user: { uid } } });

    if (config) {
      return await this.configRepository.save({ ...config, data: JSON.stringify(body) });
    }

    return await this._createConfig(type, uid, body);
  }

  private async _createConfig(type: ConfigType, uid: string, body: any) {
    return await this.configRepository.save({
      type,
      user: { uid },
      data: JSON.stringify(body),
    });
  }
}
