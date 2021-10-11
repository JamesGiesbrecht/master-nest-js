import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // This override local validation settings, disable to use groups
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
