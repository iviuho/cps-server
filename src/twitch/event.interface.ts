export interface UserAuthorizationGrant {
  client_id: string;
  user_id: string;
  user_login: string;
  user_name: string;
}

export interface UserAuthorizationRevoke {
  client_id: string;
  user_id: string;
  user_login: string | null;
  user_name: string | null;
}

export interface ChannelPointReward {
  id: string;
  title: string;
  cost: number;
  prompt: string;
}

export interface ChannelPointCustomRewardRedemptionAdd {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  user_id: string;
  user_login: string;
  user_name: string;
  user_input: string;
  status: 'unfulfilled' | 'unknown' | 'fulfilled' | 'canceled';
  reward: ChannelPointReward;
  redeemed_at: string;
}
