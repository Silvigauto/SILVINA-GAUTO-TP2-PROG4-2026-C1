import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from './entities/publicacion.schema';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
  ) {}

  async crear(datos: CrearPublicacionDto, usuarioId: string) {
    const publicacion = await this.publicacionModel.create({
      ...datos,
      usuario: usuarioId,
    });
    return publicacion;
  }

  async listar(orden: string = 'fecha', limite: number = 10, offset: number = 0, usuarioId?: string) {
    const filtro: any = { activo: true };
    if (usuarioId) filtro.usuario = usuarioId;

    const publicaciones = await this.publicacionModel
      .find(filtro)
      .sort({ createdAt: -1 })
      .skip(Number(offset) || 0)
      .limit(Number(limite) || 10)
      .populate('usuario', 'nombre apellido username fotoPerfil');

    return publicaciones;
  }

  async eliminar(id: string, usuarioId: string, rol: string) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new UnauthorizedException('Publicación no encontrada');

    if (publicacion.usuario.toString() !== usuarioId && rol !== 'administrador') {
      throw new UnauthorizedException('No tenés permiso para eliminar esta publicación');
    }

    await this.publicacionModel.updateOne({ _id: id }, { activo: false });
    return { mensaje: 'Publicación eliminada' };
  }

  async darLike(id: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new UnauthorizedException('Publicación no encontrada');
    console.log('id publicacion:', id);
    console.log('usuarioId:', usuarioId);

    const yaLikeo = publicacion.likes.some(like => like.toString() === usuarioId);
    if (yaLikeo) throw new UnauthorizedException('Ya le diste like a esta publicación');

    await this.publicacionModel.updateOne({ _id: id }, { $push: { likes: usuarioId } });
    return { mensaje: 'Like agregado' };
  }

  async quitarLike(id: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new UnauthorizedException('Publicación no encontrada');

    const yaLikeo = publicacion.likes.some(like => like.toString() === usuarioId);
    if (!yaLikeo) throw new UnauthorizedException('No le diste like a esta publicación');

    await this.publicacionModel.updateOne({ _id: id }, { $pull: { likes: usuarioId } });
    return { mensaje: 'Like eliminado' };
  }
}