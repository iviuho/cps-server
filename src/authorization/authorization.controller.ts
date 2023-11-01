import { Controller, Get, NotFoundException, Request, UseGuards } from '@nestjs/common';

import { AuthGuard, AuthRequest } from '@src/auth/auth.guard';
import { AuthorizationService } from './authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAuthorizationByUserId(@Request() req: AuthRequest) {
    const { user_id: uid } = req.payload;

    return await this.authorizationService.getAuthorizationByUserId(uid);
  }
}
