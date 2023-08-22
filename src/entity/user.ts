import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { Comment } from './comment';
import { Eventsub } from './eventsub';

@Entity()
export class User {
  @PrimaryColumn()
  uid: string;

  @Column()
  login: string;

  @Column()
  nickname: string;

  @OneToMany(() => Comment, comment => comment.to)
  comments?: Comment[];

  @OneToMany(() => Eventsub, eventsub => eventsub.target)
  eventsubs?: Eventsub[];
}
