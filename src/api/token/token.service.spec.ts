import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token, TokenType } from '@src/entity/token';

import { DatabaseModule } from '@src/database/database.module';
import { TokenService } from '@src/api/token/token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, TypeOrmModule.forFeature([Token]), HttpModule],
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('get latest token', async () => {
    const token = await service.getToken(TokenType.App);
    expect(token).not.toBeNull();
  });
});
