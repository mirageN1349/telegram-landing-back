import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppRequest, CurrentUser } from 'src/@types/auth';
import { jwtService } from '../services/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: AppRequest = ctx.switchToHttp().getRequest();

    const token = jwtService.getTokenFromRequest(request);

    const valid = jwtService.validateToken(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const user = jwtService.decodeToken(token);

    if (!valid) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    request.user = user as CurrentUser;

    return true;
  }
}
