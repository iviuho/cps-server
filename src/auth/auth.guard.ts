import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

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

  canActivate(context: ExecutionContext): boolean {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      request.payload = payload;
      console.log(payload);
    } catch (err) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
