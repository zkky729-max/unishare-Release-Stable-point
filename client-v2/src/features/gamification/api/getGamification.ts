import { supabase } from "../../../lib/supabaseClient";

import type {
  UserGamification,
  GemTransaction,
} from "../types/gamification";

export async function getUserGamification(
  targetUserId?: string
): Promise<{
  gamification: UserGamification | null;
  transactions: GemTransaction[];
}> {
  let userId = targetUserId;

  // =====================================================
  // CURRENT USER
  // =====================================================

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
  // GAMIFICATION
  // =====================================================

  const {
    data: gamification,
    error: gamificationError,
  } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (gamificationError) {
    throw new Error(gamificationError.message);
  }

  // =====================================================
  // TRANSACTIONS
  // =====================================================
  // نحتاج سجل العمليات فقط عند عرض Gamification
  // للمستخدم الحالي.
  //
  // عندما نعرض بروفايل شخص آخر، لن نعرض معاملاته.
  // =====================================================

  let transactions: GemTransaction[] = [];

  if (!targetUserId) {
    const {
      data: transactionData,
      error: transactionsError,
    } = await supabase
      .from("gem_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(20);

    if (transactionsError) {
      throw new Error(transactionsError.message);
    }

    transactions = transactionData ?? [];
  }

  return {
    gamification,
    transactions,
  };
}