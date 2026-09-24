import { supabase } from "../../../lib/supabaseClient";

import type {
  GamificationBadge,
  UserBadge,
} from "../types/gamification";

export async function getGamificationBadges(
  targetUserId?: string
): Promise<{
  badges: GamificationBadge[];
  userBadges: UserBadge[];
}> {
  // =====================================================
  // Target User
  // =====================================================

  let userId = targetUserId;

  if (!userId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error("المستخدم غير مسجل الدخول");
    }

    userId = user.id;
  }

  // =====================================================
  // All Badges
  // =====================================================

  const {
    data: badges,
    error: badgesError,
  } = await supabase
    .from("gamification_badges")
    .select(`
      id,
      name,
      description,
      icon,
      rarity,
      requirement_type,
      requirement_value,
      gem_reward,
      created_at
    `)
    .order("requirement_type", {
      ascending: true,
    })
    .order("requirement_value", {
      ascending: true,
    });

  if (badgesError) {
    throw new Error(badgesError.message);
  }

  // =====================================================
  // Target User Badges
  // =====================================================

  const {
    data: userBadges,
    error: userBadgesError,
  } = await supabase
    .from("user_badges")
    .select(`
      id,
      user_id,
      badge_id,
      unlocked_at,
      badge:gamification_badges (
        id,
        name,
        description,
        icon,
        rarity,
        requirement_type,
        requirement_value,
        gem_reward,
        created_at
      )
    `)
    .eq("user_id", userId)
    .order("unlocked_at", {
      ascending: false,
    });

  if (userBadgesError) {
    throw new Error(userBadgesError.message);
  }

  return {
    badges: (badges ?? []) as GamificationBadge[],
    userBadges: (userBadges ?? []) as unknown as UserBadge[],
  };
}