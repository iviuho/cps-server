import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user';

// business logic

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOne(uid: string) {
    return await this.userRepository.findOneBy({ uid });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async remove(uid: string): Promise<null> {
    await this.userRepository.delete(uid);
    return null;
  }
}
