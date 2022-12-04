import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { ApiWsGateway } from './api-ws.gateway';
import { ApiController } from './api.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, ChatModule, RoleModule],
  controllers: [ApiController],
  providers: [ApiWsGateway, AuthService],
})
export class ApiModule {}
