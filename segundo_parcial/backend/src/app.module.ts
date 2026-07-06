import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

// en app se registran todos los modulos (auth, usuarios, publicaciones, cloudinary)
// se registra la conexion con mongo db

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRoot(process.env.MONGO_URI!),
  AuthModule,
  UsuariosModule,
  PublicacionesModule,
  CloudinaryModule,
],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,//validator global
    },
  ],
})
export class AppModule {}