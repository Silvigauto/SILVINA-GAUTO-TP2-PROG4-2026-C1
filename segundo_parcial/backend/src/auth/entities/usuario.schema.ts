import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Usuario {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  contraseña: string;

  @Prop()
  nombre: string;

  @Prop()
  apellido: string;

  @Prop()
  fechaNacimiento: Date;

  @Prop()
  descripcion: string;

  @Prop()
  fotoPerfil: string;

  @Prop({ default: 'usuario' })
  rol: string;

  @Prop({ default: true })
  activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);