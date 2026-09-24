import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Loader2,
  MessageCircle,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { searchUsers } from "../api/searchUsers";
import { createConversation } from "../api/createConversation";

import type { UserSearchResult } from "../types/message";

interface NewConversationDialogProps {
  open: boolean;
  onClose: () => void;
  onConversationCreated: (
    conversationId: string
  ) => void;
}

export default function NewConversationDialog({
  open,
  onClose,
  onConversationCreated,
}: NewConversationDialogProps) {
  const [query, setQuery] = useState("");

  const [users, setUsers] =
    useState<UserSearchResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [creatingUserId, setCreatingUserId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  // =====================================================
  // RESET
  // =====================================================

  useEffect(() => {
    if (!open) {
      setQuery("");
      setUsers([]);
      setLoading(false);
      setCreatingUserId(null);
      setError("");
    }
  }, [open]);

  // =====================================================
  // SEARCH
  // =====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const normalizedQuery =
      query.trim();

    if (normalizedQuery.length < 2) {
      setUsers([]);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    const timeoutId =
      window.setTimeout(async () => {
        try {
          setLoading(true);
          setError("");

          const results =
            await searchUsers(
              normalizedQuery
            );

          if (cancelled) {
            return;
          }

          console.log(
            "Search users result:",
            results
          );

          setUsers(results);
        } catch (err) {
          if (cancelled) {
            return;
          }

          console.error(
            "Search users error:",
            err
          );

          setUsers([]);

          setError(
            err instanceof Error
              ? err.message
              : "فشل البحث عن المستخدمين"
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query, open]);

  // =====================================================
  // SELECT USER
  // =====================================================

  const handleSelectUser = async (
    user: UserSearchResult
  ) => {
    console.log(
      "USER CLICKED:",
      user
    );

    if (creatingUserId !== null) {
      return;
    }

    if (!user.userId) {
      setError(
        "تعذر تحديد المستخدم"
      );

      return;
    }

    try {
      setCreatingUserId(
        user.userId
      );

      setError("");

      const conversationId =
        await createConversation(
          user.userId
        );

      console.log(
        "Conversation created:",
        conversationId
      );

      if (!conversationId) {
        throw new Error(
          "لم يتم إرجاع معرف المحادثة"
        );
      }

      onConversationCreated(
        conversationId
      );

      onClose();
    } catch (err) {
      console.error(
        "Create conversation error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل إنشاء المحادثة"
      );
    } finally {
      setCreatingUserId(null);
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (creatingUserId !== null) {
      return;
    }

    onClose();
  };

  // =====================================================
  // NOT OPEN
  // =====================================================

  if (!open) {
    return null;
  }

  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  const normalizedQuery =
    query.trim();

  // =====================================================
  // DIALOG
  // =====================================================

  const dialog = (
    <div
      className="
        fixed
        inset-0
        z-[2147483647]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
      style={{
        pointerEvents: "auto",
      }}
      onPointerDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >

      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-conversation-title"
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-lg
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          text-gray-900
          shadow-2xl
        "
        style={{
          pointerEvents: "auto",
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            p-5
          "
        >

          <div>

            <h2
              id="new-conversation-title"
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              محادثة جديدة
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              ابحث عن زميل لبدء محادثة
            </p>

          </div>


          {/* Close */}

          <button
            type="button"
            onClick={handleClose}
            disabled={
              creatingUserId !== null
            }
            aria-label="إغلاق"
            className="
              flex
              h-9
              w-9
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>

        </div>


        {/* ================================================= */}
        {/* SEARCH */}
        {/* ================================================= */}

        <div
          className="
            shrink-0
            bg-white
            p-4
          "
        >

          <div className="relative">

            <Search
              size={18}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(
                  event.target.value
                );

                setError("");
              }}
              placeholder="ابحث بالاسم أو اسم المستخدم..."
              autoFocus
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                py-3
                pl-4
                pr-10
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
              "
            />

          </div>

        </div>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div
            className="
              mx-4
              mb-4
              rounded-xl
              border
              border-red-200
              bg-red-50
              p-3
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}


        {/* ================================================= */}
        {/* RESULTS */}
        {/* ================================================= */}

        <div
          className="
            min-h-0
            overflow-y-auto
            border-t
            border-gray-200
            bg-white
          "
        >

          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading ? (

            <div
              className="
                flex
                flex-col
                items-center
                p-10
              "
            >

              <Loader2
                size={28}
                className="
                  animate-spin
                  text-blue-600
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  text-gray-500
                "
              >
                جاري البحث...
              </p>

            </div>

          ) : normalizedQuery.length < 2 ? (

            /* ================================================= */
            /* EMPTY SEARCH */
            /* ================================================= */

            <div
              className="
                flex
                flex-col
                items-center
                p-10
                text-center
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                "
              >

                <Search
                  size={22}
                  className="text-gray-500"
                />

              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                ابحث عن مستخدم
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                اكتب حرفين على الأقل للبحث
              </p>

            </div>

          ) : users.length === 0 ? (

            /* ================================================= */
            /* NO USERS */
            /* ================================================= */

            <div
              className="
                flex
                flex-col
                items-center
                p-10
                text-center
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                "
              >

                <UserRound
                  size={22}
                  className="text-gray-500"
                />

              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                لم يتم العثور على مستخدمين
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                جرّب اسمًا أو اسم مستخدم مختلفًا
              </p>

            </div>

          ) : (

            /* ================================================= */
            /* USERS */
            /* ================================================= */

            <div className="divide-y divide-gray-100">

              {users.map((user) => {

                const isCreating =
                  creatingUserId ===
                  user.userId;

                const displayName =
                  user.fullName?.trim() ||
                  user.username?.trim() ||
                  "مستخدم";

                return (

                  <button
                    key={user.userId}
                    type="button"
                    disabled={
                      creatingUserId !==
                      null
                    }
                    onClick={() => {
                      console.log(
                        "USER BUTTON CLICKED:",
                        user
                      );

                      void handleSelectUser(
                        user
                      );
                    }}
                    className="
                      flex
                      w-full
                      cursor-pointer
                      items-center
                      gap-3
                      bg-white
                      p-4
                      text-right
                      transition
                      hover:bg-gray-50
                      active:bg-gray-100
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >

                    {/* ================================================= */}
                    {/* AVATAR */}
                    {/* ================================================= */}

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-gray-100
                      "
                    >

                      {user.avatarUrl ? (

                        <img
                          src={
                            user.avatarUrl
                          }
                          alt={displayName}
                          draggable={false}
                          className="
                            pointer-events-none
                            h-full
                            w-full
                            object-cover
                          "
                        />

                      ) : (

                        <UserRound
                          size={21}
                          className="
                            pointer-events-none
                            text-gray-500
                          "
                        />

                      )}

                    </div>


                    {/* ================================================= */}
                    {/* USER INFO */}
                    {/* ================================================= */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <p
                        className="
                          pointer-events-none
                          truncate
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >
                        {displayName}
                      </p>


                      {user.username && (

                        <p
                          className="
                            pointer-events-none
                            mt-0.5
                            truncate
                            text-xs
                            text-gray-500
                          "
                        >
                          @{user.username}
                        </p>

                      )}

                    </div>


                    {/* ================================================= */}
                    {/* ACTION */}
                    {/* ================================================= */}

                    <div
                      className="
                        pointer-events-none
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-50
                      "
                    >

                      {isCreating ? (

                        <Loader2
                          size={19}
                          className="
                            animate-spin
                            text-blue-600
                          "
                        />

                      ) : (

                        <MessageCircle
                          size={19}
                          className="
                            text-gray-500
                          "
                        />

                      )}

                    </div>

                  </button>

                );
              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );

  return createPortal(
    dialog,
    document.body
  );
}