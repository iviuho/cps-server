import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn } from 'typeorm';

import { User } from './user';

export enum ConfigType {
  Comment = 'comment',
}

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ enum: ConfigType, type: 'enum' })
  type: ConfigType;

  @ManyToOne(() => User)
  user: User;

  @Column()
  data: string;
}
