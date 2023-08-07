import { Controller, Get } from '@nestjs/common';

import { User } from 'entity/user';
import { UserService } from 'user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':uid')
  async getUser(uid: string): Promise<User | null> {
    return await this.userService.findOne(uid);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
