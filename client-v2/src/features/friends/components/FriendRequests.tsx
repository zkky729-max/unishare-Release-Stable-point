import { useEffect, useState } from "react";

import {
  Check,
  Clock,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";

import {
  getFriendRequests,
  type FriendRequest,
} from "../api/getFriendRequests";

import { acceptFriendRequest } from "../api/acceptFriendRequest";
import { rejectFriendRequest } from "../api/rejectFriendRequest";
import { cancelFriendRequest } from "../api/cancelFriendRequest";

export default function FriendRequests() {
  const [incoming, setIncoming] = useState<
    FriendRequest[]
  >([]);

  const [outgoing, setOutgoing] = useState<
    FriendRequest[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  // =====================================================
  // تحميل طلبات الصداقة
  // =====================================================

  const loadRequests = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result =
        await getFriendRequests();

      console.log(
        "FRIEND REQUESTS:",
        result
      );

      setIncoming(
        result.incoming ?? []
      );

      setOutgoing(
        result.outgoing ?? []
      );
    } catch (err) {
      console.error(
        "Failed to load friend requests:",
        err
      );

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

  // =====================================================
  // التحميل الأول
  // =====================================================

  useEffect(() => {
    void loadRequests();
  }, []);

  // =====================================================
  // قبول طلب
  // =====================================================

  const handleAccept = async (
    friendshipId: string
  ) => {
    try {
      setProcessingId(friendshipId);
      setError("");

      await acceptFriendRequest(
        friendshipId
      );

      setIncoming((current) =>
        current.filter(
          (request) =>
            request.id !== friendshipId
        )
      );
    } catch (err) {
      console.error(
        "Accept friend request error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل قبول طلب الصداقة"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // رفض طلب
  // =====================================================

  const handleReject = async (
    friendshipId: string
  ) => {
    try {
      setProcessingId(friendshipId);
      setError("");

      await rejectFriendRequest(
        friendshipId
      );

      setIncoming((current) =>
        current.filter(
          (request) =>
            request.id !== friendshipId
        )
      );
    } catch (err) {
      console.error(
        "Reject friend request error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل رفض طلب الصداقة"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // إلغاء طلب صادر
  // =====================================================

  const handleCancel = async (
    friendshipId: string
  ) => {
    try {
      setProcessingId(friendshipId);
      setError("");

      await cancelFriendRequest(
        friendshipId
      );

      setOutgoing((current) =>
        current.filter(
          (request) =>
            request.id !== friendshipId
        )
      );
    } catch (err) {
      console.error(
        "Cancel friend request error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل إلغاء طلب الصداقة"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // اسم المستخدم
  // =====================================================

  const getDisplayName = (
    request: FriendRequest
  ) => {
    return (
      request.fullName?.trim() ||
      request.username?.trim() ||
      "مستخدم"
    );
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="
          rounded-2xl
          border
          bg-card
          p-6
        "
      >
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <RefreshCw
            size={18}
            className="animate-spin"
          />

          <span
            className="
              text-sm
              text-muted-foreground
            "
          >
            جاري تحميل طلبات الصداقة...
          </span>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      dir="rtl"
      className="space-y-6"
    >
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          rounded-2xl
          border
          bg-card
          p-5
        "
      >
        <div>
          <h2 className="text-lg font-semibold">
            طلبات الصداقة
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-muted-foreground
            "
          >
            إدارة طلبات الصداقة الواردة والصادرة.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void loadRequests(true);
          }}
          disabled={refreshing}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            px-3
            py-2
            text-sm
            transition
            hover:bg-muted
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          تحديث
        </button>
      </div>

      {/* ================================================= */}
      {/* Error */}
      {/* ================================================= */}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-destructive/30
            bg-destructive/10
            p-4
            text-sm
            text-destructive
          "
        >
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* الطلبات الواردة */}
      {/* ================================================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          bg-card
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-5
            py-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <UserRound
              size={18}
              className="text-muted-foreground"
            />

            <h3 className="font-semibold">
              الطلبات الواردة
            </h3>
          </div>

          <span
            className="
              rounded-full
              bg-muted
              px-2.5
              py-1
              text-xs
              font-medium
            "
          >
            {incoming.length}
          </span>
        </div>

        {incoming.length === 0 ? (
          <div
            className="
              px-5
              py-8
              text-center
            "
          >
            <Clock
              size={24}
              className="
                mx-auto
                text-muted-foreground
              "
            />

            <p
              className="
                mt-3
                text-sm
                text-muted-foreground
              "
            >
              لا توجد طلبات صداقة واردة.
            </p>
          </div>
        ) : (
          <div>
            {incoming.map(
              (request) => {
                const displayName =
                  getDisplayName(
                    request
                  );

                const isProcessing =
                  processingId ===
                  request.id;

                return (
                  <div
                    key={request.id}
                    className="
                      flex
                      flex-col
                      gap-4
                      border-b
                      p-4
                      last:border-b-0
                      sm:flex-row
                      sm:items-center
                    "
                  >
                    {/* Avatar */}

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-muted
                      "
                    >
                      {request.avatarUrl ? (
                        <img
                          src={
                            request.avatarUrl
                          }
                          alt={
                            displayName
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        <UserRound
                          size={22}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>

                    {/* User Info */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                        "
                      >
                        {displayName}
                      </p>

                      {request.username && (
                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            text-muted-foreground
                          "
                        >
                          @{request.username}
                        </p>
                      )}

                      <p
                        className="
                          mt-1
                          text-xs
                          text-muted-foreground
                        "
                      >
                        أرسل لك طلب صداقة
                      </p>
                    </div>

                    {/* Actions */}

                    <div
                      className="
                        flex
                        shrink-0
                        gap-2
                      "
                    >
                      <button
                        type="button"
                        onClick={() => {
                          void handleAccept(
                            request.id
                          );
                        }}
                        disabled={
                          isProcessing
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5
                          rounded-lg
                          border
                          px-3
                          py-2
                          text-sm
                          transition
                          hover:bg-muted
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isProcessing ? (
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Check
                            size={15}
                          />
                        )}

                        قبول
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          void handleReject(
                            request.id
                          );
                        }}
                        disabled={
                          isProcessing
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5
                          rounded-lg
                          border
                          px-3
                          py-2
                          text-sm
                          transition
                          hover:bg-muted
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <X size={15} />

                        رفض
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* الطلبات الصادرة */}
      {/* ================================================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          bg-card
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-5
            py-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Clock
              size={18}
              className="text-muted-foreground"
            />

            <h3 className="font-semibold">
              الطلبات الصادرة
            </h3>
          </div>

          <span
            className="
              rounded-full
              bg-muted
              px-2.5
              py-1
              text-xs
              font-medium
            "
          >
            {outgoing.length}
          </span>
        </div>

        {outgoing.length === 0 ? (
          <div
            className="
              px-5
              py-8
              text-center
            "
          >
            <Clock
              size={24}
              className="
                mx-auto
                text-muted-foreground
              "
            />

            <p
              className="
                mt-3
                text-sm
                text-muted-foreground
              "
            >
              لا توجد طلبات صداقة صادرة.
            </p>
          </div>
        ) : (
          <div>
            {outgoing.map(
              (request) => {
                const displayName =
                  getDisplayName(
                    request
                  );

                const isProcessing =
                  processingId ===
                  request.id;

                return (
                  <div
                    key={request.id}
                    className="
                      flex
                      flex-col
                      gap-4
                      border-b
                      p-4
                      last:border-b-0
                      sm:flex-row
                      sm:items-center
                    "
                  >
                    {/* Avatar */}

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-muted
                      "
                    >
                      {request.avatarUrl ? (
                        <img
                          src={
                            request.avatarUrl
                          }
                          alt={
                            displayName
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        <UserRound
                          size={22}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>

                    {/* User Info */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                        "
                      >
                        {displayName}
                      </p>

                      {request.username && (
                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            text-muted-foreground
                          "
                        >
                          @{request.username}
                        </p>
                      )}

                      <p
                        className="
                          mt-1
                          text-xs
                          text-muted-foreground
                        "
                      >
                        طلب صداقة قيد الانتظار
                      </p>
                    </div>

                    {/* Cancel */}

                    <button
                      type="button"
                      onClick={() => {
                        void handleCancel(
                          request.id
                        );
                      }}
                      disabled={
                        isProcessing
                      }
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        justify-center
                        gap-1.5
                        rounded-lg
                        border
                        px-3
                        py-2
                        text-sm
                        transition
                        hover:bg-muted
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isProcessing ? (
                        <RefreshCw
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <X size={15} />
                      )}

                      إلغاء الطلب
                    </button>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}