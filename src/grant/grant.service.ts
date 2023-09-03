import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Grant } from '@src/entity/grant';
import { User } from '@src/entity/user';

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

  async createGrant(clientId: string, user: User): Promise<Grant> {
    return await this.grantRepository.save({ clientId, user });
  }
}
