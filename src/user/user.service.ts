import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@src/entity/user';

import { ApiService } from '@src/api/api.service';
import { GetUserType } from '@src/api/api.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly apiService: ApiService
  ) {}

  private async _getUser(type: GetUserType, query: string): Promise<User> {
    try {
      switch (type) {
        case GetUserType.ID:
          return await this.userRepository.findOneOrFail({ where: { uid: query } });

        case GetUserType.LOGIN:
          return await this.userRepository.findOneOrFail({ where: { login: query } });

        default:
          throw new BadRequestException();
      }
    } catch {
      return await this._getUserFromApi(type, query);
    }
  }

  private async _getUserFromApi(type: GetUserType, query: string): Promise<User> {
    let user: User;

    switch (type) {
      case GetUserType.ID:
        user = await this.apiService.getUser({ id: query });
        return await this.userRepository.save(user);

      case GetUserType.LOGIN:
        user = await this.apiService.getUser({ login: query });
        return await this.userRepository.save(user);
    }
  }

  async getUserById(id: string): Promise<User> {
    return await this._getUser(GetUserType.ID, id);
  }

  async getUserByLogin(login: string): Promise<User> {
    return await this._getUser(GetUserType.LOGIN, login);
  }

  async createUser(uid: string, login: string, nickname: string): Promise<User> {
    return await this.userRepository.save({ uid, login, nickname });
  }
}
