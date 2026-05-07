import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // LAB NOTE: Keep 3000 as default, but allow another port when 3000 is already busy.
  const port = Number(process.env.PORT) || 3000;
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
