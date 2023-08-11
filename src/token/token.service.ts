import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppAccessToken } from '../entity/token';

interface TokenApiResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class TokenService {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    @InjectRepository(AppAccessToken)
    private readonly tokenRepository: Repository<AppAccessToken>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    const clientId = this.configService.getOrThrow('TWITCH_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow('TWITCH_CLIENT_SECRET');

    this.clientId = clientId;
    this.clientSecret = clientSecret;

    console.log(`clientId: ${clientId}`);
    console.log(`clientSecret: ${clientSecret}`);
  }

  async getTokenFromApi(): Promise<TokenApiResponse> {
    const response = await this.httpService.axiosRef.post(
      'https://id.twitch.tv/oauth2/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      }
    );

    return response.data;
  }

  saveToken(token: TokenApiResponse) {
    return this.tokenRepository.create({
      expiresIn: token.expires_in,
      token: token.access_token,
    });
  }

  async findLatestToken() {
    return await this.tokenRepository.findOne({
      order: { createdAt: 'DESC' },
      select: {
        createdAt: true,
        expiresIn: true,
        id: true,
        token: true,
      },
      where: {},
    });
  }
}
