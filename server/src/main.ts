import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Set the level of logs we want to have output
    // logger: ['error', 'warn', 'debug'],
  });
  // This override local validation settings, disable to use groups
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
