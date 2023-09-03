import { Controller, Get, Param } from '@nestjs/common';
import { GrantService } from './grant.service';

@Controller('grant')
export class GrantController {
  constructor(private readonly grantService: GrantService) {}

  @Get(':uid')
  async getGrantByUserId(@Param('uid') uid: string) {
    return await this.grantService.getGrantByUserId(uid);
  }
}
