import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';

import { AppModule } from '@src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(morgan(':remote-addr :remote-user [:date[iso]] ":method :url" :status :response-time ms'));

  await app.listen(3000);
}

bootstrap();
