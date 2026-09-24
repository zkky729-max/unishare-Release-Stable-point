import {
  useEffect,
  useState,
} from "react";

import {
  UserPlus,
  Clock,
  Check,
  X,
  UserCheck,
  Loader2,
} from "lucide-react";

import type {
  UserSearchResult,
} from "../api/searchUsers";

import {
  sendFriendRequest,
} from "../api/sendFriendRequest";

import {
  getFriends,
} from "../api/getFriends";

import {
  getFriendRequests,
} from "../api/getFriendRequests";

import {
  acceptFriendRequest,
} from "../api/acceptFriendRequest";

import {
  rejectFriendRequest,
} from "../api/rejectFriendRequest";

import {
  cancelFriendRequest,
} from "../api/cancelFriendRequest";

// =====================================================
// TYPES
// =====================================================

interface FriendActionProps {
  user: UserSearchResult;

  onChanged?: () => void;
}

type RelationshipStatus =
  | "loading"
  | "none"
  | "outgoing"
  | "incoming"
  | "accepted";

// =====================================================
// FRIEND ACTION
// =====================================================
//
// مسؤول عن حالة الصداقة مع مستخدم معين.
//
// الحالات:
// - none
// - outgoing
// - incoming
// - accepted
//
// لا يتم تعديل UserCard.
// =====================================================

