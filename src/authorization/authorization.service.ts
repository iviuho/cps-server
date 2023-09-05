import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Authorization } from '@src/entity/authorization';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Authorization)
    private readonly grantRepository: Repository<Authorization>
  ) {}

  async getGrantByUserId(uid: string): Promise<Authorization> {
    try {
      return await this.grantRepository.findOneOrFail({ where: { user: { uid } } });
    } catch {
      throw new NotFoundException();
    }
  }

  async createGrant(clientId: string, uid: string): Promise<Authorization> {
    const grant = await this.grantRepository.findOne({ where: { user: { uid } } });

    if (grant) {
      return await this.grantRepository.save({ ...grant, updatedAt: new Date() });
    }

    return await this.grantRepository.save({ clientId, user: { uid } });
  }
}
