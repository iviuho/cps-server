import { Controller, Get, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import qs from 'qs';

import { TokenType } from '@src/entity/token';

import { AuthGuard, AuthRequest } from './auth.guard';
import { ApiService } from '@src/api/api.service';
import { TokenService } from '@src/api/token/token.service';
import { UserService } from '@src/user/user.service';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly apiService: ApiService,
    private readonly tokenSerivce: TokenService,
    private readonly userService: UserService
  ) {}

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

  @Get('redirect')
  async getRedirectUri(@Req() req: AuthRequest) {
    const { user_id: uid } = req.payload;

    if (uid === undefined) {
      throw new Error('uid is not found');
    }

    const externalToken = this.tokenSerivce.generateExternalToken(uid);
    const extension = await this.apiService.getExtension(externalToken);
    console.log(extension);

    const BASE_URL = 'https://id.twitch.tv/oauth2/authorize';
    const QUERY = qs.stringify(
      {
        client_id: 'ydvoimm1fy8ps5h21oxx9hmocdaaey',
        force_verify: false,
        redirect_uri: `${extension.views.panel.viewer_url}/#redirect`,
        response_type: 'code',
        scope: 'channel:read:redemptions',
      },
      { addQueryPrefix: true }
    );

    return BASE_URL + QUERY;
  }
}
