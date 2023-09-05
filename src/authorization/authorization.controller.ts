import { Controller, Get, Param } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Get(':uid')
  async getGrantByUserId(@Param('uid') uid: string) {
    return await this.authorizationService.getGrantByUserId(uid);
  }
}
