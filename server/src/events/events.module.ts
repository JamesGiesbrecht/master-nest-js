import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeesService } from './attendee.service';
import { EventAttendeesController } from './event-attendees.controller';
import { Event } from './event.entity';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    // Injecting a repository for the Event class
    TypeOrmModule.forFeature([Event, Attendee]),
  ],
  controllers: [
    EventsController,
    EventsOrganizedByUserController,
    EventAttendeesController,
  ],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}
