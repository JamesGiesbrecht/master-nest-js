import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee-answer.enum';
import { Event } from './event.entity';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Event, (event) => event.attendees)
  // reference a different column in the one table
  // @JoinColumn({ name: 'event_id', referencedColumnName: 'secondary' })
  event: Event;
  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  answer: AttendeeAnswerEnum;
}
