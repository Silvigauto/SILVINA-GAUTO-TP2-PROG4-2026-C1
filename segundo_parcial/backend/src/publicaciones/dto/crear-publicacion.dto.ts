import { IsString, IsOptional } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  titulo: string;

  @IsString()
  mensaje: string;

  @IsOptional()
  @IsString()
  imagen?: string;
}