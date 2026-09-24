import {
  Bell,
  MessageCircle,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UniShareLogo from "../brand/UniShareLogo";

import { getFriendRequests } from "../../features/friends/api/getFriendRequests";
import { getConversations } from "../../features/messages/api/getConversations";
import { searchUsers } from "../../features/messages/api/searchUsers";

import type { UserSearchResult } from "../../features/messages/types/message";

interface NotificationData {
  friendRequestsCount: number;
  unreadMessagesCount: number;
}

export default function Navbar() {
  const navigate = useNavigate();

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] =
    useState<NotificationData>({
      friendRequestsCount: 0,
      unreadMessagesCount: 0,
    });

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  // =====================================================
  // MAIN SEARCH
  // =====================================================

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchResults, setSearchResults] =
    useState<UserSearchResult[]>([]);

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const [searchLoading, setSearchLoading] =
    useState(false);

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  async function loadNotifications() {
    try {
      setLoadingNotifications(true);

      const [friendRequests, conversations] =
        await Promise.all([
          getFriendRequests(),
          getConversations(),
        ]);

      const friendRequestsCount =
        friendRequests.incoming.length;

      const unreadMessagesCount =
        conversations.reduce(
          (total, conversation) =>
            total +
            Number(
              conversation.unread_count ?? 0
            ),
          0
        );

      setNotifications({
        friendRequestsCount,
        unreadMessagesCount,
      });
    } catch (error) {
      console.error(
        "Error loading notifications:",
        error
      );
    } finally {
      setLoadingNotifications(false);
    }
  }

  // =====================================================
  // NOTIFICATIONS AUTO REFRESH
  // =====================================================

  useEffect(() => {
    void loadNotifications();

    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  // =====================================================
  // MAIN SEARCH
  // =====================================================

  useEffect(() => {
    const normalizedQuery =
      searchQuery.trim();

    if (normalizedQuery.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;

    const timeout = window.setTimeout(
      async () => {
        try {
          setSearchLoading(true);
          setShowSearchResults(true);

          const results =
            await searchUsers(
              normalizedQuery
            );

          if (cancelled) {
            return;
          }

          setSearchResults(results);
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            "Error searching users:",
            error
          );

          setSearchResults([]);
        } finally {
          if (!cancelled) {
            setSearchLoading(false);
          }
        }
      },
      350
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [searchQuery]);

  // =====================================================
  // TOTAL NOTIFICATIONS
  // =====================================================

  const totalNotifications =
    notifications.friendRequestsCount +
    notifications.unreadMessagesCount;

  // =====================================================
  // CLOSE NOTIFICATIONS
  // =====================================================

  function closeNotifications() {
    setShowNotifications(false);
  }

  // =====================================================
  // FRIEND REQUESTS
  // =====================================================

  function handleFriendRequests() {
    closeNotifications();
    navigate("/friends");
  }

  // =====================================================
  // MESSAGES
  // =====================================================

  function handleMessages() {
    closeNotifications();
    navigate("/messages");
  }

  // =====================================================
  // OPEN SEARCHED USER PROFILE
  // =====================================================

  function handleUserProfile(
    userId: string
  ) {
    if (!userId) {
      return;
    }

    console.log(
      "SEARCH RESULT USER ID:",
      userId
    );

    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);

    navigate(`/profile/${userId}`);
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header
      dir="rtl"
      className="
        sticky
        top-0
        z-40
        flex
        min-h-[76px]
        items-center
        justify-between
        gap-4
        border-b
        border-[var(--unishare-border)]
        bg-white/90
        px-4
        py-3
        backdrop-blur-xl
        sm:px-6
      "
    >
      {/* =====================================================
          MOBILE LOGO
      ===================================================== */}

      <div className="lg:hidden">
        <UniShareLogo
          showText={false}
          compact
        />
      </div>

      {/* =====================================================
          MAIN SEARCH
      ===================================================== */}

      <div
        className="
          relative
          w-full
          max-w-xl
        "
      >
        <Search
          size={19}
          strokeWidth={2}
          className="
            pointer-events-none
            absolute
            right-3.5
            top-1/2
            z-10
            -translate-y-1/2
            text-[var(--unishare-muted)]
          "
        />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(
              event.target.value
            );
          }}
          onFocus={() => {
            if (
              searchQuery.trim().length >= 2
            ) {
              setShowSearchResults(true);
            }
          }}
          placeholder="ابحث في المنصة..."
          className="
            h-11
            w-full
            rounded-xl
            border
            border-[var(--unishare-border)]
            bg-[var(--unishare-background)]
            pr-11
            pl-4
            text-sm
            text-[var(--unishare-text)]
            outline-none
            transition-all
            placeholder:text-slate-400
            focus:border-[var(--unishare-blue)]
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
          "
        />

        {/* ===================================================
            SEARCH RESULTS
        =================================================== */}

        {showSearchResults &&
          searchQuery.trim().length >= 2 && (
            <div
              className="
                absolute
                right-0
                top-14
                z-50
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-xl
              "
            >
              {searchLoading && (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  جاري البحث...
                </div>
              )}

              {!searchLoading &&
                searchResults.length === 0 && (
                  <div className="px-4 py-7 text-center">
                    <Search className="mx-auto mb-2 h-7 w-7 text-gray-300" />

                    <p className="text-sm font-semibold text-gray-700">
                      لا توجد نتائج
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      جرّب اسمًا أو اسم مستخدم آخر.
                    </p>
                  </div>
                )}

              {!searchLoading &&
                searchResults.length > 0 && (
                  <div className="max-h-[360px] overflow-y-auto p-2">
                    {searchResults.map(
                      (user) => (
                        <button
                          key={user.userId}
                          type="button"
                          onClick={() =>
                            handleUserProfile(
                              user.userId
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            p-3
                            text-right
                            transition
                            hover:bg-blue-50
                          "
                        >
                          {/* Avatar */}

                          {user.avatarUrl ? (
                            <img
                              src={
                                user.avatarUrl
                              }
                              alt={
                                user.fullName ??
                                user.username ??
                                "المستخدم"
                              }
                              className="
                                h-10
                                w-10
                                shrink-0
                                rounded-full
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-100
                                text-sm
                                font-bold
                                text-blue-600
                              "
                            >
                              {(
                                user.fullName ??
                                user.username ??
                                "U"
                              )
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          {/* User Info */}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-gray-800">
                              {user.fullName ||
                                user.username ||
                                "مستخدم"}
                            </p>

                            {user.username && (
                              <p className="mt-0.5 truncate text-xs text-gray-500">
                                @{user.username}
                              </p>
                            )}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>
          )}
      </div>

      {/* =====================================================
          RIGHT ACTIONS
      ===================================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-2
          sm:gap-4
        "
      >
        {/* ===================================================
            NOTIFICATIONS BUTTON
        =================================================== */}

        <div className="relative">
          <button
            type="button"
            aria-label="الإشعارات"
            onClick={() =>
              setShowNotifications(
                (current) => !current
              )
            }
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-[var(--unishare-border)]
              bg-white
              text-[var(--unishare-muted)]
              transition-all
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-[var(--unishare-blue)]
              focus:outline-none
              focus:ring-4
              focus:ring-blue-500/10
            "
          >
            <Bell
              size={20}
              strokeWidth={2}
            />

            {totalNotifications > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  min-h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                  ring-2
                  ring-white
                "
              >
                {totalNotifications > 99
                  ? "99+"
                  : totalNotifications}
              </span>
            )}
          </button>

          {/* =================================================
              NOTIFICATIONS PANEL
          ================================================= */}

          {showNotifications && (
            <div
              className="
                absolute
                left-0
                top-14
                z-50
                w-[340px]
                max-w-[calc(100vw-2rem)]
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-xl
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-100
                  px-4
                  py-3
                "
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    الإشعارات
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    آخر التحديثات
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeNotifications
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                  aria-label="إغلاق"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="p-2">
                {loadingNotifications &&
                  totalNotifications === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      جاري تحميل الإشعارات...
                    </div>
                  )}

                {!loadingNotifications &&
                  totalNotifications === 0 && (
                    <div className="px-4 py-8 text-center">
                      <Bell className="mx-auto mb-3 h-9 w-9 text-gray-300" />

                      <p className="text-sm font-semibold text-gray-700">
                        لا توجد إشعارات جديدة
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        سنخبرك عند وصول طلب صداقة أو رسالة جديدة.
                      </p>
                    </div>
                  )}

                {notifications.friendRequestsCount >
                  0 && (
                    <button
                      type="button"
                      onClick={
                        handleFriendRequests
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        p-3
                        text-right
                        transition
                        hover:bg-blue-50
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-50
                          text-blue-600
                        "
                      >
                        <UserPlus size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-800">
                          طلبات صداقة جديدة
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          لديك{" "}
                          {
                            notifications.friendRequestsCount
                          }{" "}
                          طلب صداقة بانتظارك
                        </p>
                      </div>

                      <span
                        className="
                          flex
                          h-6
                          min-w-6
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-600
                          px-1.5
                          text-xs
                          font-bold
                          text-white
                        "
                      >
                        {
                          notifications.friendRequestsCount
                        }
                      </span>
                    </button>
                  )}

                {notifications.unreadMessagesCount >
                  0 && (
                    <button
                      type="button"
                      onClick={
                        handleMessages
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        p-3
                        text-right
                        transition
                        hover:bg-purple-50
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-purple-50
                          text-purple-600
                        "
                      >
                        <MessageCircle size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-800">
                          رسائل غير مقروءة
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          لديك{" "}
                          {
                            notifications.unreadMessagesCount
                          }{" "}
                          رسالة غير مقروءة
                        </p>
                      </div>

                      <span
                        className="
                          flex
                          h-6
                          min-w-6
                          items-center
                          justify-center
                          rounded-full
                          bg-purple-600
                          px-1.5
                          text-xs
                          font-bold
                          text-white
                        "
                      >
                        {
                          notifications.unreadMessagesCount
                        }
                      </span>
                    </button>
                  )}
              </div>

              {totalNotifications > 0 && (
                <div
                  className="
                    border-t
                    border-gray-100
                    px-4
                    py-2.5
                    text-center
                  "
                >
                  <button
                    type="button"
                    onClick={() => {
                      void loadNotifications();
                    }}
                    className="
                      text-xs
                      font-semibold
                      text-blue-600
                      hover:text-blue-700
                    "
                  >
                    تحديث الإشعارات
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================================
            ROLE
        =================================================== */}

        <div
          className="
            hidden
            items-center
            rounded-xl
            border
            border-blue-100
            bg-blue-50
            px-4
            py-2
            text-sm
            font-bold
            text-[var(--unishare-blue)]
            sm:flex
          "
        >
          طالب
        </div>
      </div>
    </header>
  );
}