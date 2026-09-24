import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Users,
  Loader2,
} from "lucide-react";

import {
  searchUsers,
  type UserSearchResult,
} from "../api/searchUsers";

import UserCard from "../components/UserCard";
import FriendAction from "../components/FriendAction";

export default function PeoplePage() {
  const [query, setQuery] =
    useState("");

  const [users, setUsers] =
    useState<UserSearchResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // البحث عن المستخدمين
  // =====================================================

  useEffect(() => {
    const normalizedQuery =
      query.trim();

    // لا نبحث بأقل من حرفين
    if (
      normalizedQuery.length < 2
    ) {
      setUsers([]);
      setError(null);
      setLoading(false);

      return;
    }

    // تأخير بسيط لمنع إرسال طلب مع كل ضغطة
    const timeout =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);
            setError(null);

            const results =
              await searchUsers(
                normalizedQuery
              );

            setUsers(results);
          } catch (err) {
            console.error(
              "People search error:",
              err
            );

            setError(
              err instanceof Error
                ? err.message
                : "حدث خطأ أثناء البحث"
            );

            setUsers([]);
          } finally {
            setLoading(false);
          }
        },
        350
      );

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [query]);

  return (
    <main
      dir="rtl"
      className="
        min-h-full
        bg-gray-50
        p-6
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
        "
      >
        {/* =====================================================
            Header
        ===================================================== */}

        <div className="mb-6">
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-md
              "
            >
              <Users
                size={22}
              />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  text-gray-900
                "
              >
                البحث عن أشخاص
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                ابحث عن زملائك في UniShare
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            Search
        ===================================================== */}

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-4
            shadow-sm
          "
        >
          <div
            className="
              relative
            "
          >
            <Search
              size={20}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="ابحث بالاسم أو اسم المستخدم..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pl-12
                pr-12
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-500/10
              "
            />

            {loading && (
              <Loader2
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  animate-spin
                  text-blue-600
                "
              />
            )}
          </div>

          {/* =====================================================
              Minimum Search Length
          ===================================================== */}

          {query.trim().length === 1 && (
            <p
              className="
                mt-3
                text-xs
                text-gray-400
              "
            >
              اكتب حرفين على الأقل لبدء البحث.
            </p>
          )}
        </div>

        {/* =====================================================
            Error
        ===================================================== */}

        {error && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* =====================================================
            Empty Search Results
        ===================================================== */}

        {!loading &&
          !error &&
          query.trim().length >= 2 &&
          users.length === 0 && (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-gray-200
                bg-white
                px-6
                py-12
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-gray-400
                "
              >
                <Users
                  size={25}
                />
              </div>

              <h2
                className="
                  text-base
                  font-semibold
                  text-gray-800
                "
              >
                لم يتم العثور على أشخاص
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                جرّب البحث باسم مختلف أو باسم المستخدم.
              </p>
            </div>
          )}

        {/* =====================================================
            Search Results
        ===================================================== */}

        {users.length > 0 && (
          <div
            className="
              space-y-3
            "
          >
            <div
              className="
                mb-3
                text-sm
                font-medium
                text-gray-500
              "
            >
              نتائج البحث: {users.length}
            </div>

            {users.map(
              (user) => (
                <UserCard
                  key={user.userId}
                  user={user}
                >
                  <FriendAction
                    user={user}
                  />
                </UserCard>
              )
            )}
          </div>
        )}

        {/* =====================================================
            Initial State
        ===================================================== */}

        {query.trim().length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-gray-200
              bg-white
              px-6
              py-12
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-blue-50
                text-blue-600
              "
            >
              <Search
                size={25}
              />
            </div>

            <h2
              className="
                text-base
                font-semibold
                text-gray-800
              "
            >
              ابحث عن زملائك
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              اكتب اسمًا أو اسم مستخدم للعثور على أشخاص في UniShare.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}