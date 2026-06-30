import { IsString } from 'class-validator';

export class CrearComentarioDto {
  @IsString()
  mensaje!: string;
}