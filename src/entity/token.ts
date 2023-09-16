import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne } from 'typeorm';

import { User } from './user';

export enum TokenType {
  App = 'app',
  User = 'user',
}

@Entity()
export class Token {
  @PrimaryColumn()
  token: string;

  @Column({ enum: TokenType, type: 'enum' })
  type: TokenType;

  @ManyToOne(() => User, user => user.uid)
  owner?: User;

  @Column()
  refreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  expiresIn: number;

  @Column('simple-array')
  scopes?: string[];
}
