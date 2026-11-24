
import { useState } from "react";

import type {
  UserSearchResult,
} from "../api/searchUsers";

// =====================================================
// TYPES
// =====================================================

interface UserCardProps {
  user: UserSearchResult;
  children?: React.ReactNode;
}

// =====================================================
// USER CARD
// =====================================================

export default function UserCard({
  user,
  children,
}: UserCardProps) {
  const displayName =
    user.fullName?.trim() ||
    user.username?.trim() ||
    "مستخدم UniShare";

  const username =
    user.username?.trim() || null;

  const [imageError, setImageError] =
    useState(false);

  const avatarUrl =
    user.avatarUrl?.trim() || null;

  const showDefaultAvatar =
    !avatarUrl || imageError;

  return (
    <article
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-border
        bg-card
        p-4
        transition-colors
        hover:bg-accent/50
      "
    >
      {/* Avatar */}

      <div
        className="
          h-12
          w-12
          shrink-0
          overflow-hidden
          rounded-full
          bg-muted
        "
      >
        {showDefaultAvatar ? (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              rounded-full
              bg-blue-600
              text-2xl
              font-bold
              leading-none
              text-white
            "
            aria-label="الصورة الشخصية الافتراضية"
          >
            ?
          </div>
        ) : (
          <img
            src={avatarUrl}
            alt={displayName}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
            "
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* User Info */}

      <div className="min-w-0 flex-1">
        <div
          className="
            truncate
            font-semibold
            text-foreground
          "
          title={displayName}
        >
          {displayName}
        </div>

        {username && (
          <div
            className="
              truncate
              text-sm
              text-muted-foreground
            "
            title={`@${username}`}
          >
            @{username}
          </div>
        )}

        {user.bio?.trim() && (
          <p
            className="
              mt-1
              line-clamp-2
              text-sm
              text-muted-foreground
            "
          >
            {user.bio.trim()}
          </p>
        )}
      </div>

      {/* Action */}

      {children && (
        <div className="shrink-0">
          {children}
        </div>
      )}
    </article>
  );
}
