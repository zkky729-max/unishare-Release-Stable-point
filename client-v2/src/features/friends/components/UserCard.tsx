
import { useState } from "react";

import {
  UserRound,
} from "lucide-react";

import type {
  UserSearchResult,
} from "../api/searchUsers";

interface UserCardProps {
  user: UserSearchResult;
  children?: React.ReactNode;
}

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
        group relative overflow-hidden
        rounded-2xl border border-gray-200/80
        bg-white p-4 shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-blue-200
        hover:shadow-md hover:shadow-blue-900/5
        sm:p-5
      "
    >
      {/* Decorative accent */}

      <div
        className="
          absolute right-0 top-0
          h-full w-1
          bg-gradient-to-b from-blue-500
          via-indigo-500 to-blue-400
          opacity-0 transition-opacity
          group-hover:opacity-100
        "
      />

      <div className="
        flex items-center gap-3 sm:gap-4
      ">

        {/* Avatar */}

        <div className="
          relative h-14 w-14 shrink-0
          rounded-2xl bg-blue-50 p-0.5
          ring-1 ring-gray-100
          sm:h-16 sm:w-16
        ">
          <div className="
            h-full w-full overflow-hidden
            rounded-[14px] bg-gray-100
          ">
            {showDefaultAvatar ? (
              <div
                className="
                  flex h-full w-full
                  items-center justify-center
                  bg-gradient-to-br
                  from-blue-500 to-indigo-600
                  text-3xl font-bold text-white
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
                  h-full w-full object-cover
                  transition-transform duration-300
                  group-hover:scale-105
                "
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <span className="
            absolute -bottom-1 -left-1
            flex h-5 w-5 items-center
            justify-center rounded-full
            border-2 border-white
            bg-blue-600 text-white
          ">
            <UserRound size={10} />
          </span>
        </div>

        {/* User Information */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="
                truncate text-sm font-bold
                text-gray-900 sm:text-base
              "
              title={displayName}
            >
              {displayName}
            </h3>
          </div>

          {username && (
            <p
              className="
                mt-1 truncate text-xs
                font-medium text-blue-600
                sm:text-sm
              "
              title={`@${username}`}
            >
              @{username}
            </p>
          )}

          {user.bio?.trim() ? (
            <p className="
              mt-2 line-clamp-2
              text-xs leading-5
              text-gray-500 sm:text-sm
            ">
              {user.bio.trim()}
            </p>
          ) : (
            <p className="
              mt-2 text-xs text-gray-400
            ">
              عضو في مجتمع UniShare
            </p>
          )}

        </div>

        {/* Friend Action */}

        {children && (
          <div className="
            shrink-0 border-r border-gray-100
            pr-3 sm:pr-4
          ">
            {children}
          </div>
        )}

      </div>

      {/* Bottom accent */}

      <div className="
        pointer-events-none absolute
        bottom-0 left-0 right-0
        h-px bg-gradient-to-l
        from-transparent via-blue-100
        to-transparent opacity-0
        transition-opacity group-hover:opacity-100
      " />

    </article>
  );
}
