import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

import { ConfigService } from '@src/config/config.service';
import { EventsubHeader } from '@src/api/api.interface';

@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  // Get the HMAC.
  private getHmac(secret: string, message: string) {
    return crypto.createHmac('sha256', secret).update(message).digest('hex');
  }

  // Verify whether your signature matches Twitch's signature.
  private verifyMessage(hmac: string, verifySignature: string) {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
  }

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();

    const id = req.header(EventsubHeader.MESSAGE_ID);
    const timestamp = req.header(EventsubHeader.MESSAGE_TIMESTAMP);
    const signature = req.header(EventsubHeader.MESSAGE_SIGNATURE);
    const body = JSON.stringify(req.body);

    if (id && timestamp && signature) {
      const secret = this.configService.clientSecret;
      const message = id + timestamp + body;
      const hmac = `sha256=${this.getHmac(secret, message)}`; // Signature to compare to Twitch's

      return this.verifyMessage(hmac, signature);
    }

    return false;
  }
}
