import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from 'src/@common/decorators/current-user.decorator';
import { AuthGuard } from 'src/@common/guards/auth.guard';
import { AppRequest, CurrentUser as CurrentUserData } from 'src/@types/auth';
import { MessageService } from 'src/chat/message.service';
import { RoomService } from 'src/chat/room.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('api')
export class ApiController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private roomService: RoomService,
  ) {}

  @Get('auth/current-user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async currentUser(@CurrentUser('userId') id: Uuid) {
    return this.userService.findOne(id);
  }

  @Post('auth/signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() dto: SignInDto,
    @Res() res: Response,
    @Req() req: AppRequest,
  ) {
    const data = await this.authService.signin(dto);

    res.cookie('accessToken', data.accessToken, { httpOnly: true });
    res.cookie('refreshToken', data.refreshToken, { httpOnly: true });

    req.user = { userId: data.candidate.id };

    return res.json({ accessToken: data.accessToken });
  }

  @Post('auth/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: AppRequest,
    @Res() res: Response,
    @CurrentUser() user: CurrentUserData,
  ) {
    const tokens = this.authService.refresh(
      req.cookies['refreshToken'],
      user.userId,
    );

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });

    return tokens;
  }

  @Post('auth/signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Res() res: Response) {
    res.clearCookie('accessToken', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });

    return res.json({ message: 'Пуки подчищены!) ' });
  }

  @Get('chat/message')
  @HttpCode(HttpStatus.OK)
  async getMessages(@Query() { roomId }: { roomId: Uuid }) {
    return this.messageService.findManyByRoomId(roomId);
  }
}
