import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.schema';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async registro(datos: RegistroDto) {
    try {
      const contraseñaEncriptada = await bcrypt.hash(datos.contraseña, 10);

      const usuarioCreado = await this.usuarioModel.create({
        ...datos,
        contraseña: contraseñaEncriptada,
      });

      const payload = {
        email: usuarioCreado.email,
        _id: usuarioCreado._id,
        rol: usuarioCreado.rol,
      };

      const jwt = sign(payload, process.env.CLAVE_SUPERSECRETA!, {
        algorithm: 'HS256',
        expiresIn: '15m',
      });

      return { token: jwt, usuario: usuarioCreado };
    } catch {
      throw new UnauthorizedException('Error al registrar el usuario');
    }
  }

  async login(datos: LoginDto) {
    try {
      const usuario = await this.usuarioModel.findOne({
        $or: [{ email: datos.usuario }, { username: datos.usuario }],
      });

      if (!usuario) throw new Error();

      const contraseñaValida = await bcrypt.compare(datos.contraseña, usuario.contraseña);

      if (!contraseñaValida) throw new Error();

      const payload = {
        email: usuario.email,
        _id: usuario._id,
        rol: usuario.rol,
      };

      const jwt = sign(payload, process.env.CLAVE_SUPERSECRETA!, {
        algorithm: 'HS256',
        expiresIn: '15m',
      });

      return { token: jwt, usuario };
    } catch {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
  }
}