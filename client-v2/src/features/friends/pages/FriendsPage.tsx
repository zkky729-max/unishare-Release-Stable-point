
import { useEffect, useState } from "react";

import {
  MessageCircle,
  RefreshCw,
  UserCheck,
  UserRound,
  Users,
  Sparkles,
  ArrowLeft,
  Heart,
  GraduationCap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getFriends,
  type Friend,
} from "../api/getFriends";

import { createConversation } from "../../messages/api/createConversation";

import FriendRequests from "../components/FriendRequests";

const friendCardStyles = [
  {
    gradient: "from-blue-500/15 via-indigo-500/10 to-transparent",
    icon: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    border: "hover:border-blue-400/50",
  },
  {
    gradient: "from-violet-500/15 via-purple-500/10 to-transparent",
    icon: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    border: "hover:border-violet-400/50",
  },
  {
    gradient: "from-cyan-500/15 via-sky-500/10 to-transparent",
    icon: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    border: "hover:border-cyan-400/50",
  },
  {
    gradient: "from-fuchsia-500/15 via-pink-500/10 to-transparent",
    icon: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400",
    border: "hover:border-fuchsia-400/50",
  },
  {
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
    icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    border: "hover:border-emerald-400/50",
  },
  {
    gradient: "from-orange-500/15 via-amber-500/10 to-transparent",
    icon: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    border: "hover:border-orange-400/50",
  },
];

