import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Request } from 'express';

type DecodeResult =
  | null
  | {
      [key: string]: unknown;
    }
  | string;

export class JwtService {
  constructor(private jwtService: NestJwtService) {}

  validateToken(token: Token, secret: SomeString): Valid {
    try {
      this.jwtService.verify(token, { secret });
      return true;
    } catch (error) {
      return false;
    }
  }

  decodeToken(token: Token): DecodeResult {
    return this.jwtService.decode(token);
  }

  encodeToken<T extends string | object | Buffer>(
    payload: T,
    secret: SomeString,
    expiresIn: DateString,
  ): Token {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  getTokenFromRequest(req: Request): string | null {
    const header = req.header('Authorization');
    if (header) {
      return header.replace('Bearer ', '');
    }

    return req.cookies?.['accessToken'] || null;
  }
}

export const jwtService = new JwtService(new NestJwtService());
