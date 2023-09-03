import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Grant } from '@src/entity/grant';

@Injectable()
export class GrantService {
  constructor(
    @InjectRepository(Grant)
    private readonly grantRepository: Repository<Grant>
  ) {}

  async getGrantByUserId(uid: string): Promise<Grant> {
    try {
      return await this.grantRepository.findOneOrFail({ where: { user: { uid } } });
    } catch {
      throw new NotFoundException();
    }
  }

  async createGrant(clientId: string, uid: string): Promise<Grant> {
    const grant = await this.grantRepository.findOne({ where: { user: { uid } } });

    if (grant) {
      return await this.grantRepository.save({ ...grant, updatedAt: new Date() });
    }

    return await this.grantRepository.save({ clientId, user: { uid } });
  }
}
