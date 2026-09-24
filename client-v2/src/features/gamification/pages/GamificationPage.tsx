import { useEffect, useState } from "react";

import GemsCard from "../components/GemsCard";
import BadgeCard from "../components/BadgeCard";

import { getUserGamification } from "../api/getGamification";
import { getGamificationBadges } from "../api/getBadges";

import type {
  UserGamification,
  GemTransaction,
  GamificationBadge,
  UserBadge,
} from "../types/gamification";

// =====================================================
// Gamification Page
// =====================================================

export default function GamificationPage() {
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

  // ===================================================
  // Load Gamification
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [
          gamificationData,
          badgesData,
        ] = await Promise.all([
          getUserGamification(),
          getGamificationBadges(),
        ]);

        if (!mounted) {
          return;
        }

        setGamification(
          gamificationData.gamification ?? null
        );

        setTransactions(
          gamificationData.transactions ?? []
        );

        setBadges(
          badgesData.badges ?? []
        );

        setUserBadges(
          badgesData.userBadges ?? []
        );
      } catch (err) {
        console.error(
          "GAMIFICATION PAGE ERROR:",
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل نظام الجواهر."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-[60vh] bg-gray-50 p-4 md:p-6"
      >
        <div className="mx-auto max-w-6xl space-y-6">

          <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />

          <div className="h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />

          <div className="h-40 animate-pulse rounded-3xl bg-white shadow-sm" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-40 animate-pulse rounded-2xl bg-white" />
            <div className="h-40 animate-pulse rounded-2xl bg-white" />
            <div className="h-40 animate-pulse rounded-2xl bg-white" />
          </div>

          <div className="h-48 animate-pulse rounded-2xl bg-white" />

        </div>
      </div>
    );
  }

  // ===================================================
  // Error
  // ===================================================

  if (error) {
    return (
      <div
        dir="rtl"
        className="min-h-[60vh] bg-gray-50 p-4 md:p-6"
      >
        <div className="mx-auto max-w-2xl">

          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl">
              ⚠️
            </div>

            <h1 className="mt-4 text-xl font-black text-red-800">
              تعذر تحميل نظام الجواهر
            </h1>

            <p className="mt-3 text-sm leading-7 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="
                mt-6
                rounded-xl
                bg-red-600
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-red-700
              "
            >
              إعادة المحاولة
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ===================================================
  // Unlocked Badges
  // ===================================================

  const unlockedBadgeIds = new Set(
    userBadges.map(
      (userBadge) => userBadge.badge_id
    )
  );

  // ===================================================
  // Main
  // ===================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50"
    >
      <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-6 lg:p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <section>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
            <span className="text-lg">
              💎
            </span>

            <span>
              UniShare Gamification
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            الجواهر والإنجازات
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            كل مساهمة مفيدة في المجتمع الأكاديمي
            تساعدك على التقدم وجمع الجواهر وفتح
            الإنجازات.
          </p>
        </section>

        {/* =================================================
            GEMS
        ================================================= */}

        <section>
          <GemsCard
            gems={gamification?.gems ?? 0}
          />
        </section>

        {/* =================================================
            BADGES
        ================================================= */}

        <section>

          <div className="mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                🏆
              </span>

              <h2 className="text-2xl font-black text-gray-950">
                الإنجازات
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              اجمع الإنجازات من خلال المشاركة
              والمساهمة في UniShare.
            </p>
          </div>

          {badges.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-2xl">
                🏆
              </div>

              <h3 className="mt-4 text-lg font-black text-gray-900">
                لا توجد إنجازات متاحة
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                سيتم إضافة الإنجازات قريبًا.
              </p>

            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {badges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  unlocked={unlockedBadgeIds.has(
                    badge.id
                  )}
                />
              ))}

            </div>
          )}

        </section>

        {/* =================================================
            TRANSACTIONS
        ================================================= */}

        <section>

          <div className="mb-5">
            <div className="flex items-center gap-2">

              <span className="text-xl">
                📊
              </span>

              <h2 className="text-2xl font-black text-gray-950">
                آخر نشاط
              </h2>

            </div>

            <p className="mt-2 text-sm text-gray-500">
              سجل آخر عمليات الحصول على الجواهر
              واستخدامها.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

            {transactions.length === 0 ? (
              <div className="p-10 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-2xl">
                  💎
                </div>

                <h3 className="mt-4 font-black text-gray-900">
                  لا توجد معاملات بعد
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  ستظهر هنا عمليات الجواهر الخاصة
                  بك.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {transactions.map(
                  (transaction) => {

                    const isPositive =
                      transaction.amount >= 0;

                    return (
                      <div
                        key={transaction.id}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          p-4
                          transition
                          hover:bg-gray-50
                          md:p-5
                        "
                      >

                        {/* Reason */}

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-gray-900 md:text-base">
                            {transaction.reason}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(
                              transaction.created_at
                            ).toLocaleString(
                              "ar-DZ"
                            )}
                          </p>

                        </div>

                        {/* Amount */}

                        <span
                          className={`
                            shrink-0
                            rounded-full
                            px-3
                            py-1.5
                            text-sm
                            font-black
                            ${
                              isPositive
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-600"
                            }
                          `}
                        >
                          {isPositive
                            ? "+"
                            : ""}
                          {transaction.amount} 💎
                        </span>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </section>

      </main>
    </div>
  );
}