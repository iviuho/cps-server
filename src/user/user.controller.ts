import { Controller, Param, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':uid')
  async getUser(@Param('uid') uid: string) {
    // API에서 해당 유저 정보 받아온 후 업데이트 사항이 있다면 업데이트
    return await this.userService.findOne(uid);
  }

  @Get()
  async getUsers() {
    return await this.userService.findAll();
  }
}
