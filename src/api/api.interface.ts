import { EventsubStatus } from '@src/entity/eventsub';

import * as WebhookEvent from './event.interface';

export type ValidateTokenApiResponse = {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
};

export type GetUserApiRequest = { id: string } | { login: string };
export type GetUserApiResponse = {
  data: {
    id: string;
    login: string;
    display_name: string;
    type: 'admin' | 'global_mod' | 'staff' | '';
    broadcaster_type: 'affiliate' | 'partner' | '';
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string;
    created_at: string;
  }[];
};

export type SubscribeApiRequest = {
  type: string;
  version: string;
  condition: any;
  transport: {
    method: 'webhook' | 'websocket';
    callback?: string;
    secret?: string;
    session_id?: string;
  };
};

export interface Subscription {
  id: string;
  status: EventsubStatus;
  type: string;
  version: string;
  condition: object;
  created_at: string;
  transport: {
    method: 'webhook' | 'websocket';
    callback: string;
    session_id: string;
    connected_at: string;
  };
  cost: number;
}

export type SubscribeApiResponse = {
  data: Subscription[];
  total: number;
  total_cost: number;
  max_total_cost: number;
};

export interface WebhookDto<EventResponse = any> {
  challenge?: string;
  subscription: Subscription;
  event: EventResponse;
}

export const enum EventsubHeader {
  MESSAGE_ID = 'Twitch-Eventsub-Message-Id',
  MESSAGE_RETRY = 'Twitch-Eventsub-Message-Retry',
  MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type',
  MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature',
  MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp',
  SUBSCRIPTION_TYPE = 'Twitch-Eventsub-Subscription-Type',
  SUBSCRIPTION_VERSION = 'Twitch-Eventsub-Subscription-Version',
}

export const enum EventsubMessageType {
  NOTIFICATION = 'notification',
  VERIFICATION = 'webhook_callback_verification',
  REVOCATION = 'revocation',
}

export interface AuthPayload {
  code?: string;
  scope?: string;
  error?: string;
  error_description?: string;
  state?: string;
}

export interface AuthSuccess extends AuthPayload {
  code: string;
  scope: string;
}

export interface AuthFailed extends AuthPayload {
  error: string;
  error_description: string;
}
