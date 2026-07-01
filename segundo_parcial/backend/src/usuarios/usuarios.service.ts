import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../auth/entities/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async listar() {
  return await this.usuarioModel.find().sort({ _id: -1 }); //ordeno por fecha de creacion mas reciente
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
    const usuario = await this.usuarioModel.create(datos);
    return usuario;
  }
}