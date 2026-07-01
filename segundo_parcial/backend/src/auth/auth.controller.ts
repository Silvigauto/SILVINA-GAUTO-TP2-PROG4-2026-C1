import { Controller, Post, Body, UseGuards, Req , UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { TokenGuard } from 'src/guards/token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('registro')
@UseInterceptors(FileInterceptor('foto', {}))
registro(
  @Body() datos: any,
  @UploadedFile() foto: Express.Multer.File
) {
  return this.authService.registro(datos, foto);
}

  @Post('login')
  login(@Body() datos: LoginDto) {
    return this.authService.login(datos);
  }

  @Post('autorizar')
  autorizar(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.authService.autorizar(token);
  }

  @Post('refrescar')
  @UseGuards(TokenGuard)
  refrescar(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.authService.refrescar(token);
  }
}