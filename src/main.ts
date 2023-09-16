import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import * as morgan from 'morgan';
import type { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
// import * as session from 'express-session';

import { AppModule } from '@src/app.module';
// import { ConfigService } from './config/config.service';

async function bootstrap() {
  let httpsOptions: HttpsOptions | undefined;

  switch (process.env.NODE_ENV) {
    case 'development':
      httpsOptions = {
        cert: readFileSync('127.0.0.1.pem'),
        key: readFileSync('127.0.0.1-key.pem'),
      };
      break;
  }

  const app = await NestFactory.create(AppModule, { cors: { credentials: true, origin: true }, httpsOptions });
  // const config = app.get(ConfigService);

  app.use(morgan(':remote-addr :remote-user [:date[iso]] ":method :url" :status :response-time ms'));
  // app.use(
  //   session({
  //     secret: config.extensionSecret,
  //     cookie: { maxAge: 1000 * 600, sameSite: 'none', secure: true },
  //     resave: true,
  //     saveUninitialized: true,
  //   })
  // );

  await app.listen(3000);
}

bootstrap();