export default function FriendAction({
  user,
  onChanged,
}: FriendActionProps) {
  // ---------------------------------------------------
  // State
  // ---------------------------------------------------

  const [
    relationship,
    setRelationship,
  ] =
    useState<RelationshipStatus>(
      "loading"
    );

  const [
    friendshipId,
    setFriendshipId,
  ] =
    useState<string | null>(
      null
    );

  const [
    processing,
    setProcessing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  // ===================================================
  // LOAD RELATIONSHIP
  // ===================================================

  const loadRelationship =
    async () => {
      try {
        setRelationship(
          "loading"
        );

        setError(null);

        // -----------------------------------------------
        // تحميل الأصدقاء
        // -----------------------------------------------

        const friends =
          await getFriends();

        const existingFriend =
          friends.find(
            (friend) =>
              friend.userId ===
              user.userId
          );

        if (existingFriend) {
          setRelationship(
            "accepted"
          );

          setFriendshipId(
            existingFriend.friendshipId
          );

          return;
        }

        // -----------------------------------------------
        // تحميل طلبات الصداقة
        // -----------------------------------------------

        const requests =
          await getFriendRequests();

        // -----------------------------------------------
        // طلب صادر
        // -----------------------------------------------

        const outgoingRequest =
          requests.outgoing.find(
            (request) =>
              request.addresseeId ===
              user.userId
          );

        if (outgoingRequest) {
          setRelationship(
            "outgoing"
          );

          setFriendshipId(
            outgoingRequest.id
          );

          return;
        }

        // -----------------------------------------------
        // طلب وارد
        // -----------------------------------------------

        const incomingRequest =
          requests.incoming.find(
            (request) =>
              request.requesterId ===
              user.userId
          );

        if (incomingRequest) {
          setRelationship(
            "incoming"
          );

          setFriendshipId(
            incomingRequest.id
          );

          return;
        }

        // -----------------------------------------------
        // لا توجد علاقة
        // -----------------------------------------------

        setRelationship(
          "none"
        );

        setFriendshipId(
          null
        );
      } catch (err: any) {
        console.error(
          "Load friend relationship error:",
          err
        );

        setError(
          err?.message ||
            "فشل تحميل حالة الصداقة"
        );

        setRelationship(
          "none"
        );
      }
    };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    void loadRelationship();
  }, [user.userId]);

  // ===================================================
  // SEND FRIEND REQUEST
  // ===================================================

  const handleSend =
    async () => {
      try {
        setProcessing(true);

        setError(null);

        await sendFriendRequest(
          user.userId
        );

        // -----------------------------------------------
        // تحديث الحالة مباشرة
        // -----------------------------------------------

        setRelationship(
          "outgoing"
        );

        // -----------------------------------------------
        // إعادة تحميل للحصول على friendshipId
        // -----------------------------------------------

        await loadRelationship();

        onChanged?.();
      } catch (err: any) {
        console.error(
          "Send friend request error:",
          err
        );

        setError(
          err?.message ||
            "فشل إرسال طلب الصداقة"
        );
      } finally {
        setProcessing(false);
      }
    };

  // ===================================================
  // ACCEPT FRIEND REQUEST
  // ===================================================

  const handleAccept =
    async () => {
      if (!friendshipId) {
        return;
      }

      try {
        setProcessing(true);

        setError(null);

        await acceptFriendRequest(
          friendshipId
        );

        setRelationship(
          "accepted"
        );

        onChanged?.();
      } catch (err: any) {
        console.error(
          "Accept friend request error:",
          err
        );

        setError(
          err?.message ||
            "فشل قبول طلب الصداقة"
        );
      } finally {
        setProcessing(false);
      }
    };

  // ===================================================
  // REJECT FRIEND REQUEST
  // ===================================================

  const handleReject =
    async () => {
      if (!friendshipId) {
        return;
      }

      try {
        setProcessing(true);

        setError(null);

        await rejectFriendRequest(
          friendshipId
        );

        setRelationship(
          "none"
        );

        setFriendshipId(
          null
        );

        onChanged?.();
      } catch (err: any) {
        console.error(
          "Reject friend request error:",
          err
        );

        setError(
          err?.message ||
            "فشل رفض طلب الصداقة"
        );
      } finally {
        setProcessing(false);
      }
    };

  // ===================================================
  // CANCEL FRIEND REQUEST
  // ===================================================

  const handleCancel =
    async () => {
      if (!friendshipId) {
        return;
      }

      try {
        setProcessing(true);

        setError(null);

        await cancelFriendRequest(
          friendshipId
        );

        setRelationship(
          "none"
        );

        setFriendshipId(
          null
        );

        onChanged?.();
      } catch (err: any) {
        console.error(
          "Cancel friend request error:",
          err
        );

        setError(
          err?.message ||
            "فشل إلغاء طلب الصداقة"
        );
      } finally {
        setProcessing(false);
      }
    };

  // ===================================================
  // LOADING
  // ===================================================

  if (
    relationship ===
    "loading"
  ) {
    return (
      <div
        className="
          flex
          items-center
          justify-center
          rounded-lg
          px-3
          py-2
          text-muted-foreground
        "
      >
        <Loader2
          className="
            h-4
            w-4
            animate-spin
          "
        />
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div
        className="
          flex
          flex-col
          items-end
          gap-1
        "
      >
        <button
          type="button"
          onClick={() => {
            void loadRelationship();
          }}
          disabled={processing}
          className="
            rounded-lg
            border
            border-border
            bg-background
            px-3
            py-2
            text-sm
            font-medium
            text-foreground
            transition-colors
            hover:bg-accent
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          إعادة المحاولة
        </button>

        <span
          className="
            max-w-48
            text-right
            text-xs
            text-destructive
          "
        >
          {error}
        </span>
      </div>
    );
  }

  // ===================================================
  // ACCEPTED
  // ===================================================

  if (
    relationship ===
    "accepted"
  ) {
    return (
      <button
        type="button"
        disabled
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          border-border
          bg-muted
          px-3
          py-2
          text-sm
          font-medium
          text-muted-foreground
          disabled:cursor-default
        "
      >
        <UserCheck
          className="
            h-4
            w-4
          "
        />

        <span>
          أصدقاء
        </span>
      </button>
    );
  }

  // ===================================================
  // OUTGOING
  // ===================================================

  if (
    relationship ===
    "outgoing"
  ) {
    return (
      <button
        type="button"
        onClick={() => {
          void handleCancel();
        }}
        disabled={processing}
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          border-border
          bg-muted
          px-3
          py-2
          text-sm
          font-medium
          text-muted-foreground
          transition-colors
          hover:bg-accent
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {processing ? (
          <Loader2
            className="
              h-4
              w-4
              animate-spin
            "
          />
        ) : (
          <Clock
            className="
              h-4
              w-4
            "
          />
        )}

        <span>
          {processing
            ? "جارٍ..."
            : "تم الإرسال"}
        </span>
      </button>
    );
  }

  // ===================================================
  // INCOMING
  // ===================================================

  if (
    relationship ===
    "incoming"
  ) {
    return (
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <button
          type="button"
          onClick={() => {
            void handleAccept();
          }}
          disabled={processing}
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            bg-primary
            px-3
            py-2
            text-sm
            font-medium
            text-primary-foreground
            transition-opacity
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {processing ? (
            <Loader2
              className="
                h-4
                w-4
                animate-spin
              "
            />
          ) : (
            <Check
              className="
                h-4
                w-4
              "
            />
          )}

          <span>
            قبول
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            void handleReject();
          }}
          disabled={processing}
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-border
            bg-background
            px-3
            py-2
            text-sm
            font-medium
            text-foreground
            transition-colors
            hover:bg-accent
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <X
            className="
              h-4
              w-4
            "
          />

          <span>
            رفض
          </span>
        </button>
      </div>
    );
  }

  // ===================================================
  // NONE
  // ===================================================

  return (
    <button
      type="button"
      onClick={() => {
        void handleSend();
      }}
      disabled={processing}
      className="
        inline-flex
        items-center
        gap-2
        rounded-lg
        bg-primary
        px-3
        py-2
        text-sm
        font-medium
        text-primary-foreground
        transition-opacity
        hover:opacity-90
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {processing ? (
        <Loader2
          className="
            h-4
            w-4
            animate-spin
          "
        />
      ) : (
        <UserPlus
          className="
            h-4
            w-4
          "
        />
      )}

      <span>
        {processing
          ? "جارٍ..."
          : "إضافة صديق"}
      </span>
    </button>
  );
}