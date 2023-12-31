export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface UserAccessTokenResponse extends TokenResponse {
  refresh_token: string;
  scope: string[];
  token_type: 'bearer';
}

export type ValidateTokenResponse = {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
};

export enum GetUserType {
  ID,
  LOGIN,
}

export interface GetSubscriptionListResponse {
  data: Subscription[];
  total: number;
  total_cost: number;
  max_total_cost: number;
  pagination: {
    cursor?: string;
  };
}

export type GetUserRequest = { id: string } | { login: string };
export type GetUserResponse = {
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

export type SubscribeRequest = {
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

export type SubscribeResponse = {
  data: Subscription[];
  total: number;
  total_cost: number;
  max_total_cost: number;
};

export interface WebhookDto {
  challenge?: string;
  subscription: Subscription;
  event: any;
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

export interface ExtensionSecret {
  content: string;
  active_at: string;
  expires_at: string;
}

export enum ExtensionState {
  APPROVED = 'Approved',
  ASSET_UPLOADED = 'AssetsUploaded',
  DELETED = 'Deleted',
  DEPRECATED = 'Deprecated',
  IN_REVIEW = 'InReview',
  IN_TEST = 'InTest',
  PENDING_ACTION = 'PendingAction',
  REJECTED = 'Rejected',
  RELEASED = 'Released',
}

export interface Extension {
  author_name: string;
  bits_enabled: boolean;
  can_install: boolean;
  configuration_location: 'hosted' | 'custom' | 'none';
  description: string;
  eula_tos_url: string;
  has_chat_support: boolean;
  icon_url: string;
  icon_urls: Map<string, string>;
  id: string;
  name: string;
  privacy_policy_url: string;
  request_identity_link: boolean;
  screenshot_urls: string[];
  state: ExtensionState;
  subscriptions_support_level: 'none' | 'optional';
  summary: string;
  support_email: string;
  version: string;
  viewer_summary: string;
  views: {
    mobile: {
      viewer_url: string;
    };
    panel: {
      viewer_url: string;
      height: number;
      can_link_external_content: boolean;
    };
    video_overlay: {
      viewer_url: string;
      can_link_external_content: boolean;
    };
    component: {
      viewer_url: string;
      aspect_ratio_x: number;
      aspect_ratio_y: number;
      autoscale: boolean;
      scale_pixels: number;
      target_height: number;
      can_link_external_content: boolean;
    };
    config: {
      viewer_url: string;
      can_link_external_content: boolean;
    };
  };
  allowlisted_config_urls: string[];
  allowlisted_panel_urls: string[];
}

export interface GetExtensionResponse {
  data: Extension[];
}

export interface GetExtensionSecretResponse {
  data: {
    format_version: string;
    secrets: ExtensionSecret[];
  }[];
}

export interface JwtPayload {
  channel_id: string;
  exp: number;
  is_unlinked: boolean;
  opaque_user_id: string;
  pubsub_perms: {
    listen: string[];
    send: string[];
  };
  role: 'broadcaster' | 'moderator' | 'viewer' | 'external';
  user_id?: string;
}
