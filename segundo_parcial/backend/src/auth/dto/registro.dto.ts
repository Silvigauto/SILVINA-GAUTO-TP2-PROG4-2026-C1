import { IsString, IsEmail, IsDateString, MinLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegistroDto {
  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  @MinLength(8)
  contrasena!: string;

  @IsDateString()
  fechaNacimiento!: string;

  @IsString()
  descripcion!: string;
}