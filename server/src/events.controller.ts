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
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {
    return [
      { id: 1, name: 'My Birthday' },
      { id: 2, name: 'Christmas' },
    ];
  }
  @Get(':id')
  findOne(@Param('id') id) {
    return { id: 1, name: 'My Birthday' };
  }
  @Post()
  create(@Body() input: CreateEventDto) {
    // return created resource
    return input;
  }
  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    // Return updated resource
    return input;
  }
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    return;
  }
}
