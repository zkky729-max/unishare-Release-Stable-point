import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  MessageSquareText,
  ClipboardCheck,
  Plus,
  GraduationCap,
  Sparkles,
  CalendarDays,
  Paperclip,
  Layers3,
  ChevronDown,
  BookMarked,
  Trash2,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import AcademicComposer from "../../posts/components/AcademicComposer";
import PostActions from "../../posts/components/PostActions";

import CommentsList from "../../posts/comments/components/CommentsList";

import { getPosts } from "../../posts/api/getPosts";
import { toggleLike } from "../../posts/api/toggleLike";
import { deletePost } from "../../posts/api/deletePost";

import { FeedProvider } from "../../posts/context/FeedContext";

import { getModulesBySemester } from "../../modules/api/modules";
import { getSubjectsByModule } from "../../subjects/api/subjects";

import type {
  Post,
  AcademicPostType,
} from "../../posts/types/post";

import type { LucideIcon } from "lucide-react";

// ======================================================
// Types
// ======================================================

type SemesterInfo = {
  id: string;
  name: string;
  semester_number: number;
  level_id: string;
  specialty_id: string | null;
};

type ContentFilter = "all" | AcademicPostType;

type AcademicCardConfig = {
  label: string;
  Icon: LucideIcon;
  iconClass: string;
  badgeClass: string;
  cardClass: string;
  accentClass: string;
};

type AcademicModule = {
  id: string;
  name: string;
};

type AcademicSubject = {
  id: string;
  name: string;
  description?: string | null;
  module_id?: string | null;
  specialty_id?: string | null;
};

type ModuleWithSubjects = AcademicModule & {
  subjects: AcademicSubject[];
};

// ======================================================
// Page Content
// ======================================================

