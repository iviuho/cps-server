import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppAccessToken } from '../../entity/token';

import { ConfigService } from '@nestjs/config';

interface TokenApiResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(AppAccessToken)
    private readonly tokenRepository: Repository<AppAccessToken>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  get clientId(): string {
    return this.configService.getOrThrow('TWITCH_CLIENT_ID');
  }

  get clientSecret(): string {
    return this.configService.getOrThrow('TWITCH_CLIENT_SECRET');
  }

  private async getTokenFromApi() {
    const response = await this.httpService.axiosRef.post<TokenApiResponse>(
      'https://id.twitch.tv/oauth2/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data;
  }

  private async refreshTokenFromApi({ token }: AppAccessToken) {
    const response = await this.httpService.axiosRef.post<TokenApiResponse>(
      'https://id.twitch.tv/oauth2/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token,
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data;
  }

  private isValidToken({ createdAt, expiresIn }: AppAccessToken) {
    const now = Date.now();
    return now < createdAt.getTime() + expiresIn * 1000;
  }

  saveToken(token: TokenApiResponse) {
    return this.tokenRepository.create({
      expiresIn: token.expires_in,
      token: token.access_token,
    });
  }

  async findLatestToken() {
    const token = await this.tokenRepository.findOne({
      order: { createdAt: 'DESC' },
      select: {
        createdAt: true,
        expiresIn: true,
        id: true,
        token: true,
      },
      where: {},
    });

    let newToken: TokenApiResponse;

    if (token) {
      if (this.isValidToken(token)) {
        return token;
      }

      newToken = await this.refreshTokenFromApi(token);
    } else {
      newToken = await this.getTokenFromApi();
    }

    return this.saveToken(newToken);
  }
}
