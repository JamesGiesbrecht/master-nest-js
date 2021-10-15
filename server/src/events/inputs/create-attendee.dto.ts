import { IsEmail, IsEnum, Length } from 'class-validator';
import { AttendeeAnswerEnum } from 'src/events/attendee-answer.enum';

export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
