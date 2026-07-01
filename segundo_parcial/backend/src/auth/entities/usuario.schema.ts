import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Usuario {
  @Prop({ unique: true })//no puede haber dos con el mismo valor
  email!: string;

  @Prop({ unique: true })//no puede haber dos con el mismo valor
  username!: string;

  @Prop()
  contrasena!: string;

  @Prop()
  nombre!: string;

  @Prop()
  apellido!: string;

  @Prop()
  fechaNacimiento!: Date;

  @Prop()
  descripcion!: string;

  @Prop()
  fotoPerfil!: string;

  @Prop({ default: 'usuario' })
  rol!: string;

  @Prop({ default: true })
  activo!: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);