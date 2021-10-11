import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  private events: Event[] = [];

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.events.find((event) => event.id === parseInt(id));
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    const newEvent = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    };
    this.events.push(newEvent);
    // return created resource
    return newEvent;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    const index = this.events.findIndex((event) => event.id === parseInt(id));
    this.events[index] = {
      ...this.events[index],
      ...input,
      when: input.when ? new Date(input.when) : this.events[index].when,
    };
    // Return updated resource
    return this.events[index];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    this.events = this.events.filter((event) => event.id !== id);
  }
}
