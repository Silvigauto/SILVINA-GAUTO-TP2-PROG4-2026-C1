import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { TokenGuard } from 'src/guards/token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  registro(@Body() datos: RegistroDto) {
    return this.authService.registro(datos);
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