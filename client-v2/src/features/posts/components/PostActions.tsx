import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

import { useState } from "react";

// =====================================================
// Props
// =====================================================

interface Props {
  postId: string;
  likedByMe: boolean;
  onLike: () => Promise<void>;
  showComments?: boolean;
  onComment?: () => void;
  onShare?: () => void;
}

// =====================================================
// Component
// =====================================================

export default function PostActions({
  postId,
  likedByMe,
  onLike,
  showComments = false,
  onComment,
  onShare,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  // محفوظ للتوافق مع المكونات الحالية
  void postId;

  // ===================================================
  // Like
  // ===================================================

  async function handleLike() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      await onLike();
    } catch (error) {
      console.error(
        "LIKE ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="
        grid
        grid-cols-3
        gap-1
        px-2
        py-2
        sm:px-3
      "
    >
      {/* Like */}

      <button
        type="button"
        onClick={handleLike}
        disabled={loading}
        aria-label={
          likedByMe
            ? "إلغاء الإعجاب"
            : "إعجاب"
        }
        className={`
          group/action
          flex
          min-h-[44px]
          items-center
          justify-center
          gap-2
          rounded-xl
          text-sm
          font-semibold
          transition-all
          duration-200
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${
            likedByMe
              ? "bg-red-50 text-red-600"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }
        `}
      >
        <Heart
          size={19}
          strokeWidth={2}
          className={`
            transition-transform
            duration-200
            group-hover/action:scale-110
            ${
              likedByMe
                ? "fill-current"
                : ""
            }
          `}
        />

        <span>إعجاب</span>
      </button>

      {/* Comment */}

      <button
        type="button"
        onClick={onComment}
        aria-expanded={showComments}
        className={`
          group/action
          flex
          min-h-[44px]
          items-center
          justify-center
          gap-2
          rounded-xl
          text-sm
          font-semibold
          transition-all
          duration-200
          ${
            showComments
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
          }
        `}
      >
        <MessageCircle
          size={19}
          strokeWidth={2}
          className="
            transition-transform
            duration-200
            group-hover/action:scale-110
          "
        />

        <span>تعليق</span>
      </button>

      {/* Share */}

      <button
        type="button"
        onClick={onShare}
        className="
          group/action
          flex
          min-h-[44px]
          items-center
          justify-center
          gap-2
          rounded-xl
          text-sm
          font-semibold
          text-slate-600
          transition-all
          duration-200
          hover:bg-emerald-50
          hover:text-emerald-600
        "
      >
        <Share2
          size={19}
          strokeWidth={2}
          className="
            transition-transform
            duration-200
            group-hover/action:scale-110
          "
        />

        <span>مشاركة</span>
      </button>
    </div>
  );
}