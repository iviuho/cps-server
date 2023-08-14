import { Controller, Param, Get, Patch } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') login: string) {
    return await this.userService.getUserByLogin(login);
  }

  @Patch(':id')
  async updateUser(@Param('id') login: string) {
    return await this.userService.getUserByLoginFromApi(login);
  }
}
