import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './entities/publicacion.schema';
import { Comentario, ComentarioSchema } from './entities/comentario.schema';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Login, LoginSchema } from '../auth/entities/login.schema';
import { Visita, VisitaSchema } from '../auth/entities/visita.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
      { name: Comentario.name, schema: ComentarioSchema },
      { name: Login.name, schema: LoginSchema },
      { name: Visita.name, schema: VisitaSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [PublicacionesController, EstadisticasController],
  providers: [PublicacionesService, EstadisticasService],
})
export class PublicacionesModule {}