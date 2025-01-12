import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { MessageService } from 'src/chat/message.service';
import { RoomService } from 'src/chat/room.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { Server, WebSocket } from 'ws';
import { SendAdminMsgDto } from './dto/send-admin-msg.dto';
import { SendMsgDto } from './dto/send-msg.dto';

type Client = WebSocket & { id?: Uuid };

@WebSocketGateway()
export class ApiWsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private messageService: MessageService,
    private configService: ConfigService,
    private roleService: RoleService,
  ) {}

  @WebSocketServer()
  server: Server<Client>;

  private logger: Logger = new Logger('ApiWsGateway');

  @SubscribeMessage('send-anonymous-msg')
  async handleMessage(client: Client, payload: SendMsgDto): Promise<void> {
    const candidate = await this.userService.findOne(
      payload.senderId || client.id,
    );

    client['id'] = candidate?.id;

    const admins = await this.userService.findManyByRole('admin');
    const adminsId = admins.map((ad) => ad.id);

    if (!candidate) {
      const anonymous = await this.userService.create({ roleKey: 'anonymous' });

      client['id'] = anonymous.id;

      const room = await this.roomService.create({
        userIds: [...adminsId, anonymous.id],
      });

      const msg = await this.messageService.create({
        content: payload.content,
        roomId: room.id,
        userId: anonymous.id,
      });

      this.sendMessageToClients(adminsId, msg);

      return;
    }

    const msg = await this.messageService.create({
      content: payload.content,
      roomId: candidate.rooms[0].id,
      userId: candidate.id,
    });

    this.sendMessageToClients(adminsId, msg);
  }

  @SubscribeMessage('send-admin-msg')
  async handleAdminMsg(client: Client, payload: SendAdminMsgDto) {
    const candidate = await this.userService.findOne(payload.senderId);

    if (!candidate) {
      throw new WsException('Пользователь не найден');
    }

    const adminAccess = this.roleService.checkAccess(candidate.roles, 'admin');
    const roomUsers = await this.userService.findManyByRoomId(payload.roomId);

    if (!adminAccess) {
      throw new WsException('Нет доступа');
    }

    const msg = await this.messageService.create({
      content: payload.content,
      roomId: payload.roomId,
      userId: candidate.id,
    });

    const receiversId = roomUsers.map((r) => r.id);

    this.sendMessageToClients(receiversId, msg);
  }

  afterInit(server: Server) {
    this.logger.log(`WS server started!`);
  }

  handleDisconnect(client: Client) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.server.clients.delete(client);
  }

  handleConnection(client: Client, args: { url: string }) {
    const url = new URL(args.url, this.configService.get('BACKEND_URL'));
    const userId = new URLSearchParams(url.searchParams).get('userId');
    client['id'] = userId ?? undefined;

    this.logger.log(`Client connected: ${userId}`);
  }

  sendMessageToClients(clientsId: Uuid[], msg: Record<string, unknown>) {
    this.server.clients.forEach(
      (c) => clientsId.includes(c.id) && c.send(JSON.stringify(msg)),
    );
  }
}
