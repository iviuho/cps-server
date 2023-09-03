import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@src/entity/user';

import { ApiService } from '@src/api/api.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly apiService: ApiService
  ) {}

  async getUserByLogin(login: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { login } });
    } catch {
      return this.getUserByLoginFromApi(login);
    }
  }

  async getUserByLoginFromApi(login: string): Promise<User> {
    const userDataFromApi = await this.apiService.getUser({ login });
    return await this.userRepository.save(userDataFromApi);
  }

  async createUser(uid: string, login: string, nickname: string): Promise<User> {
    return await this.userRepository.save({ uid, login, nickname });
  }
}
