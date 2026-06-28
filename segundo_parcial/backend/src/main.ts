import * as dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); // NO SACAR

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))
  
  app.enableCors({origin '*'}); //para que pueda correr desde dos puertos distintos y no de error
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();