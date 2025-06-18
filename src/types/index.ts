/* eslint-disable @typescript-eslint/no-explicit-any */
// Common types shared across components

export interface InfluencerProfile {
  user_id: string;
  full_name: string;
  country: string;
  birthdate: string;
  avatar_url: string | null;
  terms_accepted: boolean;
  accepted_at: string;
  has_onboarded: boolean;
}

export interface AnimationVariants {
  hidden: any;
  visible: any;
  exit: any;
}