import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class AppAccessToken {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @Column()
  token: string;

  @Column()
  expiresIn: number;
}
