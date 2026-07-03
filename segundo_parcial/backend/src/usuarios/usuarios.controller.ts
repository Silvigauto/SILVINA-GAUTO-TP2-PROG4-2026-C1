import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { TokenGuard } from '../guards/token.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @UseGuards(TokenGuard)
  listar(@Req() req: any) {
    if (req.body.rolDelToken !== 'administrador') {
      throw new Error('No tenés permiso');
    }
    return this.usuariosService.listar();
  }

  @Post()
  @UseGuards(TokenGuard)
  crear(@Req() req: any, @Body() datos: any) {
    if (req.body.rolDelToken !== 'administrador') {
      throw new Error('No tenés permiso');
    }
    return this.usuariosService.crear(datos);
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  deshabilitar(@Param('id') id: string, @Req() req: any) {
    if (req.body.rolDelToken !== 'administrador') {
      throw new Error('No tenés permiso');
    }
    return this.usuariosService.deshabilitar(id);
  }

  @Post(':id/habilitar')
  @UseGuards(TokenGuard)
  habilitar(@Param('id') id: string, @Req() req: any) {
    if (req.body.rolDelToken !== 'administrador') {
      throw new Error('No tenés permiso');
    }
    return this.usuariosService.habilitar(id);
  }

  @Get(':id')
@UseGuards(TokenGuard)
obtenerUno(@Param('id') id: string, @Req() req: any) {
  const visitanteId = req.body.idDelToken;
  return this.usuariosService.obtenerUno(id, visitanteId);
}
}