import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cryptoService } from 'src/@common/services/crypto.service';
import { jwtService } from 'src/@common/services/jwt.service';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignUpDto) {
    const candidate = await this.userService.findOneByEmail(dto.email);

    if (candidate) {
      throw new BadRequestException('Пользователь уже существует');
    }

    const password = await cryptoService.hashPassword(dto.password);

    return this.userService.create({ ...dto, password, roleKey: 'admin' });
  }

  async signin(dto: SignInDto) {
    const candidate = await this.userService.findOneByEmail(dto.email);

    const validPassword = await cryptoService.validatePassword(
      dto.password,
      candidate?.password,
    );

    if (!candidate || !validPassword) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return { ...this.generateTokens({ userId: candidate.id }), candidate };
  }

  refresh(token: Token, userId: Uuid) {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    const valid = jwtService.validateToken(token, secret);

    if (!valid) {
      throw new ForbiddenException('Токен не валиден');
    }

    return this.generateTokens({ userId });
  }

  generateTokens(payload: Record<string, unknown>) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: Record<string, unknown>) {
    const secret = this.configService.get('ACCESS_TOKEN_SECRET');
    return jwtService.encodeToken(payload, secret, '15m');
  }

  private generateRefreshToken(payload: Record<string, unknown>) {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    return jwtService.encodeToken(payload, secret, '30d');
  }
}
