import { IsString, IsEmail, IsDateString, MinLength } from 'class-validator';

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
  contraseña!: string;

  @IsDateString()
  fechaNacimiento!: string;

  @IsString()
  descripcion!: string;
}