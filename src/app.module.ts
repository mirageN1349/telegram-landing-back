import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { ChatModule } from './chat/chat.module';
import { IntegrationModule } from './integration/integration.module';
import { RoleModule } from './role/role.module';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(5100),
        DATABASE_URL: Joi.string().required(),
        BACKEND_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('dev', 'prod', 'local').default('local'),
        ACCESS_TOKEN_SECRET: Joi.required(),
        REFRESH_TOKEN_SECRET: Joi.required(),
      }),
    }),
    ApiModule,
    FileModule,
    IntegrationModule,
    ChatModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
