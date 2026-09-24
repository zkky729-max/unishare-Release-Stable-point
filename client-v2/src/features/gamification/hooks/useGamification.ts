import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "../../../lib/supabaseClient";

import {
  getUserGamification,
  getGemTransactions,
} from "../api/gamification";

import { getGamificationBadges } from "../api/getBadges";

import type {
  UserGamification,
  GemTransaction,
  UserBadge,
  GamificationBadge,
} from "../types/gamification";

interface UseGamificationResult {
  gamification: UserGamification | null;
  transactions: GemTransaction[];
  badges: GamificationBadge[];
  userBadges: UserBadge[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useGamification(): UseGamificationResult {
  const [gamification, setGamification] =
    useState<UserGamification | null>(null);

  const [transactions, setTransactions] =
    useState<GemTransaction[]>([]);

  const [badges, setBadges] =
    useState<GamificationBadge[]>([]);

  const [userBadges, setUserBadges] =
    useState<UserBadge[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // تحميل بيانات Gamification
  // =====================================================

  const loadGamification = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // -------------------------------------------------
      // المستخدم الحالي
      // -------------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      // -------------------------------------------------
      // لا يوجد مستخدم
      // -------------------------------------------------

      if (!user) {
        setGamification(null);
        setTransactions([]);
        setBadges([]);
        setUserBadges([]);
        return;
      }

      // -------------------------------------------------
      // تحميل البيانات
      // -------------------------------------------------

      const [
        gamificationData,
        transactionsData,
        badgesData,
      ] = await Promise.all([
        getUserGamification(user.id),
        getGemTransactions(user.id, 10),
        getGamificationBadges(),
      ]);

      // -------------------------------------------------
      // Gems
      // -------------------------------------------------

      setGamification(
        gamificationData ?? null
      );

      // -------------------------------------------------
      // Transactions
      // -------------------------------------------------

      setTransactions(
        transactionsData ?? []
      );

      // -------------------------------------------------
      // جميع الـ Badges
      // -------------------------------------------------

      setBadges(
        badgesData.badges ?? []
      );

      // -------------------------------------------------
      // Badges الخاصة بالمستخدم
      // -------------------------------------------------

      setUserBadges(
        badgesData.userBadges ?? []
      );
    } catch (err) {
      console.error(
        "useGamification:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "تعذر تحميل بيانات نظام الجوائز."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // التحميل الأول
  // =====================================================

  useEffect(() => {
    void loadGamification();
  }, [loadGamification]);

  // =====================================================
  // النتيجة
  // =====================================================

  return {
    gamification,
    transactions,
    badges,
    userBadges,
    loading,
    error,
    refresh: loadGamification,
  };
}