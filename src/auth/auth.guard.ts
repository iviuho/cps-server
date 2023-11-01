import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { JwtPayload } from '@src/twitch/api.interface';

export interface Payload extends JwtPayload {
  user_id: string;
}

export interface AuthRequest extends Request {
  authorization: string;
  payload: Payload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    switch (type) {
      case 'Bearer':
      case 'Extension':
        return token;

      default:
        throw new UnauthorizedException();
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      console.log(payload);

      if (payload.user_id === undefined) {
        throw new Error('user id is not found');
      }

      request.authorization = token;
      request.payload = payload as Payload;
    } catch (err) {
      if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
        console.error(err.message);
      }

      throw new UnauthorizedException();
    }

    return true;
  }
}
