import { Controller, Get, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';

import { TokenType } from '@src/entity/token';

import { AuthGuard, AuthRequest } from './auth.guard';
import { TokenService } from '@src/api/token/token.service';
import { UserService } from '@src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenSerivce: TokenService, private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getToken(@Req() req: AuthRequest, @Query('code') code: string) {
    const { user_id: uid } = req.payload;

    if (uid === undefined) {
      throw new Error('uid is not found');
    }

    if (code) {
      await this.userService.getUserById(uid);
      return await this.tokenSerivce.generateUserAccessToken(code, uid);
    }

    try {
      return await this.tokenSerivce.getToken(TokenType.User, uid);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
