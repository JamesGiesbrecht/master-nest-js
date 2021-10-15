import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee-answer.enum';
import { Event } from './event.entity';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Column()
  @Expose()
  name: string;
  @ManyToOne(() => Event, (event) => event.attendees)
  // reference a different column in the one table
  // @JoinColumn({ name: 'event_id', referencedColumnName: 'secondary' })
  event: Event;
  @Column()
  eventId: number;
  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  @Expose()
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended)
  user: User;

  @Column()
  userId: number;
}
