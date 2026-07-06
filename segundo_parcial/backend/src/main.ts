import * as dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); // NO SACAR

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; //importo app module que tiene todas las importaciones
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: false }));; //dejar en false por el form-data, asi acepta campos extra
  
  app.enableCors(); //para que el frontend de vercel haga peticiones al back

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();