import { Controller, Param, Query, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Query('id') login: string) {
    return await this.userService.getUserByLogin(login);
  }
}
