import { Controller, Post, Body, UseGuards, Req , UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { TokenGuard } from 'src/guards/token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth') // todo empieza con auth: /auth/login /auth/registro
export class AuthController {
    constructor(private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('registro') // auth/registro
  @UseInterceptors(FileInterceptor('foto', {}))
  registro(
  @Body() datos: any,
  @UploadedFile() foto: Express.Multer.File
  ) {
    return this.authService.registro(datos, foto);
  }

  @Post('login') // auth/login
  login(@Body() datos: LoginDto) {
    return this.authService.login(datos);
  }

  @Post('autorizar') // auth/autorizar
  autorizar(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.authService.autorizar(token);
  }

  @Post('refrescar') // auth/refrescar
  @UseGuards(TokenGuard)
  refrescar(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.authService.refrescar(token);
  }
}