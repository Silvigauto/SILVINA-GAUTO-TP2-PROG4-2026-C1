import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from './entities/publicacion.schema';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { Comentario } from './entities/comentario.schema';
import { CrearComentarioDto } from './dto/crear-comentario.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
  ) {}

 async crear(datos: any, usuarioId: string, imagen?: Express.Multer.File) {
  console.log('datos:', datos);
  console.log('imagen:', imagen?.originalname);
  let urlImagen = '';

  if (imagen) {
    const { v2: cloudinary } = require('cloudinary');
    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'publicaciones', public_id: `IMG_${Date.now()}` },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(imagen.buffer);
    });
    urlImagen = (resultado as any).secure_url;
  }

  const publicacion = await this.publicacionModel.create({
    titulo: datos.titulo,
    mensaje: datos.mensaje,
    imagen: urlImagen,
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
      .populate('usuario', '_id nombre apellido username fotoPerfil');

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

  async agregarComentario(publicacionId: string, usuarioId: string, datos: CrearComentarioDto) {
  const comentario = await this.comentarioModel.create({
    mensaje: datos.mensaje,
    usuario: usuarioId,
    publicacion: publicacionId,
  });
  return comentario;
  }

  async editarComentario(comentarioId: string, usuarioId: string, mensaje: string) {
    const comentario = await this.comentarioModel.findById(comentarioId);
    if (!comentario) throw new UnauthorizedException('Comentario no encontrado');
    if (comentario.usuario.toString() !== usuarioId) throw new UnauthorizedException('No tenés permiso para editar este comentario');

    await this.comentarioModel.updateOne({ _id: comentarioId }, { mensaje, modificado: true });
    return { mensaje: 'Comentario editado' };
  }

  async listarComentarios(publicacionId: string, limite: number = 5, offset: number = 0) {
    const comentarios = await this.comentarioModel
      .find({ publicacion: publicacionId })
      .sort({ createdAt: -1 })
      .skip(Number(offset) || 0)
      .limit(Number(limite) || 5)
      .populate('usuario', 'nombre apellido username');

    return comentarios;
  }

  async obtenerUna(id: string) {
  const publicacion = await this.publicacionModel
    .findById(id)
    .populate('usuario', 'nombre apellido username fotoPerfil');
  return publicacion;
}
}