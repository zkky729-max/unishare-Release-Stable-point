import {
  MessageSquareText,
  Sparkles,
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
            : "mx-auto max-w-6xl space-y-6 px-4 py-8"
        }
      >
        {/* Header Skeleton */}

        {!embedded && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="animate-pulse p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-200" />

                <div className="flex-1">
                  <div className="h-7 w-48 rounded-lg bg-slate-200" />
                  <div className="mt-3 h-4 w-80 max-w-full rounded-lg bg-slate-100" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Posts Skeleton */}

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
          : "mx-auto max-w-6xl space-y-6 px-4 py-8"
      }
    >
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      {!embedded && (
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-sm">
          {/* Decorative Shapes */}

          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -right-10 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="relative p-6 sm:p-7">
            <div className="flex items-start gap-4">
              {/* Icon */}

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/20">
                <MessageSquareText
                  size={26}
                  strokeWidth={2}
                />
              </div>

              {/* Title */}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    مجتمع الجامعة
                  </h1>

                  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-bold text-indigo-600">
                    <Sparkles
                      size={13}
                    />
                    UniShare
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  استكشف منشورات مجتمعك الجامعي وتفاعل مع الملاحظات
                  والإعلانات والأخبار.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          POSTS
      ================================================= */}

      {posts.length === 0 ? (
        <EmptyFeed />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="
                group
                h-full
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-100
                hover:shadow-lg
                active:translate-y-0
                active:shadow-sm
              "
            >
              <div className="h-full">
                <PostCard
                  post={post}
                />
              </div>
            </div>
          ))}
        </div>
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
      <PostsPageContent
        {...props}
      />
    </FeedProvider>
  );
}