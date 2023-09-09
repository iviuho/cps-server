import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Token, TokenType } from '@src/entity/token';

import { ConfigService } from '@src/config/config.service';
import { TokenResponse, UserAccessTokenResponse, ValidateTokenResponse } from '@src/api/api.interface';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  private async getAppAccessToken() {
    const response = await this.httpService.axiosRef.post<TokenResponse>(
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

  private async getUserAccessToken(code: string) {
    const response = await this.httpService.axiosRef.post<UserAccessTokenResponse>(
      'https://id.twitch.tv/oauth2/token',
      {
        client_id: this.configService.clientId,
        client_secret: this.configService.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/webhook',
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data;
  }

  private async refreshToken({ refreshToken }: Token) {
    const response = await this.httpService.axiosRef.post<TokenResponse>(
      'https://id.twitch.tv/oauth2/token',
      {
        client_id: this.configService.clientId,
        client_secret: this.configService.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data;
  }

  private async validateToken({ token }: Token) {
    const response = await this.httpService.axiosRef.get<ValidateTokenResponse>(
      'https://id.twitch.tv/oauth2/validate',
      { headers: { Authorization: `OAuth ${token}` } }
    );

    return response.status === 200;
  }

  private async saveToken(type: TokenType, response: TokenResponse | UserAccessTokenResponse): Promise<Token> {
    switch (type) {
      case TokenType.App:
        return await this.tokenRepository.save({
          expiresIn: response.expires_in,
          token: response.access_token,
          type: TokenType.App,
        });

      case TokenType.User:
        const { access_token, refresh_token, scope } = response as UserAccessTokenResponse;

        return await this.tokenRepository.save({
          expiresIn: response.expires_in,
          refreshToken: refresh_token,
          scopes: scope,
          token: access_token,
          type: TokenType.User,
        });

      default:
        throw new Error(`unknown token type: ${type}`);
    }
  }

  async getToken(type: TokenType): Promise<Token> {
    const token = await this.tokenRepository.findOne({
      order: { createdAt: 'DESC' },
      where: { type },
    });

    let response: TokenResponse;

    if (token) {
      const isValid = await this.validateToken(token);

      if (isValid) {
        return token;
      }

      console.log(`token is expired: ${token.token}`);

      switch (type) {
        case TokenType.App:
          console.log('regenerate app access token from api');
          response = await this.getAppAccessToken();
          return await this.saveToken(type, response);

        case TokenType.User:
          console.log('refresh user access token from api');
          response = await this.refreshToken(token);
          return await this.saveToken(type, response);
      }
    }

    console.log('token is not found');

    switch (type) {
      case TokenType.App:
        console.log('generate app access token from api');
        response = await this.getAppAccessToken();
        return await this.saveToken(type, response);

      case TokenType.User:
        throw new Error('user access token is not found');
    }
  }

  async generateUserAccessToken(code: string): Promise<Token> {
    const response = await this.getUserAccessToken(code);
    return await this.saveToken(TokenType.User, response);
  }
}
