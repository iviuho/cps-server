import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Token, TokenType } from '@src/entity/token';

import { ConfigService } from '@src/config/config.service';
import { TokenResponse, UserAccessTokenResponse, ValidateTokenResponse } from '@src/twitch/api.interface';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
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

    return response.data;
  }

  private async saveToken(
    type: TokenType,
    response: TokenResponse | UserAccessTokenResponse,
    uid?: string
  ): Promise<Token> {
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
          owner: { uid },
          refreshToken: refresh_token,
          scopes: scope,
          token: access_token,
          type: TokenType.User,
        });

      default:
        throw new Error(`unknown token type: ${type}`);
    }
  }

  async getToken(type: TokenType, uid?: string): Promise<Token> {
    const token = await this.tokenRepository.findOne({
      order: { createdAt: 'DESC' },
      where: { type, owner: { uid } },
    });

    let response: TokenResponse;

    if (token) {
      try {
        const validation = await this.validateToken(token);

        if (validation) {
          await this.tokenRepository.save({
            expiresIn: validation.expires_in,
            owner: { uid: validation.user_id },
            token: token.token,
          });

          return token;
        }
      } catch {
        console.error('validate token failed');
      }

      console.log(`token is expired: ${token.token}`);
      await this.tokenRepository.remove(token);

      switch (type) {
        case TokenType.App:
          console.log('regenerate app access token from api');
          response = await this.getAppAccessToken();
          return await this.saveToken(type, response);

        case TokenType.User:
          console.log('refresh user access token from api');
          response = await this.refreshToken(token);
          return await this.saveToken(type, response, uid);
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

  async generateUserAccessToken(code: string, uid?: string): Promise<Token> {
    const response = await this.getUserAccessToken(code);
    return await this.saveToken(TokenType.User, response, uid);
  }

  generateExternalToken(uid: string): string {
    const payload = {
      user_id: uid,
      role: 'external',
    };

    return this.jwtService.sign(payload, { expiresIn: '1 days' });
  }
}
