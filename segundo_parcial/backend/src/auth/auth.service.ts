import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async registro(datos: any, foto?: Express.Multer.File) {
    console.log('datos recibidos:', datos);
    console.log('contrasena:', datos.contrasena);
    console.log('keys:', Object.keys(datos));
    console.log('datos recibidos:', datos);
    console.log('foto recibida:', foto?.originalname);
    try {
      let urlFoto = '';
      
      if (foto) {
        const { v2: cloudinary } = require('cloudinary');
        const resultado = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'perfiles', public_id: `IMG_${Date.now()}` },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(foto.buffer);
        });
        urlFoto = (resultado as any).secure_url;
      }

      const contrasena = datos.contrasena;
      const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);
      const usuarioCreado = await this.usuarioModel.create({
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        username: datos.username,
        contrasena: contrasenaEncriptada,
        fechaNacimiento: datos.fechaNacimiento,
        descripcion: datos.descripcion,
        fotoPerfil: urlFoto,
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
    } catch (error) {
      console.error('Error en registro:', error);
      throw new UnauthorizedException('Error al registrar el usuario');
    }
  }

  async login(datos: LoginDto) {
    try {
      const usuario = await this.usuarioModel.findOne({
        $or: [{ email: datos.usuario }, { username: datos.usuario }],
      });

      if (!usuario) throw new Error();

      const contrasenaValida = await bcrypt.compare(datos.contrasena, usuario.contrasena);
      if (!contrasenaValida) throw new Error();

      if (!usuario.activo) {
        throw new UnauthorizedException('Tu cuenta está deshabilitada');
      }

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

  async autorizar(token: string) {
    try {
      const verificado = verify(token, process.env.CLAVE_SUPERSECRETA!);
      const { _id } = verificado as { _id: string };
      const usuario = await this.usuarioModel.findById(_id);
      if (!usuario) throw new Error();
      return usuario;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async refrescar(token: string) {
    try {
      const verificado = verify(token, process.env.CLAVE_SUPERSECRETA!);
      const { email, _id, rol } = verificado as { email: string; _id: string; rol: string };

      const nuevoToken = sign(
        { email, _id, rol },
        process.env.CLAVE_SUPERSECRETA!,
        { algorithm: 'HS256', expiresIn: '15m' }
      );

      return { token: nuevoToken };
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}