import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

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
