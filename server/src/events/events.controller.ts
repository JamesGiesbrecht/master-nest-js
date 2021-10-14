import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './inputs/create-event.dto';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { UpdateEventDto } from './inputs/update-event.dto';
import { ListEvents } from './list.events';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  private events: Event[] = [];

  @Get()
  // Needed to set the default values for the query params
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
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

  // @Get('/practice')
  // async practice() {
  //   return await this.repository.find({
  //     select: ['id', 'when'],
  //     // Pass clauses or conditions as an array to make it an OR condition
  //     where: [
  //       {
  //         id: MoreThan(3),
  //         when: MoreThan(new Date('2021-02-12T13:00:00')),
  //       },
  //       {
  //         description: Like('%meet%'),
  //       },
  //     ],
  //     // limiting results to 2
  //     take: 2,
  //     // skip: 1,
  //     order: {
  //       id: 'DESC',
  //     },
  //   });
  // }

  // @Get('/practice2')
  // async practice2() {
  //   // Manually fetch relations
  //   // return await this.repository.findOne(1, { relations: ['attendees'] });
  //   // Dont load the eager relations
  //   // return await this.repository.findOne(1, { loadEagerRelations: false });

  //   const event = await this.repository.findOne(1);
  //   // If we know the id of the event we dont need to fetch it
  //   // const event = new Event();
  //   // event.id = 1;
  //   const attendee = new Attendee();
  //   attendee.name = 'Cascading';
  //   // attendee.event = event;
  //   event.attendees.push(attendee);
  //   // await this.attendeeRepository.save(attendee);
  //   await this.repository.save(event);
  //   return event;
  // }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  // UpdateEventDto inherits from CreateEventDto so the same validations apply
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException([
        null,
        'You are not authorized to update this event',
      ]);
    }

    return await this.eventsService.updateEvent(event, input);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException([
        null,
        'You are not authorized to delete this event',
      ]);
    }
    await this.eventsService.deleteEvent(id);
  }
}
