
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  FileText,
  Loader2,
  Search,
  Trash2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";

import {
  deleteLesson,
  getLessonsBySubject,
} from "../api/lessons";

import type {
  Lesson,
} from "../api/lessons";

interface Subject {
  id: string;
  name: string;
  description?: string | null;
}

export default function LessonsPage() {
  const { subjectId } = useParams<{
    subjectId: string;
  }>();

  const navigate = useNavigate();

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [lessons, setLessons] =
    useState<Lesson[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [deletingLessonId, setDeletingLessonId] =
    useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) {
      setError("معرف المقياس غير موجود.");
      setLoading(false);
      return;
    }

    const id: string = subjectId;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [
          subjectResult,
          lessonsResult,
          userResult,
        ] = await Promise.all([
          supabase
            .from("subjects")
            .select("id, name, description")
            .eq("id", id)
            .maybeSingle(),

          getLessonsBySubject(id),

          supabase.auth.getUser(),
        ]);

        if (subjectResult.error) {
          throw subjectResult.error;
        }

        if (!subjectResult.data) {
          setError("لم يتم العثور على هذا المقياس.");
          setSubject(null);
          setLessons([]);
          return;
        }

        setSubject(
          subjectResult.data as Subject
        );

        setLessons(lessonsResult);

        const user = userResult.data.user;

        if (user) {
          setCurrentUserId(user.id);

          const {
            data: profile,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profileError) {
            console.error(
              "GET USER ROLE ERROR:",
              profileError
            );
          }

          setIsAdmin(
            profile?.role === "admin"
          );
        } else {
          setCurrentUserId(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error(
          "LOAD LESSONS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل الدروس."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [subjectId]);

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return lessons;
    }

    return lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(query) ||
        lesson.description?.toLowerCase().includes(query) ||
        lesson.content?.toLowerCase().includes(query)
    );
  }, [lessons, search]);

  function handleBack() {
    navigate(-1);
  }

  function openLesson(lessonId: string) {
    navigate(`/lessons/${lessonId}`);
  }

  function canDeleteLesson(lesson: Lesson) {
    return (
      isAdmin ||
      (
        !!currentUserId &&
        lesson.created_by === currentUserId
      )
    );
  }

  async function handleDeleteLesson(lesson: Lesson) {
    if (!canDeleteLesson(lesson)) {
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الدرس "${lesson.title}"؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingLessonId(lesson.id);

      await deleteLesson(lesson.id);

      setLessons((current) =>
        current.filter(
          (item) => item.id !== lesson.id
        )
      );
    } catch (err) {
      console.error(
        "DELETE LESSON ERROR:",
        err
      );

      window.alert(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء حذف الدرس."
      );
    } finally {
      setDeletingLessonId(null);
    }
  }

  const background = (
    <>
      <div className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 top-[450px] h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/3 top-[900px] h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />
    </>
  );

  if (loading) {
    return (
      <div
        dir="rtl"
        className="relative min-h-screen overflow-hidden bg-[#050816] text-white"
      >
        {background}

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/60 px-12 py-12 text-center shadow-2xl shadow-blue-950/30 backdrop-blur-2xl">
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-blue-500/20 to-violet-500/20">
              <div className="absolute inset-0 animate-pulse rounded-3xl bg-cyan-400/10 blur-xl" />
              <Loader2 className="relative h-9 w-9 animate-spin text-cyan-300" />
            </div>

            <p className="text-base font-bold text-white">
              جاري فتح المكتبة المعرفية
            </p>

            <p className="mt-2 text-xs text-slate-400">
              يتم تجهيز المحتوى الأكاديمي...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-8 text-white"
      >
        {background}

        <div className="relative mx-auto max-w-6xl">
          <button
            type="button"
            onClick={handleBack}
            className="mb-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            العودة
          </button>

          <div className="rounded-[2rem] border border-red-400/20 bg-slate-900/70 p-9 text-center shadow-2xl backdrop-blur-2xl sm:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-500/10">
              <BookOpen className="h-10 w-10 text-red-400" />
            </div>

            <h1 className="text-2xl font-extrabold text-white">
              تعذر فتح المكتبة
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5"
            >
              <ArrowRight className="h-4 w-4" />
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#050816] text-white selection:bg-cyan-400/30"
    >
      {background}

      <div className="relative mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

        {/* شريط التنقل */}

        <div className="mb-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white"
          >
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            العودة
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-bold text-cyan-200 sm:inline-flex">
            <Sparkles className="h-4 w-4" />
            UniShare Knowledge Library
          </div>
        </div>

        {/* واجهة المكتبة */}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#101b3c] via-[#111638] to-[#21133e] shadow-2xl shadow-blue-950/30">

          {/* الإضاءة والزخارف */}

          <div className="pointer-events-none absolute -left-24 -top-32 h-96 w-96 rounded-full border border-cyan-300/10" />
          <div className="pointer-events-none absolute -left-12 -top-20 h-72 w-72 rounded-full border border-blue-300/10" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-[100px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 bg-violet-500/10 blur-[100px]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(125,211,252,0.8) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1fr_260px] lg:items-center lg:px-11 lg:py-12">

            <div className="min-w-0">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2 text-xs font-bold tracking-wide text-cyan-200 backdrop-blur-xl">
                <Sparkles className="h-4 w-4" />
                KNOWLEDGE ARCHIVE · 2050
              </div>

              <div className="flex items-start gap-4">

                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 shadow-lg shadow-cyan-950/20 sm:h-20 sm:w-20">
                  <div className="absolute inset-0 rounded-2xl bg-cyan-300/10 blur-xl" />
                  <BookOpen className="relative h-8 w-8 text-cyan-200 sm:h-10 sm:w-10" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="mb-2 text-sm font-medium text-cyan-200/80">
                    المكتبة المعرفية الرقمية
                  </p>

                  <h1 className="break-words text-2xl font-black leading-tight text-[#67E8F9] drop-shadow-[0_0_18px_rgba(103,232,249,0.25)] sm:text-3xl lg:text-4xl">
                    {subject?.name ?? "المكتبة التعليمية"}
                  </h1>

                  {subject?.description && (
                    <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
                      {subject.description}
                    </p>
                  )}

                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10">
                    <FileText className="h-4 w-4 text-cyan-300" />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      إجمالي الملفات
                    </p>
                    <p className="text-lg font-extrabold tabular-nums text-white">
                      {lessons.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-400/10">
                    <GraduationCap className="h-4 w-4 text-violet-300" />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      نوع المكتبة
                    </p>
                    <p className="text-sm font-bold text-white">
                      أكاديمية
                    </p>
                  </div>
                </div>

                {search && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10">
                      <Search className="h-4 w-4 text-blue-300" />
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-400">
                        نتائج البحث
                      </p>
                      <p className="text-lg font-extrabold text-white">
                        {filteredLessons.length}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* رمز المكتبة الهولوغرافي */}

            <div className="relative mx-auto hidden h-60 w-60 items-center justify-center lg:flex">

              <div className="absolute inset-0 animate-[spin_35s_linear_infinite] rounded-full border border-dashed border-cyan-300/20" />

              <div className="absolute inset-5 rounded-full border border-blue-300/20" />

              <div className="absolute inset-10 rounded-full border border-violet-300/20" />

              <div className="absolute inset-14 rounded-full bg-gradient-to-br from-cyan-400/10 to-violet-500/10 blur-xl" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 shadow-[0_0_45px_rgba(34,211,238,0.15)] backdrop-blur-xl">
                <BookOpen className="h-14 w-14 text-cyan-200" />
              </div>

              <div className="absolute right-7 top-8 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
              <div className="absolute bottom-9 left-7 h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.9)]" />
              <div className="absolute left-5 top-1/2 h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_15px_rgba(147,197,253,0.9)]" />
            </div>

          </div>
        </section>

        {/* مساحة إعلانية */}

        <section className="group relative mb-9 overflow-hidden rounded-2xl border border-dashed border-cyan-400/20 bg-gradient-to-l from-blue-950/40 via-slate-900/50 to-violet-950/30 p-5 backdrop-blur-xl sm:p-6">

          <div className="pointer-events-none absolute -left-12 top-0 h-32 w-32 rounded-full bg-cyan-400/5 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/10" />

          <div className="relative flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-right">

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-400/10 text-cyan-300">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  مساحة الإعلانات المعرفية
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  مساحة مخصصة للشركاء والمبادرات الأكاديمية
                </p>
              </div>
            </div>

            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-[10px] font-bold tracking-widest text-cyan-200">
              KNOWLEDGE SPACE
            </span>

          </div>
        </section>

        {/* منطقة البحث */}

        {lessons.length > 0 && (
          <section className="mb-9">

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]" />
                  EXPLORE THE ARCHIVE
                </div>

                <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                  استكشف المعرفة
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  ابحث داخل أرشيف الدروس والمحتوى الأكاديمي
                </p>
              </div>

              <span className="hidden rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-400 sm:inline-flex">
                {filteredLessons.length} عنصر معروض
              </span>

            </div>

            <div className="group relative">

              <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-violet-500/20 opacity-0 blur transition duration-300 group-focus-within:opacity-100" />

              <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#0b1226]/90 shadow-xl shadow-black/10 transition-colors group-focus-within:border-cyan-400/30">

                <Search className="pointer-events-none absolute right-4 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-cyan-300" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="ابحث عن عنوان الدرس أو محتواه..."
                  className="w-full bg-transparent py-4 pe-12 ps-16 text-sm font-medium text-white outline-none placeholder:text-slate-500"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute left-4 rounded-lg px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/10"
                  >
                    مسح
                  </button>
                )}

              </div>
            </div>
          </section>
        )}

        {/* لا توجد دروس */}

        {lessons.length === 0 && (
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/50 px-6 py-14 text-center shadow-2xl backdrop-blur-xl sm:px-12">

            <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[90px]" />

            <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-blue-500/15 to-violet-500/15 shadow-[0_0_40px_rgba(59,130,246,0.10)]">
              <BookOpen className="h-11 w-11 text-cyan-300" />
            </div>

            <div className="relative mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-2 text-xs font-bold text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              KNOWLEDGE ARCHIVE
            </div>

            <h2 className="relative text-xl font-extrabold text-white sm:text-2xl">
              المكتبة لا تزال في انتظار محتواها
            </h2>

            <p className="relative mx-auto mt-4 max-w-lg text-sm leading-8 text-slate-400">
              لم تتم إضافة أي درس لهذا المقياس حتى الآن.
              ستظهر المواد التعليمية هنا بمجرد نشرها.
            </p>

            <div className="relative mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            <p className="relative mt-5 text-xs text-slate-500">
              مساحة مخصصة للمعرفة والتعلم الأكاديمي
            </p>

          </section>
        )}

        {/* لا توجد نتائج */}

        {lessons.length > 0 &&
          filteredLessons.length === 0 && (
            <section className="rounded-[2rem] border border-white/10 bg-slate-900/50 px-6 py-12 text-center shadow-xl backdrop-blur-xl sm:px-12">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
                <Search className="h-9 w-9 text-slate-500" />
              </div>

              <h2 className="text-xl font-extrabold text-white">
                لم نعثر على نتائج
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                جرّب استخدام كلمات مختلفة للبحث داخل المكتبة.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400/15"
              >
                عرض جميع الدروس
              </button>

            </section>
          )}

        {/* أرشيف الدروس */}

        {filteredLessons.length > 0 && (
          <section>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]" />
                  DIGITAL KNOWLEDGE COLLECTION
                </div>

                <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                  أرشيف الدروس
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  مجموعة الموارد التعليمية الخاصة بهذا المقياس
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-2.5 text-xs font-bold text-cyan-200">
                <BookOpen className="h-4 w-4" />
                {filteredLessons.length} ملف معرفي
              </div>

            </div>

            {/* شبكة المكتبة */}

            <div className="grid gap-4 md:grid-cols-2">

              {filteredLessons.map((lesson, index) => (
                <article
                  key={lesson.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-[#0b1022]/95 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-blue-950/30 sm:p-6"
                >

                  {/* إضاءة البطاقة */}

                  <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/0 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/10" />

                  <div className="pointer-events-none absolute right-0 top-0 h-px w-0 bg-gradient-to-l from-cyan-300 via-blue-400 to-violet-400 transition-all duration-500 group-hover:w-full" />

                  <div className="relative z-10">
                    <div className="mb-5 flex items-start justify-between gap-3">

                      <button
                        type="button"
                        onClick={() => openLesson(lesson.id)}
                        className="flex min-w-0 items-center gap-3 text-right"
                      >

                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-cyan-200 shadow-lg shadow-blue-950/20 transition-all duration-300 group-hover:border-cyan-300/40 group-hover:shadow-cyan-500/10">
                          <div className="absolute inset-0 rounded-2xl bg-cyan-300/0 blur-xl transition group-hover:bg-cyan-300/10" />
                          <FileText className="relative h-7 w-7" />
                        </div>

                        <div className="min-w-0">
                          <span className="mb-1 block text-[10px] font-bold tracking-widest text-cyan-300/80">
                            KNOWLEDGE FILE
                          </span>

                          <span className="block text-xs font-semibold text-slate-400">
                            مرجع تعليمي
                          </span>
                        </div>

                      </button>

                      <div className="flex shrink-0 items-center gap-2">

                        <span className="rounded-lg border border-violet-300/15 bg-violet-400/[0.07] px-2.5 py-1.5 text-[10px] font-bold text-violet-200">
                          #{String(index + 1).padStart(2, "0")}
                        </span>

                        {canDeleteLesson(lesson) && (
                          <button
                            type="button"
                            disabled={
                              deletingLessonId === lesson.id
                            }
                            onClick={() =>
                              handleDeleteLesson(lesson)
                            }
                            title="حذف الدرس"
                            aria-label="حذف الدرس"
                            className="rounded-lg border border-red-400/15 bg-red-500/[0.06] p-2 text-red-300 transition hover:border-red-400/30 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingLessonId === lesson.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}

                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openLesson(lesson.id)}
                      className="block w-full text-right"
                    >

                      <h3 className="break-words text-lg font-extrabold leading-8 text-[#67E8F9] drop-shadow-[0_0_12px_rgba(103,232,249,0.20)] transition-colors duration-300 group-hover:text-white">
                        {lesson.title}
                      </h3>

                      {lesson.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-400">
                          {lesson.description}
                        </p>
                      )}

                    </button>

                    <div className="my-5 h-px bg-gradient-to-l from-cyan-400/20 via-white/10 to-transparent" />

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <div className="flex flex-wrap items-center gap-3">

                        {lesson.created_at && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <CalendarDays className="h-3.5 w-3.5 text-blue-300" />
                            {new Date(
                              lesson.created_at
                            ).toLocaleDateString("ar-DZ")}
                          </span>
                        )}

                        {lesson.content && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400/10 bg-blue-400/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-blue-200">
                            <FileText className="h-3 w-3" />
                            يحتوي على محتوى
                          </span>
                        )}

                      </div>

                      <button
                        type="button"
                        onClick={() => openLesson(lesson.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-2 text-xs font-bold text-cyan-200 transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-400/15"
                      >
                        فتح الملف
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      </button>

                    </div>

                  </div>
                </article>
              ))}

            </div>
          </section>
        )}

        {/* تذييل المكتبة */}

        {lessons.length > 0 && (
          <footer className="mt-12 border-t border-white/[0.07] pt-7 text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-500">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              UniShare · Knowledge Beyond Boundaries
            </div>

            <p className="mt-3 text-[10px] tracking-widest text-slate-600">
              DIGITAL ACADEMIC LIBRARY · 2050
            </p>

          </footer>
        )}

      </div>
    </div>
  );
}
