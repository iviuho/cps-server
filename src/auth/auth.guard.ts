import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JsonWebTokenError } from 'jsonwebtoken';

import { JwtPayload } from '@src/api/api.interface';

export interface AuthRequest extends Request {
  payload: JwtPayload;
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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      console.log(payload);

      request.payload = payload;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        console.error(err.message);
      }

      throw new UnauthorizedException();
    }

    return true;
  }
}
