import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';
import { EventsController } from './events.controller';

@Module({
  imports: [
    // Injecting a repository for the Event class
    TypeOrmModule.forFeature([Event, Attendee]),
  ],
  controllers: [EventsController],
})
export class EventsModule {}
