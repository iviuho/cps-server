import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Authorization } from '@src/entity/authorization';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>
  ) {}

  async getAuthorizationByUserId(uid: string): Promise<Authorization> {
    try {
      return await this.authorizationRepository.findOneOrFail({ where: { user: { uid } } });
    } catch {
      throw new NotFoundException();
    }
  }

  async createAuthorization(clientId: string, uid: string): Promise<Authorization> {
    const authorization = await this.authorizationRepository.findOne({ where: { user: { uid } } });

    if (authorization) {
      return await this.authorizationRepository.save({ ...authorization, updatedAt: new Date() });
    }

    return await this.authorizationRepository.save({ clientId, user: { uid } });
  }

  async removeAuthorization(clientId: string, uid: string): Promise<Authorization> {
    return await this.authorizationRepository.softRemove({ clientId, user: { uid } });
  }
}