function SemesterSpacePageContent() {
  const { semesterId } = useParams<{
    semesterId: string;
  }>();

  const navigate = useNavigate();

  // ====================================================
  // State
  // ====================================================

  const [semester, setSemester] =
    useState<SemesterInfo | null>(null);

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [modules, setModules] =
    useState<ModuleWithSubjects[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [postsLoading, setPostsLoading] =
    useState(false);

  const [modulesLoading, setModulesLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [modulesError, setModulesError] =
    useState<string | null>(null);

  const [activeFilter, setActiveFilter] =
    useState<ContentFilter>("all");

  const [showComposer, setShowComposer] =
    useState(false);

  const [expandedModules, setExpandedModules] =
    useState<Record<string, boolean>>({});

  // ====================================================
  // Load Semester
  // ====================================================

  useEffect(() => {
    if (!semesterId) {
      setError("معرف السداسي غير موجود.");
      setLoading(false);
      return;
    }

    async function loadSemester() {
      try {
        setLoading(true);
        setError(null);

        const {
          data,
          error: semesterError,
        } = await supabase
          .from("semesters")
          .select(`
            id,
            name,
            semester_number,
            level_id,
            levels (
              specialty_id
            )
          `)
          .eq("id", semesterId)
          .maybeSingle();

        if (semesterError) {
          console.error(
            "LOAD SEMESTER ERROR:",
            semesterError
          );

          throw semesterError;
        }

        if (!data) {
          throw new Error(
            "لم يتم العثور على هذا السداسي."
          );
        }

        const levelData =
          Array.isArray(data.levels)
            ? data.levels[0]
            : data.levels;

        const specialtyId =
          levelData?.specialty_id ?? null;

        setSemester({
          id: data.id,
          name: data.name,
          semester_number:
            data.semester_number,
          level_id: data.level_id,
          specialty_id: specialtyId,
        });
      } catch (err) {
        console.error(
          "LOAD SEMESTER ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل السداسي."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSemester();
  }, [semesterId]);

  // ====================================================
  // Load Modules + Subjects
  // ====================================================

  useEffect(() => {
    if (!semesterId) {
      return;
    }

    async function loadAcademicStructure() {
      if (!semesterId) {
        return;
      }

      try {
        setModulesLoading(true);
        setModulesError(null);

        const moduleData =
          await getModulesBySemester(
            semesterId
          );

        const modulesWithSubjects =
          await Promise.all(
            moduleData.map(
              async (module) => {
                try {
                  const subjects =
                    await getSubjectsByModule(
                      module.id
                    );

                  return {
                    id: module.id,
                    name: module.name,
                    subjects:
                      (subjects ?? []) as AcademicSubject[],
                  };
                } catch (subjectError) {
                  console.error(
                    `LOAD SUBJECTS ERROR FOR MODULE ${module.id}:`,
                    subjectError
                  );

                  return {
                    id: module.id,
                    name: module.name,
                    subjects: [],
                  };
                }
              }
            )
          );

        setModules(
          modulesWithSubjects
        );

        const initialExpandedState =
          modulesWithSubjects.reduce<
            Record<string, boolean>
          >(
            (result, module) => {
              result[module.id] = true;
              return result;
            },
            {}
          );

        setExpandedModules(
          initialExpandedState
        );
      } catch (err) {
        console.error(
          "LOAD ACADEMIC STRUCTURE ERROR:",
          err
        );

        setModulesError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل الوحدات والمقاييس."
        );
      } finally {
        setModulesLoading(false);
      }
    }

    loadAcademicStructure();
  }, [semesterId]);

  // ====================================================
  // Load Posts
  // ====================================================

  useEffect(() => {
    if (!semesterId) {
      return;
    }

    async function loadPosts() {
      try {
        setPostsLoading(true);

        const data = await getPosts(
          "all",
          {
            semesterId,
          }
        );

        setPosts(data);
      } catch (err) {
        console.error(
          "LOAD SEMESTER POSTS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل المنشورات."
        );
      } finally {
        setPostsLoading(false);
      }
    }

    loadPosts();
  }, [semesterId]);

  // ====================================================
  // Toggle Module
  // ====================================================

  function toggleModule(
    moduleId: string
  ) {
    setExpandedModules(
      (current) => ({
        ...current,
        [moduleId]:
          !current[moduleId],
      })
    );
  }

  // ====================================================
  // Open Subject Lessons
  // ====================================================

  function openSubjectLessons(
    subjectId: string
  ) {
    navigate(
      `/subjects/${subjectId}/lessons`
    );
  }

  // ====================================================
  // Like
  // ====================================================

  async function handleSemesterLike(
    postId: string,
    likedByMe: boolean
  ) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByMe: !likedByMe,
              likes: !likedByMe
                ? post.likes + 1
                : Math.max(
                    0,
                    post.likes - 1
                  ),
            }
          : post
      )
    );

    try {
      await toggleLike(
        postId,
        likedByMe
      );
    } catch (error) {
      console.error(
        "SEMESTER LIKE ERROR:",
        error
      );

      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByMe,
                likes: likedByMe
                  ? post.likes + 1
                  : Math.max(
                      0,
                      post.likes - 1
                    ),
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

  async function handleSemesterDelete(
    postId: string
  ) {
    await deletePost(postId);

    setPosts((current) =>
      current.filter(
        (post) => post.id !== postId
      )
    );
  }

  // ====================================================
  // Filter Posts
  // ====================================================

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") {
      return posts;
    }

    return posts.filter(
      (post) =>
        post.academicType ===
        activeFilter
    );
  }, [posts, activeFilter]);

  // ====================================================
  // Categories
  // ====================================================

  const categories = [
    {
      id: "all" as ContentFilter,
      label: "الكل",
      icon: GraduationCap,
      description: "كل محتوى السداسي",
      activeClass:
        "border-indigo-200 bg-indigo-50/80",
      iconClass:
        "bg-indigo-100 text-indigo-600",
    },

    {
      id: "lesson" as ContentFilter,
      label: "الدروس",
      icon: BookOpen,
      description: "الدروس والمحاضرات",
      activeClass:
        "border-blue-200 bg-blue-50/80",
      iconClass:
        "bg-blue-100 text-blue-600",
    },

    {
      id: "summary" as ContentFilter,
      label: "الملخصات",
      icon: FileText,
      description: "ملخصات مفيدة للمراجعة",
      activeClass:
        "border-violet-200 bg-violet-50/80",
      iconClass:
        "bg-violet-100 text-violet-600",
    },

    {
      id: "exam" as ContentFilter,
      label: "الامتحانات",
      icon: ClipboardCheck,
      description:
        "اختبارات وامتحانات سابقة",
      activeClass:
        "border-cyan-200 bg-cyan-50/80",
      iconClass:
        "bg-cyan-100 text-cyan-600",
    },

    {
      id: "research_discussion" as ContentFilter,
      label: "البحوث والمناقشات",
      icon: MessageSquareText,
      description:
        "بحوث ومواضيع للنقاش الأكاديمي",
      activeClass:
        "border-purple-200 bg-purple-50/80",
      iconClass:
        "bg-purple-100 text-purple-600",
    },
  ];

  // ====================================================
  // Loading
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="animate-pulse space-y-6">

            <div className="h-8 w-20 rounded-xl bg-slate-200" />

            <div className="h-56 rounded-[2rem] bg-slate-200" />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="h-28 rounded-2xl bg-slate-200" />
              <div className="h-28 rounded-2xl bg-slate-200" />
              <div className="h-28 rounded-2xl bg-slate-200" />
              <div className="h-28 rounded-2xl bg-slate-200" />
              <div className="h-28 rounded-2xl bg-slate-200" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="h-80 rounded-[1.75rem] bg-slate-200" />
              <div className="h-80 rounded-[1.75rem] bg-slate-200" />
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ====================================================
  // Error
  // ====================================================

  if (error || !semester) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#f8fafc] px-4 py-10"
      >
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 p-8 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-2xl">
            ⚠️
          </div>

          <h1 className="text-xl font-black text-slate-900">
            تعذر تحميل السداسي
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ??
              "تعذر العثور على السداسي."}
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            العودة
          </button>

        </div>
      </div>
    );
  }

  // ====================================================
  // Render
  // ====================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f8fafc]"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Back */}

        <button
          onClick={() =>
            navigate(-1)
          }
          className="mb-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 transition-all duration-200 hover:bg-white hover:text-indigo-600 hover:shadow-sm active:scale-[0.97]"
        >
          <ArrowLeft size={18} />
          العودة
        </button>

        {/* Hero */}

        <section className="relative overflow-hidden rounded-[2rem] border border-indigo-100/80 bg-gradient-to-br from-indigo-50/90 via-white to-cyan-50/90 p-6 shadow-[0_18px_50px_-35px_rgba(79,70,229,0.45)] sm:p-8 lg:p-10">

          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-purple-400/5 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

              <div className="min-w-0">

                <div className="mb-5 flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                    <GraduationCap size={27} />
                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                      <Sparkles size={14} />
                      المساحة الأكاديمية
                    </div>

                    <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                      {semester.name}
                    </h1>

                  </div>

                </div>

                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  مساحة مخصصة لمحتوى هذا السداسي.
                  شارك الدروس والملخصات والامتحانات
                  والبحوث والمناقشات مع زملائك
                  في بيئة أكاديمية منظمة.
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">

                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
                    <CalendarDays size={14} />
                    الفصل الدراسي{" "}
                    {semester.semester_number}
                  </div>

                  <div className="rounded-full border border-cyan-100 bg-white/70 px-4 py-2 text-xs font-bold text-cyan-700 shadow-sm backdrop-blur">
                    {posts.length} منشور
                  </div>

                  <div className="rounded-full border border-purple-100 bg-white/70 px-4 py-2 text-xs font-bold text-purple-700 shadow-sm backdrop-blur">
                    {modules.length} وحدة
                  </div>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowComposer(true)
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25 active:translate-y-0 active:scale-[0.98]"
              >
                <Plus size={19} />
                إنشاء منشور
              </button>

            </div>

          </div>

        </section>

        {/* Modules + Subjects */}

        <section className="mt-8">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                  <Layers3 size={19} />
                </div>

                <div>

                  <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    وحدات ومقاييس السداسي
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    الوحدات والمقاييس المرتبطة بهذا السداسي
                  </p>

                </div>

              </div>

            </div>

            {!modulesLoading &&
              modules.length > 0 && (
                <div className="self-start rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-black text-indigo-600 shadow-sm sm:self-auto">
                  {modules.length} وحدة
                </div>
              )}

          </div>

          {modulesLoading ? (

            <div className="grid gap-5 md:grid-cols-2">

              <div className="h-56 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white" />

              <div className="h-56 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white" />

            </div>

          ) : modulesError ? (

            <div className="rounded-[1.75rem] border border-red-100 bg-red-50/70 p-6 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                ⚠️
              </div>

              <h3 className="mt-3 text-sm font-black text-red-700">
                تعذر تحميل الوحدات والمقاييس
              </h3>

              <p className="mt-2 text-xs leading-6 text-red-500">
                {modulesError}
              </p>

            </div>

          ) : modules.length === 0 ? (

            <div className="rounded-[2rem] border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-cyan-50/60 px-6 py-14 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-indigo-600 shadow-sm">
                <Layers3 size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-800">
                لا توجد وحدات لهذا السداسي
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-400">
                لم تتم إضافة أي وحدات أكاديمية مرتبطة بهذا السداسي بعد.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2">

              {modules.map(
                (
                  module,
                  moduleIndex
                ) => {

                  const isExpanded =
                    expandedModules[
                      module.id
                    ] ?? true;

                  return (
                    <article
                      key={module.id}
                      className="group overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-[0_12px_40px_-28px_rgba(79,70,229,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_20px_45px_-28px_rgba(79,70,229,0.5)]"
                    >

                      {/* Module Header */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleModule(
                            module.id
                          )
                        }
                        className="relative w-full overflow-hidden p-5 text-right sm:p-6"
                      >

                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-600 shadow-sm">
                            <Layers3 size={22} />
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="mb-1 flex items-center gap-2">

                              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black text-indigo-600">
                                الوحدة{" "}
                                {moduleIndex + 1}
                              </span>

                              <span className="text-[11px] font-bold text-slate-400">
                                {module.subjects.length}{" "}
                                مقياس
                              </span>

                            </div>

                            <h3 className="truncate text-base font-black text-slate-900 sm:text-lg">
                              {module.name}
                            </h3>

                          </div>

                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-transform duration-200 ${
                              isExpanded
                                ? "rotate-180"
                                : ""
                            }`}
                          >
                            <ChevronDown size={19} />
                          </div>

                        </div>

                      </button>

                      {/* Subjects */}

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50/70 to-white p-4 sm:p-5">

                          {module.subjects.length ===
                          0 ? (

                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">

                              <BookMarked
                                size={24}
                                className="mx-auto text-slate-300"
                              />

                              <p className="mt-3 text-sm font-bold text-slate-500">
                                لا توجد مقاييس لهذه الوحدة
                              </p>

                            </div>

                          ) : (

                            <div className="grid gap-3">

                              {module.subjects.map(
                                (
                                  subject,
                                  subjectIndex
                                ) => (

                                  <div
                                    key={
                                      subject.id
                                    }
                                    className="group/subject flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/40 hover:shadow-md"
                                  >

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-indigo-50 text-indigo-600">
                                      <BookOpen
                                        size={
                                          17
                                        }
                                      />
                                    </div>

                                    <div className="min-w-0 flex-1">

                                      <div className="flex items-center gap-2">

                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-slate-100 px-1.5 text-[9px] font-black text-slate-500">
                                          {subjectIndex +
                                            1}
                                        </span>

                                        <h4 className="truncate text-sm font-black text-slate-800">
                                          {
                                            subject.name
                                          }
                                        </h4>

                                      </div>

                                      {subject.description && (
                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                                          {
                                            subject.description
                                          }
                                        </p>
                                      )}

                                    </div>

                                    {/* Lessons Button */}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openSubjectLessons(
                                          subject.id
                                        )
                                      }
                                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-black text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.97]"
                                    >
                                      <BookOpen
                                        size={15}
                                      />

                                      <span className="hidden sm:inline">
                                        الدروس
                                      </span>
                                    </button>

                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </div>
                      )}

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* Categories */}

        <section className="mt-8">

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">

            {categories.map(
              (category) => {

                const Icon =
                  category.icon;

                const active =
                  activeFilter ===
                  category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() =>
                      setActiveFilter(
                        category.id
                      )
                    }
                    className={`group min-h-[116px] rounded-[1.35rem] border p-4 text-right transition-all duration-200 active:scale-[0.98] ${
                      active
                        ? `${category.activeClass} shadow-sm`
                        : "border-slate-200/80 bg-white/80 shadow-[0_8px_25px_-20px_rgba(15,23,42,0.35)] hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-white hover:shadow-md"
                    }`}
                  >

                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
                        active
                          ? category.iconClass
                          : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                      }`}
                    >
                      <Icon size={19} />
                    </div>

                    <p
                      className={`text-sm font-black ${
                        active
                          ? "text-indigo-700"
                          : "text-slate-800"
                      }`}
                    >
                      {category.label}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-400">
                      {
                        category.description
                      }
                    </p>

                  </button>
                );
              }
            )}

          </div>

        </section>

        {/* Composer */}

        <section className="mt-6">

          {!showComposer ? (

            <button
              onClick={() =>
                setShowComposer(true)
              }
              className="group flex w-full items-center gap-4 rounded-[1.5rem] border border-indigo-100/80 bg-gradient-to-r from-indigo-50/80 via-white to-cyan-50/70 p-4 text-right shadow-[0_12px_35px_-28px_rgba(79,70,229,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md active:scale-[0.995]"
            >

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-indigo-500/15 transition-transform duration-200 group-hover:scale-105">
                <Plus size={22} />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-black text-slate-800">
                  شارك شيئًا مفيدًا
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  أضف درسًا، ملخصًا،
                  امتحانًا أو بحثًا أو
                  موضوعًا للمناقشة
                </p>

              </div>

              <div className="mr-auto hidden rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm sm:block">
                ابدأ المشاركة
              </div>

            </button>

          ) : (

            <div className="rounded-[1.75rem] border border-indigo-100 bg-white/80 p-3 shadow-sm backdrop-blur sm:p-4">

              <AcademicComposer
                semesterId={semester.id}
              />

              <button
                onClick={() =>
                  setShowComposer(false)
                }
                className="mt-3 rounded-xl px-3 py-2 text-xs font-bold text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-[0.97]"
              >
                إغلاق
              </button>

            </div>

          )}

        </section>

        {/* Posts */}

        <section className="mt-9">

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />

                <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {activeFilter ===
                  "all"
                    ? "المحتوى الأكاديمي"
                    : categories.find(
                        (item) =>
                          item.id ===
                          activeFilter
                      )?.label}
                </h2>

              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                محتوى خاص بهذا السداسي
              </p>

            </div>

            <div className="self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm sm:self-auto">
              {filteredPosts.length}{" "}
              محتوى
            </div>

          </div>

          {postsLoading ? (

            <div className="grid gap-5 md:grid-cols-2">

              <div className="h-80 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white" />

              <div className="h-80 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white" />

            </div>

          ) : filteredPosts.length ===
            0 ? (

            <div className="rounded-[2rem] border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-cyan-50/60 px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-2xl shadow-sm">

                {activeFilter ===
                "lesson"
                  ? "📚"
                  : activeFilter ===
                    "summary"
                  ? "📝"
                  : activeFilter ===
                    "exam"
                  ? "📄"
                  : activeFilter ===
                    "research_discussion"
                  ? "💬"
                  : "🎓"}

              </div>

              <h3 className="mt-5 text-lg font-black text-slate-800">
                لا يوجد محتوى بعد
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-400">
                كن أول من يشارك
                محتوى مفيدًا مع
                طلاب هذا السداسي.
              </p>

              <button
                onClick={() =>
                  setShowComposer(true)
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-md shadow-indigo-500/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
              >
                <Plus size={18} />
                إنشاء منشور
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {filteredPosts.map(
                (post) => (
                  <SemesterPostCard
                    key={post.id}
                    post={post}
                    onLike={
                      handleSemesterLike
                    }
                    onDelete={
                      handleSemesterDelete
                    }
                  />
                )
              )}

            </div>

          )}

        </section>

      </div>
    </div>
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
  onLike: (
    postId: string,
    likedByMe: boolean
  ) => Promise<void>;
  onDelete: (
    postId: string
  ) => Promise<void>;
}) {
  const [
    showComments,
    setShowComments,
  ] = useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  const typeConfig: Record<
    string,
    AcademicCardConfig
  > = {
    lesson: {
      label: "درس",
      Icon: BookOpen,
      iconClass:
        "bg-blue-100 text-blue-600",
      badgeClass:
        "border-blue-100 bg-blue-50 text-blue-700",
      cardClass:
        "border-blue-100 bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/40",
      accentClass:
        "bg-gradient-to-r from-blue-500 to-cyan-500",
    },

    summary: {
      label: "ملخص",
      Icon: FileText,
      iconClass:
        "bg-indigo-100 text-indigo-600",
      badgeClass:
        "border-indigo-100 bg-indigo-50 text-indigo-700",
      cardClass:
        "border-indigo-100 bg-gradient-to-br from-white via-indigo-50/50 to-violet-50/40",
      accentClass:
        "bg-gradient-to-r from-indigo-500 to-violet-500",
    },

    exam: {
      label: "امتحان",
      Icon: ClipboardCheck,
      iconClass:
        "bg-cyan-100 text-cyan-600",
      badgeClass:
        "border-cyan-100 bg-cyan-50 text-cyan-700",
      cardClass:
        "border-cyan-100 bg-gradient-to-br from-white via-cyan-50/50 to-blue-50/40",
      accentClass:
        "bg-gradient-to-r from-cyan-500 to-blue-500",
    },

    research_discussion: {
      label: "بحوث ومناقشات",
      Icon: MessageSquareText,
      iconClass:
        "bg-purple-100 text-purple-600",
      badgeClass:
        "border-purple-100 bg-purple-50 text-purple-700",
      cardClass:
        "border-purple-100 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/40",
      accentClass:
        "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
  };

  const config =
    post.academicType
      ? typeConfig[
          post.academicType
        ]
      : null;

  async function handleLike() {
    await onLike(
      post.id,
      post.likedByMe
    );
  }

  async function handleDelete() {
    if (deleteLoading) {
      return;
    }

    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المنشور؟\nلا يمكن التراجع عن هذه العملية."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);

      await onDelete(post.id);
    } catch (error) {
      console.error(
        "SEMESTER POST DELETE ERROR:",
        error
      );

      window.alert(
        "تعذر حذف المنشور. حاول مرة أخرى."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  const CardIcon =
    config?.Icon ?? GraduationCap;

  return (
    <article
      className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-28px_rgba(15,23,42,0.55)] active:scale-[0.995] ${
        config?.cardClass ??
        "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30"
      }`}
    >

      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          config?.accentClass ??
          "bg-gradient-to-r from-blue-500 to-indigo-500"
        }`}
      />

      <div className="flex flex-1 flex-col p-5 pt-6 sm:p-6 sm:pt-7">

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            {post.author.avatar ? (

              <img
                src={
                  post.author.avatar
                }
                alt=""
                className="h-11 w-11 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
              />

            ) : (

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-100 to-cyan-100 font-black text-indigo-600 shadow-sm">
                {post.author.name
                  ?.charAt(0)
                  ?.toUpperCase() ??
                  "U"}
              </div>

            )}

            <div className="min-w-0">

              <p className="truncate text-sm font-black text-slate-800">
                {
                  post.author
                    .name
                }
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-400">
                {post.createdAt}
              </p>

            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2">

            {config && (

              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black ${config.badgeClass}`}
              >
                <CardIcon size={13} />
                {config.label}
              </div>

            )}

            {post.isOwner && (

              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  deleteLoading
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-slate-500
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="حذف المنشور"
                title="حذف المنشور"
              >

                {deleteLoading ? (

                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />

                ) : (

                  <Trash2
                    size={18}
                    aria-hidden="true"
                  />

                )}

              </button>

            )}

          </div>

        </div>

        <div className="mt-6">

          <div className="flex items-center gap-2">

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                config?.iconClass ??
                "bg-indigo-100 text-indigo-600"
              }`}
            >
              <CardIcon size={17} />
            </div>

            <div>

              <p className="text-[11px] font-bold text-slate-400">
                محتوى أكاديمي
              </p>

              <h3 className="text-base font-black text-slate-900">
                {config?.label ??
                  "منشور أكاديمي"}
              </h3>

            </div>

          </div>

          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 sm:text-[15px]">
            {post.content}
          </p>

        </div>

        {post.images_urls &&
          post.images_urls.length >
            0 && (

            <div className="mt-5 grid gap-2 sm:grid-cols-2">

              {post.images_urls.map(
                (
                  image,
                  index
                ) => (

                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt=""
                    className="max-h-72 w-full rounded-2xl border border-white/80 object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                  />

                )
              )}

            </div>

          )}

        {(post.pdf_url ||
          post.pdf) && (

          <a
            href={
              post.pdf_url ??
              post.pdf ??
              undefined
            }
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 active:scale-[0.99]"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Paperclip size={18} />
            </div>

            <div className="min-w-0">

              <p className="text-sm font-black text-indigo-700">
                ملف PDF
              </p>

              <p className="mt-0.5 text-xs text-indigo-500">
                فتح الملف
              </p>

            </div>

          </a>

        )}

        <div className="flex-1" />

      </div>

      <div className="flex items-center gap-5 border-t border-slate-200/70 px-5 py-3 text-xs font-semibold text-slate-400 sm:px-6">

        <span className="transition-colors hover:text-rose-500">
          ❤️ {post.likes}
        </span>

        <span className="transition-colors hover:text-indigo-500">
          💬 {post.comments}
        </span>

      </div>

      <div className="border-t border-slate-200/70 bg-white/35">

        <PostActions
          postId={post.id}
          likedByMe={
            post.likedByMe
          }
          onLike={handleLike}
          showComments={
            showComments
          }
          onComment={() =>
            setShowComments(
              (previous) =>
                !previous
            )
          }
          onShare={() => {}}
        />

      </div>

      {showComments && (

        <div className="border-t border-slate-200/70 bg-slate-50/60">

          <CommentsList
            postId={post.id}
          />

        </div>

      )}

    </article>
  );
}

// ======================================================
// Page Provider
// ======================================================

export default function SemesterSpacePage() {
  return (
    <FeedProvider>
      <SemesterSpacePageContent />
    </FeedProvider>
  );
}