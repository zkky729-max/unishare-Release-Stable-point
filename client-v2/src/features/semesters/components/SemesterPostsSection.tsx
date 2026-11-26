import { useCallback, useEffect, useRef, useMemo, useState } from "react";

import {
  BookOpen,
  FileText,
  MessageSquareText,
  ClipboardCheck,
  Plus,
  GraduationCap,
  Sparkles,
  Paperclip,
  Trash2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import AcademicComposer from "../../posts/components/AcademicComposer";
import PostActions from "../../posts/components/PostActions";
import CommentsList from "../../posts/comments/components/CommentsList";

import { getPosts } from "../../posts/api/getPosts";
import { toggleLike } from "../../posts/api/toggleLike";
import { deletePost } from "../../posts/api/deletePost";

import type {
  Post,
  AcademicPostType,
} from "../../posts/types/post";

import type { LucideIcon } from "lucide-react";

type ContentFilter = "all" | AcademicPostType;

type AcademicCardConfig = {
  label: string;
  Icon: LucideIcon;
  iconClass: string;
  badgeClass: string;
  cardClass: string;
  accentClass: string;
};

type SemesterPostsSectionProps = {
  semesterId: string;
  onError: (message: string) => void;
  onCountChange?: (count: number) => void;
};

export default function SemesterPostsSection({
  semesterId,
  onError,
  onCountChange,
}: SemesterPostsSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ContentFilter>("all");
  const [showComposer, setShowComposer] = useState(false);

  // Keep the latest parent callbacks without making the loading effect
  // depend on callback identities that may change on every parent render.
  const onErrorRef = useRef(onError);
  const onCountChangeRef = useRef(onCountChange);

  useEffect(() => {
    onErrorRef.current = onError;
    onCountChangeRef.current = onCountChange;
  }, [onError, onCountChange]);

  // ====================================================
  // Load / Refresh Posts
  // ====================================================

  const refreshPosts = useCallback(async () => {
    if (!semesterId) {
      setPosts([]);
      onCountChangeRef.current?.(0);
      return;
    }

    try {
      setPostsLoading(true);

      const data = await getPosts("all", { semesterId });

      setPosts(data);
      onCountChangeRef.current?.(data.length);
    } catch (err) {
      console.error("LOAD SEMESTER POSTS ERROR:", err);

      onErrorRef.current(
        err instanceof Error ? err.message : "تعذر تحميل المنشورات."
      );
    } finally {
      setPostsLoading(false);
    }
  }, [semesterId]);

  useEffect(() => {
    void refreshPosts();
  }, [refreshPosts]);

  // ====================================================
  // Composer Success
  // ====================================================

  function handleComposerSuccess() {
    // Reload from the database so the new post and its server data appear
    // immediately in the academic feed and the parent count is synchronized.
    void refreshPosts();
    setShowComposer(false);
  }

  // ====================================================
  // Like
  // ====================================================

  async function handleSemesterLike(postId: string, likedByMe: boolean) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByMe: !likedByMe,
              likes: !likedByMe
                ? post.likes + 1
                : Math.max(0, post.likes - 1),
            }
          : post
      )
    );

    try {
      await toggleLike(postId, likedByMe);
    } catch (error) {
      console.error("SEMESTER LIKE ERROR:", error);

      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByMe,
                likes: likedByMe
                  ? post.likes + 1
                  : Math.max(0, post.likes - 1),
              }
            : post
        )
      );

      throw error;
    }
  }

  // ====================================================
  // Delete Post
  // ====================================================

  async function handleSemesterDelete(postId: string) {
    await deletePost(postId);

    const updatedPosts = posts.filter((post) => post.id !== postId);

    setPosts(updatedPosts);
    onCountChangeRef.current?.(updatedPosts.length);
  }

  // ====================================================
  // Filters
  // ====================================================

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return posts;

    return posts.filter((post) => post.academicType === activeFilter);
  }, [posts, activeFilter]);

  const categories = [
    {
      id: "all" as ContentFilter,
      label: "الكل",
      description: "كل محتوى السداسي",
      icon: GraduationCap,
      color: "cyan",
    },
    {
      id: "lesson" as ContentFilter,
      label: "الدروس",
      description: "الدروس والمحاضرات",
      icon: BookOpen,
      color: "blue",
    },
    {
      id: "summary" as ContentFilter,
      label: "الملخصات",
      description: "ملخصات مفيدة للمراجعة",
      icon: FileText,
      color: "violet",
    },
    {
      id: "exam" as ContentFilter,
      label: "الامتحانات",
      description: "اختبارات وامتحانات سابقة",
      icon: ClipboardCheck,
      color: "emerald",
    },
    {
      id: "research_discussion" as ContentFilter,
      label: "البحوث والمناقشات",
      description: "بحوث ومواضيع للنقاش الأكاديمي",
      icon: MessageSquareText,
      color: "fuchsia",
    },
  ];

  const colorStyles: Record<string, { icon: string; active: string }> = {
    cyan: {
      icon: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
      active:
        "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_30px_-10px_rgba(34,211,238,0.35)]",
    },
    blue: {
      icon: "bg-blue-400/10 text-blue-300 border-blue-400/20",
      active:
        "border-blue-400/50 bg-blue-400/10 shadow-[0_0_30px_-10px_rgba(59,130,246,0.35)]",
    },
    violet: {
      icon: "bg-violet-400/10 text-violet-300 border-violet-400/20",
      active:
        "border-violet-400/50 bg-violet-400/10 shadow-[0_0_30px_-10px_rgba(139,92,246,0.35)]",
    },
    emerald: {
      icon: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
      active:
        "border-emerald-400/50 bg-emerald-400/10 shadow-[0_0_30px_-10px_rgba(52,211,153,0.35)]",
    },
    fuchsia: {
      icon: "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/20",
      active:
        "border-fuchsia-400/50 bg-fuchsia-400/10 shadow-[0_0_30px_-10px_rgba(217,70,239,0.35)]",
    },
  };

  // ====================================================
  // Render
  // ====================================================

  return (
    <>
      {/* Categories */}

      <section className="mt-10">
        <div className="section-heading mb-5">
          <div className="section-icon cyan-icon">
            <RadioIcon />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-white sm:text-2xl">
                مركز المعرفة
              </h2>
              <span className="section-tag">KNOWLEDGE STREAM</span>
            </div>
            <p className="mt-1 text-xs text-slate-300">
              اختر نوع المحتوى الذي تريد استكشافه
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = activeFilter === category.id;
            const styles = colorStyles[category.color];

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveFilter(category.id)}
                aria-pressed={active}
                className={`filter-card ${active ? styles.active : ""}`}
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${styles.icon}`}
                >
                  <Icon size={20} />
                </div>

                <p
                  className={`text-sm font-black ${
                    active ? "text-white" : "text-slate-100"
                  }`}
                >
                  {category.label}
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-300">
                  {category.description}
                </p>

                {active && (
                  <span className="mt-3 inline-flex items-center gap-1 text-[9px] font-black tracking-wider text-cyan-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
                    ACTIVE FILTER
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Composer */}

      <section className="mt-6">
        {!showComposer ? (
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="composer-launch group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200 transition-all group-hover:scale-105 group-hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.5)]">
              <Plus size={23} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-black text-white">
                شارك شيئًا مفيدًا
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                أضف درسًا، ملخصًا، امتحانًا أو بحثًا أو موضوعًا للمناقشة
              </p>
            </div>

            <div className="mr-auto hidden items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs font-bold text-cyan-200 sm:inline-flex">
              <Sparkles size={14} />
              ابدأ المشاركة
            </div>
          </button>
        ) : (
          <div className="composer-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <Sparkles size={17} className="text-cyan-300" />
                إنشاء محتوى أكاديمي
              </div>
              <span className="section-tag">NEW CONTRIBUTION</span>
            </div>

            <div className="rounded-2xl bg-white p-2 sm:p-3">
              <AcademicComposer
                semesterId={semesterId}
                onSuccess={handleComposerSuccess}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowComposer(false)}
              className="mt-3 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              إغلاق المحرر
            </button>
          </div>
        )}
      </section>

      {/* Posts */}

      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />

              <h2 className="text-xl font-black text-white sm:text-2xl">
                {activeFilter === "all"
                  ? "المحتوى الأكاديمي"
                  : categories.find((item) => item.id === activeFilter)?.label}
              </h2>

              <span className="section-tag">ACADEMIC FEED</span>
            </div>

            <p className="mt-1.5 text-xs text-slate-300">
              المعرفة التي يشاركها طلاب هذا السداسي
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-slate-200 sm:self-auto">
            <FileText size={13} className="text-cyan-300" />
            {filteredPosts.length} محتوى
          </div>
        </div>

        {postsLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="h-80 animate-pulse rounded-3xl bg-white/[0.04]" />
            <div className="h-80 animate-pulse rounded-3xl bg-white/[0.04]" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-future py-14">
            <div className="empty-icon">
              {activeFilter === "lesson" ? (
                <BookOpen size={29} />
              ) : activeFilter === "summary" ? (
                <FileText size={29} />
              ) : activeFilter === "exam" ? (
                <ClipboardCheck size={29} />
              ) : activeFilter === "research_discussion" ? (
                <MessageSquareText size={29} />
              ) : (
                <GraduationCap size={29} />
              )}
            </div>

            <h3 className="mt-5 text-lg font-black text-white">
              لا يوجد محتوى بعد
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-300">
              كن أول من يشارك محتوى مفيدًا مع طلاب هذا السداسي.
            </p>

            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="neon-button mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-white"
            >
              <Plus size={18} />
              إنشاء منشور
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <SemesterPostCard
                key={post.id}
                post={post}
                onLike={handleSemesterLike}
                onDelete={handleSemesterDelete}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// ======================================================
// Semester Post Card
// ======================================================

function SemesterPostCard({
  post,
  onLike,
  onDelete,
}: {
  post: Post;
  onLike: (postId: string, likedByMe: boolean) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
}) {
  const [showComments, setShowComments] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const typeConfig: Record<string, AcademicCardConfig> = {
    lesson: {
      label: "درس",
      Icon: BookOpen,
      iconClass: "bg-blue-400/10 text-blue-300",
      badgeClass: "border-blue-300/20 bg-blue-400/[0.08] text-blue-200",
      cardClass: "",
      accentClass: "from-blue-400 to-cyan-300",
    },
    summary: {
      label: "ملخص",
      Icon: FileText,
      iconClass: "bg-indigo-400/10 text-indigo-300",
      badgeClass: "border-indigo-300/20 bg-indigo-400/[0.08] text-indigo-200",
      cardClass: "",
      accentClass: "from-indigo-400 to-violet-300",
    },
    exam: {
      label: "امتحان",
      Icon: ClipboardCheck,
      iconClass: "bg-cyan-400/10 text-cyan-300",
      badgeClass: "border-cyan-300/20 bg-cyan-400/[0.08] text-cyan-200",
      cardClass: "",
      accentClass: "from-cyan-400 to-blue-300",
    },
    research_discussion: {
      label: "بحوث ومناقشات",
      Icon: MessageSquareText,
      iconClass: "bg-purple-400/10 text-purple-300",
      badgeClass: "border-purple-300/20 bg-purple-400/[0.08] text-purple-200",
      cardClass: "",
      accentClass: "from-purple-400 to-fuchsia-300",
    },
  };

  const config = post.academicType
    ? typeConfig[post.academicType]
    : null;

  async function handleLike() {
    await onLike(post.id, post.likedByMe);
  }

  async function handleDelete() {
    if (deleteLoading) return;

    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المنشور؟\nلا يمكن التراجع عن هذه العملية."
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await onDelete(post.id);
    } catch (error) {
      console.error("SEMESTER POST DELETE ERROR:", error);
      window.alert("تعذر حذف المنشور. حاول مرة أخرى.");
    } finally {
      setDeleteLoading(false);
    }
  }

  const CardIcon = config?.Icon ?? GraduationCap;

  return (
    <article className="post-card group relative flex h-full min-w-0 flex-col overflow-hidden">
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-l ${
          config?.accentClass ?? "from-cyan-400 to-violet-400"
        }`}
      />

      <div className="flex flex-1 flex-col p-5 pt-6 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full border border-cyan-300/20 object-cover shadow-[0_0_18px_-8px_rgba(34,211,238,0.5)]"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 font-black text-cyan-100">
                {post.author.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-100">
                {post.author.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">
                {post.createdAt}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {config && (
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-black ${config.badgeClass}`}
              >
                <CardIcon size={12} />
                {config.label}
              </div>
            )}

            {post.isOwner && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition hover:border-rose-400/20 hover:bg-rose-400/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="حذف المنشور"
                title="حذف المنشور"
              >
                {deleteLoading ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Trash2 size={17} aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 ${
                config?.iconClass ?? "bg-cyan-400/10 text-cyan-300"
              }`}
            >
              <CardIcon size={17} />
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400">
                محتوى أكاديمي
              </p>
              <h3 className="text-sm font-black text-slate-100">
                {config?.label ?? "منشور أكاديمي"}
              </h3>
            </div>
          </div>

          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-8 text-slate-200 sm:text-[15px]">
            {post.content}
          </p>
        </div>

        {post.images_urls && post.images_urls.length > 0 && (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {post.images_urls.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt=""
                className="max-h-72 w-full rounded-2xl border border-white/10 object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
            ))}
          </div>
        )}

        {(post.pdf_url || post.pdf) && (
          <a
            href={post.pdf_url ?? post.pdf ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] p-4 transition-all hover:border-cyan-300/30 hover:bg-cyan-300/[0.09]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
              <Paperclip size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-black text-cyan-100">ملف PDF</p>
              <p className="mt-0.5 text-xs text-cyan-200/70">فتح الملف</p>
            </div>

            <ArrowLeft size={16} className="mr-auto text-cyan-300/80" />
          </a>
        )}

        <div className="flex-1" />
      </div>

      <div className="flex items-center gap-5 border-t border-white/[0.07] px-5 py-3 text-xs font-semibold text-slate-300 sm:px-6">
        <span>❤️ {post.likes}</span>
        <span>💬 {post.comments}</span>
      </div>

      <div className="border-t border-white/[0.07] bg-white/[0.02]">
        <PostActions
          postId={post.id}
          likedByMe={post.likedByMe}
          onLike={handleLike}
          showComments={showComments}
          onComment={() => setShowComments((previous) => !previous)}
          onShare={() => {}}
        />
      </div>

      {showComments && (
        <div className="border-t border-white/[0.07] bg-white/[0.03]">
          <CommentsList postId={post.id} />
        </div>
      )}
    </article>
  );
}

// ======================================================
// Small Icon
// ======================================================

function RadioIcon() {
  return <span className="text-xl">◉</span>;
}