export default function FriendsPage() {
  const navigate = useNavigate();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openingConversationUserId, setOpeningConversationUserId] =
    useState<string | null>(null);

  // =====================================================
  // LOAD FRIENDS
  // =====================================================

  const loadFriends = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFriends();

      console.log("FRIENDS PAGE - FRIENDS:", data);

      setFriends(data);
    } catch (err) {
      console.error("Failed to load friends:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل تحميل قائمة الأصدقاء"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    void loadFriends();
  }, []);

  // =====================================================
  // OPEN CONVERSATION
  // =====================================================

  const handleMessageFriend = async (friend: Friend) => {
    if (openingConversationUserId || !friend.userId) {
      return;
    }

    try {
      setError("");
      setOpeningConversationUserId(friend.userId);

      const conversationId = await createConversation(friend.userId);

      navigate(`/messages/${conversationId}`);
    } catch (err) {
      console.error("Failed to open conversation:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل فتح المحادثة"
      );
    } finally {
      setOpeningConversationUserId(null);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-background px-3 py-5 sm:px-6 sm:py-7 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-7">

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-l from-blue-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-500/15 sm:p-8 lg:p-10">

          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4 sm:items-center sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-sm sm:h-16 sm:w-16">
                <Users size={30} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-100">
                  <Sparkles size={14} />
                  <span>مجتمع UniShare</span>
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                  أصدقاؤك في UniShare
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                  تواصل مع زملائك، تبادل المعرفة، ووسّع شبكتك الأكاديمية.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-[120px] items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <UserCheck size={21} />
                </div>

                <div>
                  <p className="text-2xl font-extrabold leading-none">
                    {loading ? "—" : friends.length}
                  </p>
                  <p className="mt-1 text-xs text-blue-100">
                    صديق
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void loadFriends()}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white px-5 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                تحديث القائمة
              </button>
            </div>
          </div>

          <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-5 text-xs text-blue-100 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <Heart size={15} />
              صداقات تجمعنا
            </span>

            <span className="inline-flex items-center gap-2">
              <GraduationCap size={16} />
              مجتمع أكاديمي
            </span>

            <span className="inline-flex items-center gap-2">
              <MessageCircle size={15} />
              تواصل مباشر
            </span>
          </div>
        </section>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="relative overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-blue-900/50 dark:from-blue-950/40 dark:to-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  إجمالي الأصدقاء
                </p>

                <p className="mt-3 text-3xl font-extrabold text-blue-800 dark:text-blue-200">
                  {loading ? "—" : friends.length}
                </p>

                <p className="mt-1 text-xs text-blue-600/80 dark:text-blue-300/70">
                  في شبكتك الأكاديمية
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                <Users size={27} />
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-10 -left-5 h-28 w-28 rounded-full bg-blue-400/10 blur-2xl" />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-violet-900/50 dark:from-violet-950/40 dark:to-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
                  التواصل
                </p>

                <p className="mt-3 text-xl font-extrabold text-violet-800 dark:text-violet-200">
                  مباشر
                </p>

                <p className="mt-1 text-xs text-violet-600/80 dark:text-violet-300/70">
                  راسل أصدقاءك بسهولة
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-violet-500/20">
                <MessageCircle size={27} />
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-10 -left-5 h-28 w-28 rounded-full bg-violet-400/10 blur-2xl" />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-cyan-900/50 dark:from-cyan-950/40 dark:to-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                  مجتمعك
                </p>

                <p className="mt-3 text-xl font-extrabold text-cyan-800 dark:text-cyan-200">
                  UniShare
                </p>

                <p className="mt-1 text-xs text-cyan-600/80 dark:text-cyan-300/70">
                  المعرفة تبدأ بالتواصل
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                <GraduationCap size={28} />
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-10 -left-5 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
          </div>
        </section>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

            <div className="min-w-0 flex-1">
              <p className="font-bold">حدث خطأ</p>
              <p className="mt-1 leading-6">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg px-2 py-1 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* FRIENDS SECTION */}
        {/* ================================================= */}

        <section className="space-y-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users size={19} />
                </div>

                <h2 className="text-xl font-extrabold tracking-tight">
                  قائمة الأصدقاء
                </h2>

                {!loading && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {friends.length}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                الأشخاص الذين يشاركونك رحلتك الأكاديمية في UniShare.
              </p>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="rounded-3xl border bg-card px-5 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <RefreshCw size={27} className="animate-spin" />
              </div>

              <p className="mt-5 font-bold">
                جاري تحميل الأصدقاء...
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                لحظات فقط، نجهز قائمتك
              </p>
            </div>

          ) : friends.length === 0 ? (

            /* EMPTY STATE */

            <div className="relative overflow-hidden rounded-3xl border bg-card px-5 py-16 text-center shadow-sm">
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20">
                <Users size={34} />
              </div>

              <h3 className="relative mt-6 text-xl font-extrabold">
                ابدأ ببناء شبكتك
              </h3>

              <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                لا توجد لديك صداقات بعد. عندما تصبح لديك علاقة صداقة مع أحد المستخدمين، سيظهر هنا.
              </p>

              <div className="relative mx-auto mt-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                <Sparkles size={14} className="text-primary" />
                ابنِ مجتمعك الأكاديمي
              </div>
            </div>

          ) : (

            /* FRIEND CARDS */

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {friends.map((friend, index) => {
                const displayName =
                  friend.fullName?.trim() ||
                  friend.username?.trim() ||
                  "مستخدم";

                const isOpening =
                  openingConversationUserId === friend.userId;

                const style =
                  friendCardStyles[index % friendCardStyles.length];

                return (
                  <article
                    key={friend.friendshipId}
                    className={`group relative isolate overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.border}`}
                  >
                    <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${style.gradient}`} />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-4">

                        {/* AVATAR */}

                        <div className="relative shrink-0">
                          <div className="h-[68px] w-[68px] overflow-hidden rounded-2xl border-2 border-background bg-muted shadow-md">
                            {friend.avatarUrl ? (
                              <img
                                src={friend.avatarUrl}
                                alt={displayName}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <UserRound size={30} className="text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          <span className="absolute -bottom-1.5 -left-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-emerald-500 text-white shadow-sm">
                            <UserCheck size={12} />
                          </span>
                        </div>

                        {/* NAME */}

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-extrabold transition-colors group-hover:text-primary">
                            {displayName}
                          </h3>

                          {friend.username ? (
                            <p className="mt-1 truncate text-xs text-muted-foreground" dir="ltr">
                              @{friend.username}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-muted-foreground">
                              عضو في UniShare
                            </p>
                          )}

                          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            صديق
                          </div>
                        </div>
                      </div>

                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
                        <GraduationCap size={20} />
                      </div>
                    </div>

                    <div className="mt-5 border-t border-border/60 pt-4">
                      <button
                        type="button"
                        onClick={() => void handleMessageFriend(friend)}
                        disabled={openingConversationUserId !== null}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 px-4 text-sm font-bold text-white shadow-md shadow-blue-500/15 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
                      >
                        {isOpening ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            جاري فتح المحادثة...
                          </>
                        ) : (
                          <>
                            <MessageCircle size={17} />
                            مراسلة
                            <ArrowLeft size={15} className="mr-auto" />
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* FRIEND REQUESTS */}
        {/* ================================================= */}

        <section className="overflow-hidden rounded-3xl">
          <FriendRequests />
        </section>

        {/* FOOTER */}

        {!loading && friends.length > 0 && (
          <div className="flex items-center justify-center gap-2 pb-3 text-center text-xs text-muted-foreground">
            <Heart size={13} className="text-pink-500" />
            أصدقاؤك جزء من مجتمعك الأكاديمي في UniShare.
          </div>
        )}

      </div>
    </div>
  );
}
