import * as dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); // NO SACAR

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //para que pueda correr desde dos puertos distintos y no de error
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();