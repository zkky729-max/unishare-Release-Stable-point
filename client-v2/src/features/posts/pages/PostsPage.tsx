
import {
  MessageSquareText,
  Sparkles,
  Users,
  Network,
  BookOpen,
  Lightbulb,
  ArrowDown,
  Orbit,
  Zap,
} from "lucide-react";

import EmptyFeed from "../components/EmptyFeed";
import FeedSkeleton from "../components/FeedSkeleton";
import PostCard from "../components/PostCard";

import {
  FeedProvider,
  useFeed,
} from "../context/FeedContext";

// =====================================================
// Props
// =====================================================

interface PostsPageProps {
  embedded?: boolean;
}

// =====================================================
// Posts Page Content
// =====================================================

function PostsPageContent({
  embedded = false,
}: PostsPageProps) {
  const {
    posts,
    loading,
  } = useFeed();

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className={
          embedded
            ? "space-y-6"
            : "mx-auto max-w-7xl space-y-7 px-4 py-6 sm:px-6 sm:py-8"
        }
      >
        {!embedded && (
          <section className="relative overflow-hidden rounded-[2rem] bg-[#0b1230] shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_20%,rgba(59,130,246,.28),transparent_40%),radial-gradient(ellipse_at_90%_90%,rgba(124,58,237,.25),transparent_40%)]" />

            <div className="relative animate-pulse p-7 sm:p-10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/15" />
                <div className="flex-1">
                  <div className="h-7 w-48 rounded-lg bg-white/20" />
                  <div className="mt-3 h-4 w-72 max-w-full rounded-lg bg-white/10" />
                </div>
              </div>

              <div className="mt-10 h-5 w-64 rounded-lg bg-white/10" />
              <div className="mt-3 h-4 w-80 max-w-full rounded-lg bg-white/10" />
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
        </div>
      </div>
    );
  }

  // ===================================================
  // Render
  // ===================================================

  return (
    <div
      dir="rtl"
      className={
        embedded
          ? "space-y-6"
          : "mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8"
      }
    >
      {/* =================================================
          COMMUNITY HERO
      ================================================= */}

      {!embedded && (
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#080f2d] text-white shadow-2xl shadow-blue-950/10">

          {/* Background */}

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_15%,rgba(37,99,235,.32),transparent_38%),radial-gradient(ellipse_at_90%_90%,rgba(124,58,237,.30),transparent_42%)]" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(148,163,184,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.3)_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-cyan-300/10" />
          <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full border border-cyan-300/10" />

          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

          {/* Hero Content */}

          <div className="relative grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-11">

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-200 shadow-lg shadow-blue-950/20 backdrop-blur sm:text-sm">
                <Sparkles size={15} />
                مساحة الأفكار والمعرفة
              </div>

              <div className="mt-6 flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-blue-400 to-violet-600 shadow-xl shadow-blue-950/30 sm:h-[68px] sm:w-[68px]">
                  <MessageSquareText size={30} strokeWidth={2} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    مجتمع الجامعة
                  </h1>

                  <p className="mt-2 text-xs font-bold tracking-wider text-cyan-200/80 sm:text-sm">
                    UNISHARE COMMUNITY
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                هنا تلتقي الأفكار وتتبادل الخبرات.
                اكتشف ما ينشره مجتمعك الجامعي، شارك معرفتك،
                وتفاعل مع الأخبار والإعلانات والمحتوى الأكاديمي.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  <Users size={17} className="text-cyan-300" />
                  مجتمع واحد
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  <BookOpen size={17} className="text-violet-300" />
                  معرفة مشتركة
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  <Lightbulb size={17} className="text-amber-300" />
                  أفكار متجددة
                </div>
              </div>
            </div>

            {/* Decorative Community Network */}

            <div className="relative mx-auto hidden h-56 w-56 items-center justify-center lg:flex">

              <div className="absolute inset-0 rounded-full border border-cyan-300/20" />
              <div className="absolute inset-5 rounded-full border border-dashed border-violet-300/30 animate-[spin_35s_linear_infinite]" />
              <div className="absolute inset-10 rounded-full border border-blue-300/20" />

              <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl" />

              <svg
                viewBox="0 0 220 220"
                className="absolute inset-0 h-full w-full"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M110 110 L110 22 M110 110 L195 78 M110 110 L166 190 M110 110 L28 157 M110 110 L30 54"
                  stroke="url(#community-gradient)"
                  strokeWidth="1.5"
                  strokeDasharray="5 6"
                />

                <defs>
                  <linearGradient id="community-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>

                <g fill="#67e8f9">
                  <circle cx="110" cy="22" r="4" />
                  <circle cx="195" cy="78" r="4" />
                  <circle cx="166" cy="190" r="4" />
                  <circle cx="28" cy="157" r="4" />
                  <circle cx="30" cy="54" r="4" />
                </g>
              </svg>

              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-200/30 bg-gradient-to-br from-blue-500 to-violet-600 shadow-[0_0_45px_rgba(59,130,246,.4)]">
                <Network size={42} className="text-white" />
              </div>

              <div className="absolute right-0 top-7 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-cyan-200 shadow-lg backdrop-blur">
                <Users size={19} />
              </div>

              <div className="absolute bottom-5 left-2 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-violet-200 shadow-lg backdrop-blur">
                <Lightbulb size={19} />
              </div>

              <div className="absolute bottom-1 right-12 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-blue-200 shadow-lg backdrop-blur">
                <BookOpen size={19} />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}

          <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.04] px-6 py-4 sm:px-9">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 sm:text-sm">
              <Zap size={15} className="text-cyan-300" />
              كل فكرة يمكن أن تصنع فرقاً
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.8)]" />
              عالمك الأكاديمي يبدأ هنا
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          FEED INTRO
      ================================================= */}

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <Orbit size={20} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                {embedded ? "أحدث المنشورات" : "نبض المجتمع"}
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {embedded
                  ? "اكتشف أحدث ما يشاركه المجتمع"
                  : "اكتشف الأفكار والمحتوى الذي يشاركه مجتمعك"}
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-blue-100 bg-gradient-to-l from-blue-50 to-violet-50 px-4 py-3 text-sm font-bold text-blue-700">
          <MessageSquareText size={17} />
          {posts.length} {posts.length === 1 ? "منشور" : "منشورات"}
        </div>
      </section>

      {/* =================================================
          POSTS
      ================================================= */}

      {posts.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
          <EmptyFeed />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-6">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="
                group
                relative
                h-full
                overflow-hidden
                rounded-[1.75rem]
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-blue-200
                hover:shadow-xl
                hover:shadow-blue-900/[0.07]
                active:translate-y-0
              "
            >
              {/* Card Top Accent */}

              <div
                className={`h-1 w-full ${
                  index % 4 === 0
                    ? "bg-gradient-to-l from-blue-500 to-cyan-400"
                    : index % 4 === 1
                    ? "bg-gradient-to-l from-violet-500 to-fuchsia-400"
                    : index % 4 === 2
                    ? "bg-gradient-to-l from-cyan-500 to-teal-400"
                    : "bg-gradient-to-l from-indigo-500 to-blue-400"
                }`}
              />

              {/* Hover Glow */}

              <div className="pointer-events-none absolute -left-16 -top-16 h-36 w-36 rounded-full bg-blue-400/0 blur-3xl transition duration-500 group-hover:bg-blue-400/10" />

              <div className="relative h-full">
                <PostCard post={post} />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* =================================================
          BOTTOM COMMUNITY MESSAGE
      ================================================= */}

      {!embedded && posts.length > 0 && (
        <section className="relative overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-gradient-to-l from-blue-50 via-white to-violet-50 p-6 sm:p-8">

          <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                <Sparkles size={24} />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  المعرفة تكبر عندما نتشاركها
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
                  كن جزءاً من مجتمع جامعي يؤمن بقوة الأفكار
                  وبأن لكل طالب شيئاً يستحق أن يقدمه.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-sm font-bold text-indigo-600">
              <span>شارك وكن مؤثراً</span>
              <ArrowDown size={17} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// =====================================================
// Page
// =====================================================

export default function PostsPage(
  props: PostsPageProps
) {
  return (
    <FeedProvider>
      <PostsPageContent {...props} />
    </FeedProvider>
  );
}
