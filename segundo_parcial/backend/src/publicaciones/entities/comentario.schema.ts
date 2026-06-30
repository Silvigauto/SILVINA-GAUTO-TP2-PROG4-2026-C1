import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Comentario {
  @Prop({ required: true })
  mensaje!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  usuario!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' })
  publicacion!: mongoose.Types.ObjectId;

  @Prop({ default: false })
  modificado!: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);