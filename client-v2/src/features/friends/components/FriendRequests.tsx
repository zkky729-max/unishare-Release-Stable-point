
import { useEffect, useState } from "react";

import {
  Check,
  Clock,
  RefreshCw,
  UserRound,
  X,
  Users,
  UserRoundPlus,
  Send,
  Sparkles,
  Inbox,
} from "lucide-react";

import {
  getFriendRequests,
  type FriendRequest,
} from "../api/getFriendRequests";

import { acceptFriendRequest } from "../api/acceptFriendRequest";
import { rejectFriendRequest } from "../api/rejectFriendRequest";
import { cancelFriendRequest } from "../api/cancelFriendRequest";

export default function FriendRequests() {
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // تحميل طلبات الصداقة
  const loadRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result = await getFriendRequests();

      setIncoming(result.incoming ?? []);
      setOutgoing(result.outgoing ?? []);
    } catch (err) {
      console.error("Failed to load friend requests:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل تحميل طلبات الصداقة"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  // قبول طلب
  const handleAccept = async (friendshipId: string) => {
    try {
      setProcessingId(friendshipId);
      setError("");

      await acceptFriendRequest(friendshipId);

      setIncoming((current) =>
        current.filter((request) => request.id !== friendshipId)
      );
    } catch (err) {
      console.error("Accept friend request error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل قبول طلب الصداقة"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // رفض طلب
  const handleReject = async (friendshipId: string) => {
    try {
      setProcessingId(friendshipId);
      setError("");

      await rejectFriendRequest(friendshipId);

      setIncoming((current) =>
        current.filter((request) => request.id !== friendshipId)
      );
    } catch (err) {
      console.error("Reject friend request error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل رفض طلب الصداقة"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // إلغاء طلب صادر
  const handleCancel = async (friendshipId: string) => {
    try {
      setProcessingId(friendshipId);
      setError("");

      await cancelFriendRequest(friendshipId);

      setOutgoing((current) =>
        current.filter((request) => request.id !== friendshipId)
      );
    } catch (err) {
      console.error("Cancel friend request error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل إلغاء طلب الصداقة"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // اسم المستخدم
  const getDisplayName = (request: FriendRequest) => {
    return (
      request.fullName?.trim() ||
      request.username?.trim() ||
      "مستخدم"
    );
  };

  // صورة المستخدم
  const UserAvatar = ({
    request,
  }: {
    request: FriendRequest;
  }) => {
    const displayName = getDisplayName(request);

    return (
      <div
        className="
          flex h-14 w-14 shrink-0 items-center
          justify-center overflow-hidden rounded-2xl
          bg-gradient-to-br from-blue-100 to-indigo-100
          ring-4 ring-white/70
          dark:from-blue-950 dark:to-indigo-950
          dark:ring-slate-800
        "
      >
        {request.avatarUrl ? (
          <img
            src={request.avatarUrl}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound
            size={25}
            className="text-blue-600 dark:text-blue-400"
          />
        )}
      </div>
    );
  };

  // شاشة التحميل
  if (loading) {
    return (
      <div dir="rtl" className="space-y-5">
        <div className="rounded-3xl border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 py-5">
            <RefreshCw
              size={21}
              className="animate-spin text-blue-600"
            />
            <span className="text-sm font-medium text-muted-foreground">
              جاري تحميل طلبات الصداقة...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">

      {/* Header */}
      <div
        className="
          relative overflow-hidden rounded-3xl
          bg-gradient-to-l from-blue-700
          via-indigo-600 to-violet-600
          p-6 text-white shadow-lg
          shadow-blue-900/10 sm:p-8
        "
      >
        <div className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-sm">
              <Users size={29} />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <Sparkles size={15} className="text-blue-200" />
                <span className="text-xs font-medium text-blue-100">
                  مجتمع UniShare
                </span>
              </div>

              <h2 className="text-xl font-bold sm:text-2xl">
                طلبات الصداقة
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                تواصل مع زملائك وأدر طلبات الصداقة بسهولة.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadRequests(true)}
            disabled={refreshing}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-white/25
              bg-white/15 px-4 py-3 text-sm font-semibold
              text-white shadow-sm backdrop-blur-sm
              transition hover:bg-white/25
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            تحديث الطلبات
          </button>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-xs text-blue-100">إجمالي الطلبات</span>
            <p className="mt-0.5 text-xl font-bold tabular-nums">
              {incoming.length + outgoing.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-xs text-blue-100">الواردة</span>
            <p className="mt-0.5 text-xl font-bold tabular-nums">
              {incoming.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-xs text-blue-100">الصادرة</span>
            <p className="mt-0.5 text-xl font-bold tabular-nums">
              {outgoing.length}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="
            flex items-start gap-3 rounded-2xl
            border border-destructive/30
            bg-destructive/10 p-4
            text-sm text-destructive
          "
        >
          <X size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div
          className="
            overflow-hidden rounded-2xl border
            border-blue-200/70 bg-gradient-to-br
            from-blue-50 to-sky-100 p-5
            shadow-sm transition hover:-translate-y-0.5
            hover:shadow-md dark:border-blue-900/50
            dark:from-blue-950/50 dark:to-slate-900
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                الطلبات الواردة
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                {incoming.length}
              </p>
              <p className="mt-1 text-xs text-blue-700/70 dark:text-blue-300/70">
                طلبات تنتظر موافقتك
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <UserRoundPlus size={27} />
            </div>
          </div>
        </div>

        <div
          className="
            overflow-hidden rounded-2xl border
            border-violet-200/70 bg-gradient-to-br
            from-violet-50 to-purple-100 p-5
            shadow-sm transition hover:-translate-y-0.5
            hover:shadow-md dark:border-violet-900/50
            dark:from-violet-950/50 dark:to-slate-900
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">
                الطلبات الصادرة
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-violet-700 dark:text-violet-400">
                {outgoing.length}
              </p>
              <p className="mt-1 text-xs text-violet-700/70 dark:text-violet-300/70">
                طلبات تنتظر رد الآخرين
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
              <Send size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Requests */}
      <section
        className="
          overflow-hidden rounded-3xl border
          bg-card shadow-sm
        "
      >
        <div className="flex items-center justify-between gap-3 border-b bg-gradient-to-l from-blue-50/80 to-transparent px-5 py-5 dark:from-blue-950/20 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Inbox size={22} />
            </div>

            <div>
              <h3 className="font-bold">الطلبات الواردة</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                الأشخاص الذين يرغبون في التواصل معك
              </p>
            </div>
          </div>

          <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-blue-100 px-3 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {incoming.length}
          </span>
        </div>

        {incoming.length === 0 ? (
          <div className="px-5 py-12 text-center sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40">
              <UserRoundPlus
                size={29}
                className="text-blue-500"
              />
            </div>

            <h4 className="mt-4 font-semibold">
              لا توجد طلبات واردة
            </h4>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              عندما يرسل إليك أحد الطلاب طلب صداقة، سيظهر هنا لتتمكن من قبوله أو رفضه.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 p-4 sm:p-5">
            {incoming.map((request) => {
              const displayName = getDisplayName(request);
              const isProcessing = processingId === request.id;

              return (
                <div
                  key={request.id}
                  className="
                    flex flex-col gap-4 rounded-2xl
                    border bg-background p-4
                    transition hover:border-blue-300
                    hover:shadow-md dark:hover:border-blue-800
                    sm:flex-row sm:items-center
                  "
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <UserAvatar request={request} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {displayName}
                      </p>

                      {request.username && (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          @{request.username}
                        </p>
                      )}

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                        <UserRoundPlus size={13} />
                        أرسل إليك طلب صداقة
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => void handleAccept(request.id)}
                      disabled={isProcessing}
                      className="
                        inline-flex flex-1 items-center
                        justify-center gap-2 rounded-xl
                        bg-emerald-600 px-4 py-2.5
                        text-sm font-semibold text-white
                        shadow-sm transition hover:bg-emerald-700
                        disabled:cursor-not-allowed disabled:opacity-50
                        sm:flex-none
                      "
                    >
                      {isProcessing ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      قبول
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleReject(request.id)}
                      disabled={isProcessing}
                      className="
                        inline-flex flex-1 items-center
                        justify-center gap-2 rounded-xl
                        border border-rose-200 bg-rose-50
                        px-4 py-2.5 text-sm font-semibold
                        text-rose-700 transition hover:bg-rose-100
                        disabled:cursor-not-allowed disabled:opacity-50
                        dark:border-rose-900/50 dark:bg-rose-950/30
                        dark:text-rose-400 dark:hover:bg-rose-950/60
                        sm:flex-none
                      "
                    >
                      <X size={16} />
                      رفض
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Outgoing Requests */}
      <section
        className="
          overflow-hidden rounded-3xl border
          bg-card shadow-sm
        "
      >
        <div className="flex items-center justify-between gap-3 border-b bg-gradient-to-l from-violet-50/80 to-transparent px-5 py-5 dark:from-violet-950/20 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
              <Send size={21} />
            </div>

            <div>
              <h3 className="font-bold">الطلبات الصادرة</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                الطلبات التي أرسلتها إلى الآخرين
              </p>
            </div>
          </div>

          <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-violet-100 px-3 text-sm font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            {outgoing.length}
          </span>
        </div>

        {outgoing.length === 0 ? (
          <div className="px-5 py-12 text-center sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/40">
              <Send
                size={27}
                className="text-violet-500"
              />
            </div>

            <h4 className="mt-4 font-semibold">
              لا توجد طلبات صادرة
            </h4>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              عندما ترسل طلب صداقة إلى طالب آخر، سيظهر هنا ويمكنك إلغاؤه في أي وقت قبل قبوله.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 p-4 sm:p-5">
            {outgoing.map((request) => {
              const displayName = getDisplayName(request);
              const isProcessing = processingId === request.id;

              return (
                <div
                  key={request.id}
                  className="
                    flex flex-col gap-4 rounded-2xl
                    border bg-background p-4
                    transition hover:border-violet-300
                    hover:shadow-md dark:hover:border-violet-800
                    sm:flex-row sm:items-center
                  "
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <UserAvatar request={request} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {displayName}
                      </p>

                      {request.username && (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          @{request.username}
                        </p>
                      )}

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400">
                        <Clock size={13} />
                        طلب الصداقة قيد الانتظار
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleCancel(request.id)}
                    disabled={isProcessing}
                    className="
                      inline-flex shrink-0 items-center
                      justify-center gap-2 rounded-xl
                      border border-rose-200 bg-rose-50
                      px-4 py-2.5 text-sm font-semibold
                      text-rose-700 transition hover:bg-rose-100
                      disabled:cursor-not-allowed disabled:opacity-50
                      dark:border-rose-900/50 dark:bg-rose-950/30
                      dark:text-rose-400 dark:hover:bg-rose-950/60
                    "
                  >
                    {isProcessing ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                    إلغاء الطلب
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
        <Sparkles size={14} className="text-blue-500" />
        <span>اجعل مجتمع UniShare أكثر تواصلاً وتعاوناً</span>
      </div>
    </div>
  );
}
