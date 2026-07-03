import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Visita {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  visitante!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  perfilVisitado!: mongoose.Types.ObjectId;
}

export const VisitaSchema = SchemaFactory.createForClass(Visita);