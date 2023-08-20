import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppAccessToken } from '@src/entity/token';

import { ConfigService } from '@src/config/config.service';
import { ValidateTokenApiResponse } from '@src/api/api.interface';

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
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  private async getTokenFromApi() {
    const response = await this.httpService.axiosRef.post<TokenApiResponse>(
      'https://id.twitch.tv/oauth2/token',
      {
        client_id: this.configService.clientId,
        client_secret: this.configService.clientSecret,
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
        client_id: this.configService.clientId,
        client_secret: this.configService.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token,
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data;
  }

  private async validateTokenFromApi({ token }: AppAccessToken) {
    const response = await this.httpService.axiosRef.get<ValidateTokenApiResponse>(
      'https://id.twitch.tv/oauth2/validate',
      { headers: { Authorization: `OAuth ${token}` } }
    );

    return response.status === 200;
  }

  saveToken(token: TokenApiResponse) {
    return this.tokenRepository.save({
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
        token: true,
      },
      where: {},
    });

    let newToken: TokenApiResponse;

    if (token) {
      const isValid = await this.validateTokenFromApi(token);

      if (isValid) {
        return token;
      }

      console.log('refresh token from api');
      newToken = await this.refreshTokenFromApi(token);
    } else {
      console.log('generate token from api');
      newToken = await this.getTokenFromApi();
    }

    return this.saveToken(newToken);
  }
}
