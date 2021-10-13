import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  // Column types are inferred
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  when: Date;
  @Column()
  address: string;
  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    // Use eager with caution
    eager: true,
    // TypeORM will perform the necessary updates on all related entities
    cascade: true,
  })
  attendees: Attendee[];
  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;
}
