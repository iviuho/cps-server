import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  uid: string;

  @Column()
  login: string;

  @Column()
  nickname: string;
}
