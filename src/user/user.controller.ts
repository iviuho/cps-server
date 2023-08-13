import { Controller, Param, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') login: string) {
    return await this.userService.getUserByLogin(login);
  }

  @Get(':id/comment')
  async getComments(@Param('id') login: string) {
    return await this.userService.getCommentsByLogin(login);
  }
}
