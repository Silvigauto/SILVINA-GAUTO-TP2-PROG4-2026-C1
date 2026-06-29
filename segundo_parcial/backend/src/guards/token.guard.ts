import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '') || '';

    try {
      const verificado = verify(token, process.env.CLAVE_SUPERSECRETA!);
      const { email, _id, rol } = verificado as { email: string; _id: string; rol: string };

      if (!req.body) {
        req.body = { emailDelToken: email, idDelToken: _id, rolDelToken: rol };
      } else {
        req.body.emailDelToken = email;
        req.body.idDelToken = _id;
        req.body.idDelToken = _id;
        console.log('guard - idDelToken:', _id);
        console.log('guard - body:', req.body);
        req.body.rolDelToken = rol;
      }

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}