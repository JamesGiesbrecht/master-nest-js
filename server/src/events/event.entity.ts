import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';

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
  // Use eager with caution
  @OneToMany(() => Attendee, (attendee) => attendee.event, { eager: true })
  attendees: Attendee[];
}
