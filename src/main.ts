import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(PORT);
  console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
