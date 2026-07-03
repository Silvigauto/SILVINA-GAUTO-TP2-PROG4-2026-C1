import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Login {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  usuario!: mongoose.Types.ObjectId;
}

export const LoginSchema = SchemaFactory.createForClass(Login);