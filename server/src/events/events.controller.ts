import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { CreateEventDto } from './inputs/create-event.dto';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { UpdateEventDto } from './inputs/update-event.dto';
import { ListEvents } from './list.events';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  private events: Event[] = [];

  @Get()
  // Needed to set the default values for the query params
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    const events =
      await this.eventsService.getEventsWithAtttendeeCountFilteredPagniated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2,
        },
      );
    return events;
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'when'],
      // Pass clauses or conditions as an array to make it an OR condition
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      // limiting results to 2
      take: 2,
      // skip: 1,
      order: {
        id: 'DESC',
      },
    });
  }

  @Get('/practice2')
  async practice2() {
    // Manually fetch relations
    // return await this.repository.findOne(1, { relations: ['attendees'] });
    // Dont load the eager relations
    // return await this.repository.findOne(1, { loadEagerRelations: false });

    const event = await this.repository.findOne(1);
    // If we know the id of the event we dont need to fetch it
    // const event = new Event();
    // event.id = 1;
    const attendee = new Attendee();
    attendee.name = 'Cascading';
    // attendee.event = event;
    event.attendees.push(attendee);
    // await this.attendeeRepository.save(attendee);
    await this.repository.save(event);
    return event;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  // UpdateEventDto inherits from CreateEventDto so the same validations apply
  async update(@Param('id', ParseIntPipe) id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id) {
    const { affected } = await this.eventsService.deleteEvent(id);

    if (affected === 0) {
      throw new NotFoundException();
    }
  }
}
