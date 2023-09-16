import { Controller, Get, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';

import { TokenType } from '@src/entity/token';

import { AuthGuard, AuthRequest } from './auth.guard';
import { TokenService } from '@src/api/token/token.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenSerivce: TokenService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getToken(@Req() req: AuthRequest, @Query('code') code: string) {
    const { user_id: uid } = req.payload;

    if (code) {
      return await this.tokenSerivce.generateUserAccessToken(code, uid);
    }

    try {
      if (!uid) {
        throw new Error('uid is not found');
      }

      return await this.tokenSerivce.getToken(TokenType.User, uid);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
