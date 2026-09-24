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
//
// بطاقة عرض مستخدم من نتائج البحث العام.
//
// مسؤوليتها:
// - عرض الصورة
// - عرض الاسم
// - عرض username
// - عرض bio
//
// لا تحتوي على منطق الصداقة.
// يمكن تمرير FriendAction عبر children.
// =====================================================

export default function UserCard({
  user,
  children,
}: UserCardProps) {
  // ---------------------------------------------------
  // الاسم المعروض
  // ---------------------------------------------------

  const displayName =
    user.fullName?.trim() ||
    user.username?.trim() ||
    "مستخدم UniShare";

  // ---------------------------------------------------
  // username
  // ---------------------------------------------------

  const username =
    user.username?.trim() || null;

  // ---------------------------------------------------
  // الأحرف الأولى عند عدم وجود صورة
  // ---------------------------------------------------

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .toUpperCase() || "U";

  // ---------------------------------------------------
  // Render
  // ---------------------------------------------------

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
      {/* =================================================
          AVATAR
      ================================================= */}

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
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              text-sm
              font-semibold
              text-muted-foreground
            "
          >
            {initials}
          </div>
        )}
      </div>

      {/* =================================================
          USER INFO
      ================================================= */}

      <div
        className="
          min-w-0
          flex-1
        "
      >
        {/* -------------------------------------------------
            FULL NAME
        ------------------------------------------------- */}

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

        {/* -------------------------------------------------
            USERNAME
        ------------------------------------------------- */}

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

        {/* -------------------------------------------------
            BIO
        ------------------------------------------------- */}

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

      {/* =================================================
          ACTION
      ================================================= */}

      {children && (
        <div
          className="
            shrink-0
          "
        >
          {children}
        </div>
      )}
    </article>
  );
}