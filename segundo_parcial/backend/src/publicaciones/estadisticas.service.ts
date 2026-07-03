import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from './entities/publicacion.schema';
import { Comentario } from './entities/comentario.schema';
import { Login } from '../auth/entities/login.schema';
import { Visita } from '../auth/entities/visita.schema';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
    @InjectModel(Login.name) private loginModel: Model<Login>,
    @InjectModel(Visita.name) private visitaModel: Model<Visita>,
  ) {}

  private getFechaHasta(hasta: string): Date {
    const fecha = new Date(hasta);
    fecha.setHours(23, 59, 59, 999);
    return fecha;
  }

  async publicacionesPorUsuario(desde: string, hasta: string) {
    return await this.publicacionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(desde), $lte: this.getFechaHasta(hasta) },
          activo: true,
        },
      },
      { $group: { _id: '$usuario', total: { $sum: 1 } } },
      { $lookup: { from: 'usuarios', localField: '_id', foreignField: '_id', as: 'usuario' } },
      { $unwind: '$usuario' },
      { $project: { nombre: '$usuario.nombre', apellido: '$usuario.apellido', total: 1 } },
    ]);
  }

  async comentariosPorTiempo(desde: string, hasta: string) {
    return await this.comentarioModel.aggregate([
      { $match: { createdAt: { $gte: new Date(desde), $lte: this.getFechaHasta(hasta) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  }

  async comentariosPorPublicacion(desde: string, hasta: string) {
    return await this.comentarioModel.aggregate([
      { $match: { createdAt: { $gte: new Date(desde), $lte: this.getFechaHasta(hasta) } } },
      { $group: { _id: '$publicacion', total: { $sum: 1 } } },
      { $lookup: { from: 'publicacions', localField: '_id', foreignField: '_id', as: 'publicacion' } },
      { $unwind: '$publicacion' },
      { $project: { titulo: '$publicacion.titulo', total: 1 } },
    ]);
  }

  async loginsPorUsuario(desde: string, hasta: string) {
    return await this.loginModel.aggregate([
      { $match: { createdAt: { $gte: new Date(desde), $lte: this.getFechaHasta(hasta) } } },
      { $group: { _id: '$usuario', total: { $sum: 1 } } },
      { $lookup: { from: 'usuarios', localField: '_id', foreignField: '_id', as: 'usuario' } },
      { $unwind: '$usuario' },
      { $project: { nombre: '$usuario.nombre', apellido: '$usuario.apellido', total: 1 } },
    ]);
  }

  async visitasPorPerfil(desde: string, hasta: string) {
    return await this.visitaModel.aggregate([
      { $match: { createdAt: { $gte: new Date(desde), $lte: this.getFechaHasta(hasta) } } },
      { $group: { _id: '$perfilVisitado', total: { $sum: 1 } } },
      { $lookup: { from: 'usuarios', localField: '_id', foreignField: '_id', as: 'usuario' } },
      { $unwind: '$usuario' },
      { $project: { nombre: '$usuario.nombre', apellido: '$usuario.apellido', total: 1 } },
    ]);
  }

  async likesPorDia(desde: string, hasta: string) {
    return await this.publicacionModel.aggregate([
      { $unwind: '$likes' },
      { $match: { updatedAt: { $gte: new Date(desde), $lte: this.getFechaHasta(hasta) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  }
}