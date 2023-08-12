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

  async getUserByLogin(login: string) {
    const response = await this.apiService.getUser({ login });

    if (response.data.length > 0) {
      const { display_name: nickname, id: uid } = response.data[0];
      const user: User = { login, nickname, uid };

      return this.userRepository.save(user);
    }

    return null;
  }
}
