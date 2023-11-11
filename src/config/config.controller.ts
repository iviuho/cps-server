import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';

import { ConfigType } from '@src/entity/config';

import { AuthGuard, AuthRequest } from '@src/auth/auth.guard';
import { ConfigService } from './config.service';

@UseGuards(AuthGuard)
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getConfig(@Req() req: AuthRequest, @Query('type') type: string) {
    const { user_id: uid } = req.payload;

    switch (type) {
      case ConfigType.Comment:
        return await this.configService.getConfig(type, uid);
    }

    throw new BadRequestException();
  }

  @Post()
  async setConfig(@Req() req: AuthRequest, @Query('type') type: string, @Body() body: any) {
    const { user_id: uid } = req.payload;

    switch (type) {
      case ConfigType.Comment:
        return await this.configService.setConfig(type, uid, body);
    }

    throw new BadRequestException();
  }
}
