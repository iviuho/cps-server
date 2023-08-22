import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './user';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { cascade: true })
  from: User;

  @ManyToOne(() => User, user => user.comments, { cascade: true })
  to: User;

  @Column()
  content: string;
}
