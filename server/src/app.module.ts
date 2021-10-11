import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Event } from './event.entity';
import { EventsController } from './events.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'example',
      database: 'nest-events',
      entities: [Event],
      // For local dev only
      synchronize: true,
    }),
  ],
  controllers: [AppController, EventsController],
  providers: [AppService],
})
export class AppModule {}
