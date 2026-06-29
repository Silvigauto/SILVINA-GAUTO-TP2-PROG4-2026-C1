import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Publicacion {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop()
  imagen: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  usuario: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }], default: [] })
  likes: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: true })
  activo: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);