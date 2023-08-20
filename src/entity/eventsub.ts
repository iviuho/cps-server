import { Entity, Column, PrimaryColumn } from 'typeorm';

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

  @Column()
  createdAt: Date;

  @Column({ default: EventsubStatus.PENDING })
  status: EventsubStatus;

  @Column()
  type: string;

  @Column()
  version: string;
}
