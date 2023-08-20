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

export type SubscribeApiResponse = {
  data: {
    id: string;
    status: string;
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
  }[];
  total: number;
  total_cost: number;
  max_total_cost: number;
};
