import {
  Clock3,
  GraduationCap,
} from "lucide-react";

import PostMenu from "./PostMenu";

interface PostHeaderProps {
  author: {
    name: string;
    avatar?: string;
  };

  createdAt: string;

  isOwner: boolean;

  onEdit?: () => void;

  onDelete?: () => void;
}

export default function PostHeader({
  author,
  createdAt,
  isOwner,
  onEdit,
  onDelete,
}: PostHeaderProps) {
  return (
    <header
      dir="rtl"
      className="
        flex
        items-start
        justify-between
        gap-4
      "
    >
      {/* ================================================= */}
      {/* Author */}
      {/* ================================================= */}

      <div className="flex min-w-0 items-center gap-3.5">
        {/* Avatar */}

        <div className="relative shrink-0">
          <div
            className="
              rounded-2xl
              bg-gradient-to-br
              from-indigo-500
              via-violet-500
              to-blue-500
              p-[2px]
              shadow-sm
            "
          >
            <img
              src={
                author.avatar ||
                "/avatars/default.png"
              }
              alt={author.name}
              className="
                h-12
                w-12
                rounded-[14px]
                border-2
                border-white
                bg-slate-100
                object-cover
                sm:h-[50px]
                sm:w-[50px]
              "
            />
          </div>

          {/* Online Indicator */}

          <span
            className="
              absolute
              bottom-0
              left-0
              h-3.5
              w-3.5
              rounded-full
              border-2
              border-white
              bg-emerald-500
              shadow-sm
            "
            aria-label="متصل"
          />
        </div>

        {/* Author Info */}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="
                max-w-[180px]
                truncate
                text-sm
                font-bold
                text-slate-900
                sm:max-w-[260px]
                sm:text-[15px]
              "
            >
              {author.name}
            </h3>

            {/* Academic Badge */}

            <span
              className="
                hidden
                shrink-0
                items-center
                gap-1
                rounded-full
                bg-indigo-50
                px-2
                py-0.5
                text-[10px]
                font-bold
                text-indigo-600
                sm:inline-flex
              "
            >
              <GraduationCap
                size={11}
              />

              أكاديمي
            </span>
          </div>

          {/* Time */}

          <div
            className="
              mt-1.5
              flex
              min-w-0
              items-center
              gap-1.5
              text-[11px]
              font-medium
              text-slate-400
            "
          >
            <Clock3
              size={12}
              className="shrink-0"
            />

            <span className="truncate">
              {createdAt}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* Owner Menu */}
      {/* ================================================= */}

      {isOwner && (
        <div className="shrink-0">
          <PostMenu
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </header>
  );
}