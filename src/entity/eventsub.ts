import { Entity, Column, PrimaryColumn, ManyToOne, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { User } from './user';

export enum EventsubStatus {
  ENABLED = 'enabled',
  PENDING = 'webhook_callback_verification_pending',
  FAILED = 'webhook_callback_verification_failed',
  FAILURES_EXCEEDED = 'notification_failures_exceeded',
  AUTHORIZATION_REVOKED = 'authorization_revoked',
  MODERATOR_REMOVED = 'moderator_removed',
  USER_REMOVED = 'user_removed',
  VERSION_REMOVED = 'version_removed',
}

@Entity()
export class Eventsub {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, user => user.uid)
  target: User;

  @Column()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: EventsubStatus.PENDING, enum: EventsubStatus })
  status: EventsubStatus;

  @Column()
  type: string;

  @Column()
  version: string;
}
