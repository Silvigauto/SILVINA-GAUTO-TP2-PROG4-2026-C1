import { Injectable, UnauthorizedException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../auth/entities/usuario.schema';
import { Visita } from '../auth/entities/visita.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    @InjectModel(Visita.name) private visitaModel: Model<Visita>,
  ) {}

  async listar() {
    return await this.usuarioModel.find().sort({ _id: -1 });
  }

  async deshabilitar(id: string) {
    await this.usuarioModel.updateOne({ _id: id }, { activo: false });
    return { mensaje: 'Usuario deshabilitado' };
  }

  async habilitar(id: string) {
    await this.usuarioModel.updateOne({ _id: id }, { activo: true });
    return { mensaje: 'Usuario habilitado' };
  }

  async crear(datos: any) {
    try {
      const contrasenaEncriptada = await bcrypt.hash(datos.contrasena, 10);
      const usuario = await this.usuarioModel.create({
        ...datos,
        contrasena: contrasenaEncriptada,
      });
      return usuario;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('El email o nombre de usuario ya existe');
      }
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async obtenerUno(id: string, visitanteId?: string) {
    if (visitanteId && visitanteId !== id) {
      await this.visitaModel.create({
        visitante: visitanteId,
        perfilVisitado: id,
      });
    }
    return await this.usuarioModel.findById(id).select('-contrasena');
  }
}