import { supabase } from "../../../lib/supabaseClient";

import type {
  UserGamification,
  GemTransaction,
} from "../types/gamification";

// =====================================================
// User Gamification
// =====================================================

export async function getUserGamification(
  userId: string
): Promise<UserGamification | null> {
  const { data, error } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getUserGamification:", error.message);
    throw error;
  }

  return data;
}

// =====================================================
// Gem Transactions
// =====================================================

export async function getGemTransactions(
  userId: string,
  limit = 10
): Promise<GemTransaction[]> {
  const { data, error } = await supabase
    .from("gem_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    console.error("getGemTransactions:", error.message);
    throw error;
  }

  return data ?? [];
}