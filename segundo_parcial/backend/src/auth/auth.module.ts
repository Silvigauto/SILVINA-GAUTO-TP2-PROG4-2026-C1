import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './entities/usuario.schema';
import { Login, LoginSchema } from './entities/login.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // para el registro que necesita subir la foto de perfil

// el archivo auth que conecta con las entities y con el controller y service

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Login.name, schema: LoginSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {} // exporta la clase para que la use app.module.ts