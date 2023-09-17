import { Controller, BadRequestException, Get, Query } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Query('id') id: string, @Query('login') login: string) {
    if (id) {
      return await this.userService.getUserById(id);
    } else if (login) {
      return await this.userService.getUserByLogin(login);
    }

    throw new BadRequestException();
  }
}
