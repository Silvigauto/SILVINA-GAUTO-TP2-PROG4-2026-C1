import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { TokenGuard } from '../guards/token.guard';


@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseGuards(TokenGuard)
  crear(@Body() datos: CrearPublicacionDto, @Body('idDelToken') idDelToken: string) {
    return this.publicacionesService.crear(datos, idDelToken);
  }

  @Get()
  listar(
    @Query('orden') orden: string,
    @Query('limite') limite: number,
    @Query('offset') offset: number,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.publicacionesService.listar(orden, limite, offset, usuarioId);
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  eliminar(
    @Param('id') id: string,
    @Body('idDelToken') idDelToken: string,
    @Body('rolDelToken') rolDelToken: string,
  ) {
    return this.publicacionesService.eliminar(id, idDelToken, rolDelToken);
  }

  @Post(':id/like')
@UseGuards(TokenGuard)
darLike(@Param('id') id: string, @Req() req: any) {
  console.log('body completo:', JSON.stringify(req.body));
  const idDelToken = req.body.idDelToken;
  return this.publicacionesService.darLike(id, idDelToken);
}

@Delete(':id/like')
@UseGuards(TokenGuard)
quitarLike(@Param('id') id: string, @Req() req: any) {
  const idDelToken = (req as any).body.idDelToken;
  return this.publicacionesService.quitarLike(id, idDelToken);
}
}