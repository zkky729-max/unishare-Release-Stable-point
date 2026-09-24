import { useEffect, useState } from "react";

import {
  MessageCircle,
  RefreshCw,
  UserCheck,
  UserRound,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getFriends,
  type Friend,
} from "../api/getFriends";

import { createConversation } from "../../messages/api/createConversation";

import FriendRequests from "../components/FriendRequests";

export default function FriendsPage() {
  const navigate = useNavigate();

  const [friends, setFriends] =
    useState<Friend[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [openingConversationUserId, setOpeningConversationUserId] =
    useState<string | null>(null);

  // =====================================================
  // Load Friends
  // =====================================================

  const loadFriends = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getFriends();

      console.log(
        "FRIENDS PAGE - FRIENDS:",
        data
      );

      setFriends(data);
    } catch (err) {
      console.error(
        "Failed to load friends:",
        err
      );

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
  // Initial Load
  // =====================================================

  useEffect(() => {
    void loadFriends();
  }, []);

  // =====================================================
  // Open Conversation
  // =====================================================

  const handleMessageFriend = async (
    friend: Friend
  ) => {
    if (
      openingConversationUserId ||
      !friend.userId
    ) {
      return;
    }

    try {
      setError("");

      setOpeningConversationUserId(
        friend.userId
      );

      const conversationId =
        await createConversation(
          friend.userId
        );

      navigate(
        `/messages/${conversationId}`
      );
    } catch (err) {
      console.error(
        "Failed to open conversation:",
        err
      );

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
      className="
        min-h-screen
        bg-background
        px-4
        py-5
        sm:px-6
        sm:py-7
        lg:px-8
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* ================================================= */}
        {/* Hero Header */}
        {/* ================================================= */}

        <section
          className="
            relative
            mb-6
            overflow-hidden
            rounded-3xl
            border
            bg-card
            p-5
            shadow-sm
            sm:p-6
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-primary/5
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              right-10
              h-52
              w-52
              rounded-full
              bg-primary/5
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Title */}

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  ring-1
                  ring-primary/10
                "
              >
                <Users
                  size={26}
                  className="text-primary"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      sm:text-3xl
                    "
                  >
                    الأصدقاء
                  </h1>

                  {!loading && (
                    <span
                      className="
                        rounded-full
                        bg-muted
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-muted-foreground
                      "
                    >
                      {friends.length}
                    </span>
                  )}
                </div>

                <p
                  className="
                    mt-1.5
                    text-sm
                    leading-6
                    text-muted-foreground
                  "
                >
                  تواصل مع زملائك وأصدقائك في UniShare.
                </p>
              </div>
            </div>

            {/* Refresh */}

            <button
              type="button"
              onClick={() => {
                void loadFriends();
              }}
              disabled={loading}
              aria-label="تحديث قائمة الأصدقاء"
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                bg-background
                px-4
                text-sm
                font-medium
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:bg-muted
                hover:shadow
                active:translate-y-0
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              تحديث
            </button>
          </div>

          {/* ================================================= */}
          {/* Stats */}
          {/* ================================================= */}

          <div
            className="
              relative
              mt-6
              grid
              grid-cols-2
              gap-3
              border-t
              pt-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                bg-muted/50
                px-4
                py-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-background
                  shadow-sm
                "
              >
                <UserCheck
                  size={18}
                  className="text-primary"
                />
              </div>

              <div>
                <p className="text-lg font-bold leading-none">
                  {loading ? "—" : friends.length}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-muted-foreground
                  "
                >
                  الأصدقاء
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                bg-muted/50
                px-4
                py-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-background
                  shadow-sm
                "
              >
                <Users
                  size={18}
                  className="text-muted-foreground"
                />
              </div>

              <div>
                <p className="text-lg font-bold leading-none">
                  UniShare
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-muted-foreground
                  "
                >
                  مجتمعك الأكاديمي
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* Error */}
        {/* ================================================= */}

        {error && (
          <div
            role="alert"
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-destructive/20
              bg-destructive/5
              p-4
              text-sm
              text-destructive
            "
          >
            <div
              className="
                mt-1
                h-2
                w-2
                shrink-0
                rounded-full
                bg-destructive
              "
            />

            <div className="min-w-0">
              <p className="font-semibold">
                حدث خطأ
              </p>

              <p className="mt-1 leading-5 opacity-90">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* Friends — Main Section */}
        {/* ================================================= */}

        <section
          className="
            mb-6
            overflow-hidden
            rounded-3xl
            border
            bg-card
            shadow-sm
          "
        >
          {/* Section Header */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              px-5
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-6
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="
                    text-lg
                    font-bold
                    tracking-tight
                  "
                >
                  قائمة الأصدقاء
                </h2>

                {!loading && (
                  <span
                    className="
                      rounded-full
                      bg-primary/10
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-primary
                    "
                  >
                    {friends.length}
                  </span>
                )}
              </div>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                الأشخاص الذين تتواصل معهم في UniShare
              </p>
            </div>

            <div
              className="
                hidden
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-muted
                sm:flex
              "
            >
              <Users
                size={19}
                className="text-muted-foreground"
              />
            </div>
          </div>

          {/* ================================================= */}
          {/* Loading */}
          {/* ================================================= */}

          {loading ? (

            <div
              className="
                px-5
                py-16
                text-center
                sm:px-6
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-muted
                "
              >
                <RefreshCw
                  size={24}
                  className="
                    animate-spin
                    text-muted-foreground
                  "
                />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                "
              >
                جاري تحميل الأصدقاء...
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted-foreground
                "
              >
                لحظات فقط
              </p>
            </div>

          ) : friends.length === 0 ? (

            /* ================================================= */
            /* Empty State */
            /* ================================================= */

            <div
              className="
                px-5
                py-16
                text-center
                sm:px-6
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-muted
                  ring-1
                  ring-border
                "
              >
                <Users
                  size={28}
                  className="text-muted-foreground"
                />
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-bold
                "
              >
                ابدأ ببناء شبكتك
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                لا توجد لديك صداقات بعد.
                عندما تصبح لديك علاقة صداقة مع
                أحد المستخدمين، سيظهر هنا.
              </p>

              <div
                className="
                  mx-auto
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  bg-muted/40
                  px-3
                  py-1.5
                  text-xs
                  text-muted-foreground
                "
              >
                <UserCheck size={14} />

                ابنِ مجتمعك الأكاديمي
              </div>
            </div>

          ) : (

            /* ================================================= */
            /* Friends Grid */
            /* ================================================= */

            <div
              className="
                grid
                grid-cols-1
                divide-y
                sm:grid-cols-2
                sm:divide-x
                sm:divide-y-0
                lg:grid-cols-3
              "
            >
              {friends.map((friend) => {

                const displayName =
                  friend.fullName?.trim() ||
                  friend.username?.trim() ||
                  "مستخدم";

                const isOpening =
                  openingConversationUserId ===
                  friend.userId;

                return (
                  <div
                    key={friend.friendshipId}
                    className="
                      group
                      flex
                      min-w-0
                      flex-col
                      gap-4
                      p-5
                      transition-all
                      hover:bg-muted/40
                      sm:p-6
                    "
                  >
                    {/* User */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                      "
                    >
                      {/* Avatar */}

                      <div
                        className="
                          relative
                          shrink-0
                        "
                      >
                        <div
                          className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-2xl
                            bg-muted
                            ring-1
                            ring-border
                            transition-all
                            duration-200
                            group-hover:ring-primary/30
                            group-hover:shadow-md
                            sm:h-16
                            sm:w-16
                          "
                        >
                          {friend.avatarUrl ? (
                            <img
                              src={friend.avatarUrl}
                              alt={displayName}
                              loading="lazy"
                              className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-300
                                group-hover:scale-105
                              "
                            />
                          ) : (
                            <UserRound
                              size={26}
                              className="
                                text-muted-foreground
                              "
                            />
                          )}
                        </div>

                        {/* Friend Badge */}

                        <span
                          className="
                            absolute
                            -bottom-1
                            -left-1
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-card
                            bg-primary
                          "
                          aria-hidden="true"
                        >
                          <UserCheck
                            size={10}
                            className="
                              text-primary-foreground
                            "
                          />
                        </span>
                      </div>

                      {/* Info */}

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            truncate
                            text-sm
                            font-bold
                            transition-colors
                            group-hover:text-primary
                          "
                        >
                          {displayName}
                        </p>

                        {friend.username ? (
                          <p
                            className="
                              mt-1
                              truncate
                              text-xs
                              text-muted-foreground
                            "
                          >
                            @{friend.username}
                          </p>
                        ) : (
                          <p
                            className="
                              mt-1
                              text-xs
                              text-muted-foreground
                            "
                          >
                            عضو في UniShare
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message Button */}

                    <button
                      type="button"
                      onClick={() => {
                        void handleMessageFriend(
                          friend
                        );
                      }}
                      disabled={
                        openingConversationUserId !==
                          null
                      }
                      className="
                        inline-flex
                        h-10
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-primary
                        px-4
                        text-sm
                        font-semibold
                        text-primary-foreground
                        shadow-sm
                        transition-all
                        hover:-translate-y-0.5
                        hover:shadow-md
                        active:translate-y-0
                        disabled:pointer-events-none
                        disabled:opacity-60
                      "
                    >
                      {isOpening ? (
                        <>
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />

                          جاري فتح المحادثة...
                        </>
                      ) : (
                        <>
                          <MessageCircle
                            size={16}
                          />

                          مراسلة
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* Friend Requests */}
        {/* ================================================= */}

        <section
          className="
            overflow-hidden
            rounded-3xl
          "
        >
          <FriendRequests />
        </section>

        {/* ================================================= */}
        {/* Footer */}
        {/* ================================================= */}

        {!loading && friends.length > 0 && (
          <p
            className="
              mt-5
              text-center
              text-xs
              text-muted-foreground
            "
          >
            أصدقاؤك جزء من مجتمعك الأكاديمي في UniShare.
          </p>
        )}

      </div>
    </div>
  );
}