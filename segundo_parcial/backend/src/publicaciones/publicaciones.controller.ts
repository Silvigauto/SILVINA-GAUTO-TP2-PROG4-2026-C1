import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { TokenGuard } from '../guards/token.guard';
import { CrearComentarioDto } from './dto/crear-comentario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { verify } from 'jsonwebtoken';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

@Post()
@UseInterceptors(FileInterceptor('imagen', {}))
crear(
  @Body() datos: any,
  @Req() req: any,
  @UploadedFile() imagen: Express.Multer.File
) {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  const verificado = verify(token, process.env.CLAVE_SUPERSECRETA!) as any;
  const idDelToken = verificado._id;
  return this.publicacionesService.crear(datos, idDelToken, imagen);
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
    const idDelToken = req.body.idDelToken;
    return this.publicacionesService.darLike(id, idDelToken);
  }

  @Delete(':id/like')
  @UseGuards(TokenGuard)
  quitarLike(@Param('id') id: string, @Req() req: any) {
    const idDelToken = req.body.idDelToken;
    return this.publicacionesService.quitarLike(id, idDelToken);
  }

  @Post(':id/comentarios')
  @UseGuards(TokenGuard)
  agregarComentario(
    @Param('id') id: string,
    @Req() req: any,
    @Body() datos: CrearComentarioDto
  ) {
    const idDelToken = req.body.idDelToken;
    return this.publicacionesService.agregarComentario(id, idDelToken, datos);
  }

  @Put(':id/comentarios/:comentarioId')
  @UseGuards(TokenGuard)
  editarComentario(
    @Param('id') id: string,
    @Param('comentarioId') comentarioId: string,
    @Req() req: any,
    @Body('mensaje') mensaje: string
  ) {
    const idDelToken = req.body.idDelToken;
    return this.publicacionesService.editarComentario(comentarioId, idDelToken, mensaje);
  }

  @Get(':id/comentarios')
  listarComentarios(
    @Param('id') id: string,
    @Query('limite') limite: number,
    @Query('offset') offset: number,
  ) {
    return this.publicacionesService.listarComentarios(id, limite, offset);
  }

  @Get(':id')
  obtenerUna(@Param('id') id: string) {
    return this.publicacionesService.obtenerUna(id);
  }
}