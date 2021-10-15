import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { PaginationResult } from 'src/pagination/paginator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  // Column types are inferred
  @Column()
  @Expose()
  name: string;
  @Column()
  @Expose()
  description: string;
  @Column()
  @Expose()
  when: Date;
  @Column()
  @Expose()
  address: string;
  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    // Use eager with caution
    eager: true,
    // TypeORM will perform the necessary updates on all related entities
    cascade: true,
  })
  @Expose()
  attendees: Attendee[];

  @JoinColumn({ name: 'organizerId' })
  @ManyToOne(() => User, (user) => user.organized)
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  @Expose()
  attendeeCount?: number;
  @Expose()
  attendeeRejected?: number;
  @Expose()
  attendeeMaybe?: number;
  @Expose()
  attendeeAccepted?: number;
}

export type PaginatedEvents = PaginationResult<Event>;
