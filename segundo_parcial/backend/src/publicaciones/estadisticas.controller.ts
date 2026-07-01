import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { TokenGuard } from '../guards/token.guard';
import { UnauthorizedException } from '@nestjs/common';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  @UseGuards(TokenGuard)
  publicacionesPorUsuario(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Req() req: any
  ) {
    if (req.body.rolDelToken !== 'administrador') {
      throw new UnauthorizedException('No tenés permiso');
    }
    return this.estadisticasService.publicacionesPorUsuario(desde, hasta);
  }

  @Get('comentarios-por-tiempo')
  @UseGuards(TokenGuard)
  comentariosPorTiempo(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Req() req: any
  ) {
    if (req.body.rolDelToken !== 'administrador') {
      throw new UnauthorizedException('No tenés permiso');
    }
    return this.estadisticasService.comentariosPorTiempo(desde, hasta);
  }

  @Get('comentarios-por-publicacion')
  @UseGuards(TokenGuard)
  comentariosPorPublicacion(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Req() req: any
  ) {
    if (req.body.rolDelToken !== 'administrador') {
      throw new UnauthorizedException('No tenés permiso');
    }
    return this.estadisticasService.comentariosPorPublicacion(desde, hasta);
  }
}