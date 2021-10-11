import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  private events: Event[] = [];

  @Get()
  async findAll() {
    return await this.repository.find();
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    return await this.repository.findOne(id);
  }

  @Post()
  // The validation pipe was added globally in main.ts so we dont need to add it here
  // async create(@Body(ValidationPipe) input: CreateEventDto) {
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
    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id) {
    const event = await this.repository.findOne(id);
    await this.repository.remove(event);
  }
}
