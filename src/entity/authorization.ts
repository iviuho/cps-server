import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

import { User } from './user';

@Entity()
export class Authorization {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  clientId: string;

  @OneToOne(() => User, user => user.uid)
  @JoinColumn()
  user: User;
}
