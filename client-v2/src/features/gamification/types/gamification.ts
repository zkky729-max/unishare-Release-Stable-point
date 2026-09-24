export interface UserGamification {
  user_id: string;
  gems: number;
  created_at: string;
  updated_at: string;
}

export interface GemTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  reason: string;
  source: string;
  reference_id: string | null;
  created_at: string;
}

export interface GamificationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  requirement_type: "posts_created" | "likes_received";
  requirement_value: number;
  gem_reward: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  badge?: GamificationBadge;
}