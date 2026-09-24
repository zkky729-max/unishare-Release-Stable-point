import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

interface Props {
  likes: number;
  comments: number;
  shares: number;
}

export default function PostFooter({
  likes,
  comments,
  shares,
}: Props) {
  return (
    <div
      dir="rtl"
      className="
        flex
        items-center
        justify-between
        border-t
        border-slate-100
        pt-4
        text-xs
        text-slate-500
      "
    >
      {/* Likes */}

      <div
        className="
          flex
          items-center
          gap-1.5
        "
      >
        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-red-50
            text-red-500
          "
        >
          <Heart
            size={14}
            fill="currentColor"
          />
        </div>

        <span className="font-bold text-slate-700">
          {likes}
        </span>

        <span className="hidden sm:inline">
          إعجاب
        </span>
      </div>

      {/* Comments */}

      <div
        className="
          flex
          items-center
          gap-1.5
        "
      >
        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-blue-50
            text-blue-500
          "
        >
          <MessageCircle size={14} />
        </div>

        <span className="font-bold text-slate-700">
          {comments}
        </span>

        <span className="hidden sm:inline">
          تعليق
        </span>
      </div>

      {/* Shares */}

      <div
        className="
          flex
          items-center
          gap-1.5
        "
      >
        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-emerald-50
            text-emerald-500
          "
        >
          <Share2 size={14} />
        </div>

        <span className="font-bold text-slate-700">
          {shares}
        </span>

        <span className="hidden sm:inline">
          مشاركة
        </span>
      </div>
    </div>
  );
}