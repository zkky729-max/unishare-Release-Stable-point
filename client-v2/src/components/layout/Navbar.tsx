
import {
  Bell,
  MessageCircle,
  Search,
  UserPlus,
  X,
  Menu,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import UniShareLogo from "../brand/UniShareLogo";

import {
  getFriendRequests,
} from "../../features/friends/api/getFriendRequests";

import {
  getConversations,
} from "../../features/messages/api/getConversations";

import {
  searchUsers,
} from "../../features/messages/api/searchUsers";

import type {
  UserSearchResult,
} from "../../features/messages/types/message";

interface NotificationData {
  friendRequestsCount: number;
  unreadMessagesCount: number;
}

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
  const navigate = useNavigate();

  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

  const [searchQuery, setSearchQuery] = useState("");

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
            Number(conversation.unread_count ?? 0),
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
  // CLOSE MENUS WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // MAIN SEARCH
  // =====================================================

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

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
            await searchUsers(normalizedQuery);

          if (cancelled) return;

          setSearchResults(results);
        } catch (error) {
          if (cancelled) return;

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
  // HANDLERS
  // =====================================================

  function closeNotifications() {
    setShowNotifications(false);
  }

  function handleFriendRequests() {
    closeNotifications();
    navigate("/friends");
  }

  function handleMessages() {
    closeNotifications();
    navigate("/messages");
  }

  function handleUserProfile(userId: string) {
    if (!userId) return;

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
        sticky top-0 z-40
        flex min-h-[76px]
        items-center justify-between
        gap-3
        border-b border-[var(--unishare-border)]
        bg-white/95
        px-3 py-3
        shadow-sm
        backdrop-blur-xl
        sm:gap-5 sm:px-6
      "
    >
      {/* MOBILE MENU */}

      <button
        type="button"
        onClick={() => onMenuClick?.()}
        aria-label="فتح القائمة"
        className="
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-xl
          border border-[var(--unishare-border)]
          bg-white
          text-[var(--unishare-text)]
          transition-all duration-200
          hover:border-blue-200
          hover:bg-blue-50
          hover:text-blue-600
          focus-visible:ring-4
          focus-visible:ring-blue-500/15
          lg:hidden
        "
      >
        <Menu size={23} strokeWidth={2} />
      </button>

      {/* MOBILE LOGO */}

      <div className="shrink-0 lg:hidden">
        <UniShareLogo
          showText={false}
          compact
        />
      </div>

      {/* SEARCH */}

      <div
        ref={searchRef}
        className="
          relative min-w-0 flex-1
          lg:max-w-xl
        "
      >
        <Search
          size={20}
          strokeWidth={2}
          className="
            pointer-events-none
            absolute right-4 top-1/2 z-10
            -translate-y-1/2
            text-[var(--unishare-muted)]
          "
        />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
          onFocus={() => {
            if (searchQuery.trim().length >= 2) {
              setShowSearchResults(true);
            }
          }}
          placeholder="ابحث في المنصة..."
          aria-label="البحث في المنصة"
          className="
            h-12 w-full
            rounded-2xl
            border border-[var(--unishare-border)]
            bg-slate-50
            pr-12 pl-4
            text-base
            font-medium
            text-[var(--unishare-text)]
            outline-none
            transition-all duration-200
            placeholder:text-slate-400
            focus:border-[var(--unishare-blue)]
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
          "
        />

        {/* SEARCH RESULTS */}

        {showSearchResults &&
          searchQuery.trim().length >= 2 && (
            <div
              className="
                absolute right-0 top-[calc(100%+10px)]
                z-50 w-full
                overflow-hidden
                rounded-2xl
                border border-[var(--unishare-border)]
                bg-white
                shadow-xl
              "
            >
              {searchLoading && (
                <div className="flex items-center justify-center gap-2 px-4 py-7 text-base text-slate-500">
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  جاري البحث...
                </div>
              )}

              {!searchLoading &&
                searchResults.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <Search className="mx-auto mb-3 h-8 w-8 text-slate-300" />

                    <p className="text-base font-bold text-slate-700">
                      لا توجد نتائج
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      جرّب اسمًا أو اسم مستخدم آخر.
                    </p>
                  </div>
                )}

              {!searchLoading &&
                searchResults.length > 0 && (
                  <div className="max-h-[380px] overflow-y-auto p-2">
                    {searchResults.map((user) => (
                      <button
                        key={user.userId}
                        type="button"
                        onClick={() =>
                          handleUserProfile(user.userId)
                        }
                        className="
                          flex w-full items-center gap-3
                          rounded-xl p-3
                          text-right
                          transition-colors
                          hover:bg-blue-50
                          focus-visible:bg-blue-50
                        "
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={
                              user.fullName ??
                              user.username ??
                              "المستخدم"
                            }
                            className="
                              h-11 w-11 shrink-0
                              rounded-full
                              border border-slate-100
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex h-11 w-11 shrink-0
                              items-center justify-center
                              rounded-full
                              bg-blue-100
                              text-base font-bold
                              text-blue-700
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

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold text-slate-800">
                            {user.fullName ||
                              user.username ||
                              "مستخدم"}
                          </p>

                          {user.username && (
                            <p className="mt-0.5 truncate text-sm text-slate-500">
                              @{user.username}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}
      </div>

      {/* ACTIONS */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        {/* NOTIFICATIONS */}

        <div
          ref={notificationsRef}
          className="relative"
        >
          <button
            type="button"
            aria-label="الإشعارات"
            aria-expanded={showNotifications}
            onClick={() =>
              setShowNotifications((current) => !current)
            }
            className="
              relative flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-[var(--unishare-border)]
              bg-white
              text-[var(--unishare-muted)]
              transition-all duration-200
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-[var(--unishare-blue)]
              focus-visible:ring-4
              focus-visible:ring-blue-500/10
            "
          >
            {loadingNotifications &&
            totalNotifications === 0 ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <Bell size={21} strokeWidth={2} />
            )}

            {totalNotifications > 0 && (
              <span
                className="
                  absolute -right-1 -top-1
                  flex min-h-5 min-w-5
                  items-center justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[11px] font-bold
                  text-white
                  ring-2 ring-white
                "
              >
                {totalNotifications > 99
                  ? "99+"
                  : totalNotifications}
              </span>
            )}
          </button>

          {/* NOTIFICATIONS PANEL */}

          {showNotifications && (
            <div
              className="
                absolute left-0 top-[calc(100%+10px)]
                z-50
                w-[350px]
                max-w-[calc(100vw-1.5rem)]
                overflow-hidden
                rounded-2xl
                border border-[var(--unishare-border)]
                bg-white
                shadow-xl
              "
            >
              <div
                className="
                  flex items-center justify-between
                  border-b border-slate-100
                  px-4 py-4
                "
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    الإشعارات
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    آخر التحديثات
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeNotifications}
                  aria-label="إغلاق"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-xl
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-1 p-2">

                {loadingNotifications &&
                  totalNotifications === 0 && (
                    <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      جاري تحميل الإشعارات...
                    </div>
                  )}

                {!loadingNotifications &&
                  totalNotifications === 0 && (
                    <div className="px-4 py-8 text-center">
                      <Bell className="mx-auto mb-3 h-10 w-10 text-slate-300" />

                      <p className="text-base font-bold text-slate-700">
                        لا توجد إشعارات جديدة
                      </p>

                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        سنخبرك عند وصول طلب صداقة أو رسالة جديدة.
                      </p>
                    </div>
                  )}

                {notifications.friendRequestsCount > 0 && (
                  <button
                    type="button"
                    onClick={handleFriendRequests}
                    className="
                      flex w-full items-center gap-3
                      rounded-xl p-3
                      text-right
                      transition-colors
                      hover:bg-blue-50
                    "
                  >
                    <div
                      className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-blue-50 text-blue-600
                      "
                    >
                      <UserPlus size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-slate-800">
                        طلبات صداقة جديدة
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        لديك {notifications.friendRequestsCount} طلب صداقة بانتظارك
                      </p>
                    </div>

                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-600 px-2 text-sm font-bold text-white">
                      {notifications.friendRequestsCount}
                    </span>
                  </button>
                )}

                {notifications.unreadMessagesCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMessages}
                    className="
                      flex w-full items-center gap-3
                      rounded-xl p-3
                      text-right
                      transition-colors
                      hover:bg-purple-50
                    "
                  >
                    <div
                      className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-purple-50 text-purple-600
                      "
                    >
                      <MessageCircle size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-slate-800">
                        رسائل غير مقروءة
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        لديك {notifications.unreadMessagesCount} رسالة غير مقروءة
                      </p>
                    </div>

                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-purple-600 px-2 text-sm font-bold text-white">
                      {notifications.unreadMessagesCount}
                    </span>
                  </button>
                )}
              </div>

              {totalNotifications > 0 && (
                <div className="border-t border-slate-100 px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      void loadNotifications();
                    }}
                    className="
                      text-sm font-bold
                      text-blue-600
                      transition
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

        {/* ROLE */}

        <div
          className="
            hidden sm:flex
            items-center
            rounded-xl
            border border-blue-100
            bg-blue-50
            px-4 py-2
            text-sm font-bold
            text-[var(--unishare-blue)]
          "
        >
          طالب
        </div>
      </div>
    </header>
  );
}
