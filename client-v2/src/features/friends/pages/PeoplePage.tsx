
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Search,
  Users,
  Loader2,
  X,
  UserRoundSearch,
  Sparkles,
} from "lucide-react";

import {
  searchUsers,
  type UserSearchResult,
} from "../api/searchUsers";

import UserCard from "../components/UserCard";
import FriendAction from "../components/FriendAction";

export default function PeoplePage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // يمنع عرض نتائج طلب بحث قديم
  const requestId = useRef(0);

  useEffect(() => {
    const normalizedQuery = query.trim();

    const currentRequest = ++requestId.current;

    if (normalizedQuery.length < 2) {
      setUsers([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timeout = window.setTimeout(async () => {
      try {
        const results = await searchUsers(normalizedQuery);

        if (requestId.current === currentRequest) {
          setUsers(results);
        }
      } catch (err) {
        if (requestId.current === currentRequest) {
          console.error("People search error:", err);

          setError(
            err instanceof Error
              ? err.message
              : "حدث خطأ أثناء البحث"
          );

          setUsers([]);
        }
      } finally {
        if (requestId.current === currentRequest) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setUsers([]);
    setError(null);
  };

  const normalizedQuery = query.trim();

  return (
    <main
      dir="rtl"
      className="min-h-full bg-gray-50/80 px-4 py-6 sm:px-6 lg:py-8"
    >
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <section className="mb-7">
          <div className="flex items-center gap-4">

            <div className="
              flex h-14 w-14 shrink-0 items-center justify-center
              rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600
              text-white shadow-lg shadow-blue-600/20
            ">
              <Users size={27} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  اكتشف الأشخاص
                </h1>

                <Sparkles
                  size={19}
                  className="text-blue-500"
                />
              </div>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                اكتشف زملاءك وابنِ شبكة علاقاتك داخل UniShare.
              </p>
            </div>

          </div>
        </section>

        {/* Search Box */}

        <section className="
          mb-6 rounded-2xl border border-gray-200/80
          bg-white p-4 shadow-sm sm:p-5
        ">

          <label className="mb-3 block text-sm font-semibold text-gray-700">
            ابحث عن طالب أو زميل
          </label>

          <div className="relative">

            <Search
              size={21}
              className="
                pointer-events-none absolute right-4 top-1/2
                -translate-y-1/2 text-gray-400
              "
            />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="الاسم الكامل أو اسم المستخدم..."
              autoComplete="off"
              className="
                w-full rounded-xl border border-gray-200
                bg-gray-50 py-4 pr-12 pl-20 text-sm text-gray-900
                outline-none transition-all
                placeholder:text-gray-400
                hover:border-gray-300
                focus:border-blue-500 focus:bg-white
                focus:ring-4 focus:ring-blue-500/10
              "
            />

            {normalizedQuery.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="مسح البحث"
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2 rounded-lg p-1.5
                  text-gray-400 transition
                  hover:bg-gray-100 hover:text-gray-700
                "
              >
                <X size={18} />
              </button>
            )}

          </div>

          <div className="mt-3 flex items-center justify-between gap-3">

            <p className="text-xs text-gray-400">
              {normalizedQuery.length < 2
                ? "أدخل حرفين على الأقل لبدء البحث."
                : "يمكنك البحث بالاسم أو اسم المستخدم."}
            </p>

            {loading && (
              <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-blue-600">
                <Loader2 size={15} className="animate-spin" />
                جارٍ البحث...
              </div>
            )}

          </div>
        </section>

        {/* Error */}

        {error && (
          <div className="
            mb-6 flex items-center gap-3 rounded-xl
            border border-red-200 bg-red-50 p-4
            text-sm text-red-600
          ">
            <span className="font-medium">
              {error}
            </span>
          </div>
        )}

        {/* Initial State */}

        {normalizedQuery.length === 0 && (
          <section className="
            rounded-2xl border border-dashed
            border-gray-200 bg-white px-6 py-14
            text-center
          ">
            <div className="
              mx-auto mb-5 flex h-16 w-16 items-center
              justify-center rounded-2xl bg-blue-50
              text-blue-600
            ">
              <UserRoundSearch size={31} />
            </div>

            <h2 className="text-lg font-bold text-gray-800">
              مجتمع UniShare يبدأ بك!
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500">
              ابحث عن زملائك في الجامعة، تعرّف على أشخاص جدد
              وابدأ ببناء مجتمعك الأكاديمي.
            </p>
          </section>
        )}

        {/* Loading Skeleton */}

        {loading && users.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  flex animate-pulse items-center gap-4
                  rounded-2xl border border-gray-100
                  bg-white p-4
                "
              >
                <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-gray-200" />
                  <div className="h-3 w-48 max-w-full rounded bg-gray-100" />
                </div>

                <div className="h-9 w-20 rounded-xl bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}

        {!loading && !error && users.length > 0 && (
          <section>

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">
                  نتائج البحث
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  الأشخاص الذين تطابقوا مع بحثك
                </p>
              </div>

              <span className="
                rounded-full bg-blue-50 px-3 py-1.5
                text-xs font-bold text-blue-700
              ">
                {users.length} {users.length === 1 ? "نتيجة" : "نتائج"}
              </span>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <UserCard
                  key={user.userId}
                  user={user}
                >
                  <FriendAction user={user} />
                </UserCard>
              ))}
            </div>

          </section>
        )}

        {/* Empty Results */}

        {!loading &&
          !error &&
          normalizedQuery.length >= 2 &&
          users.length === 0 && (
            <section className="
              rounded-2xl border border-dashed
              border-gray-200 bg-white px-6 py-14
              text-center
            ">
              <div className="
                mx-auto mb-5 flex h-16 w-16
                items-center justify-center rounded-2xl
                bg-gray-100 text-gray-400
              ">
                <Users size={29} />
              </div>

              <h2 className="text-lg font-bold text-gray-800">
                لم نعثر على أشخاص
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-gray-500">
                لم نجد أشخاصاً يطابقون بحثك.
                حاول كتابة الاسم بطريقة مختلفة.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="
                  mt-5 rounded-xl bg-blue-600
                  px-5 py-2.5 text-sm font-semibold
                  text-white transition hover:bg-blue-700
                "
              >
                بحث جديد
              </button>
            </section>
          )}

      </div>
    </main>
  );
}
