import * as dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); // NO SACAR

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); //si llegan campos que no estan en el dto los ignora
  
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();