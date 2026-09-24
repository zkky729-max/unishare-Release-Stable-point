import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  FileText,
  Loader2,
  Search,
  Trash2,
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
  const {
    subjectId,
  } = useParams<{
    subjectId: string;
  }>();

  const navigate =
    useNavigate();

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
      setError(
        "معرف المقياس غير موجود."
      );
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
            .select(
              "id, name, description"
            )
            .eq("id", id)
            .maybeSingle(),

          getLessonsBySubject(id),

          supabase.auth.getUser(),
        ]);

        if (subjectResult.error) {
          throw subjectResult.error;
        }

        if (!subjectResult.data) {
          setError(
            "لم يتم العثور على هذا المقياس."
          );
          setSubject(null);
          setLessons([]);
          return;
        }

        setSubject(
          subjectResult.data as Subject
        );

        setLessons(
          lessonsResult
        );

        const user =
          userResult.data.user;

        if (user) {
          setCurrentUserId(
            user.id
          );

          const {
            data: profile,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select("role")
            .eq(
              "user_id",
              user.id
            )
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

  const filteredLessons =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return lessons;
      }

      return lessons.filter(
        (lesson) =>
          lesson.title
            .toLowerCase()
            .includes(query) ||
          lesson.description
            ?.toLowerCase()
            .includes(query) ||
          lesson.content
            ?.toLowerCase()
            .includes(query)
      );
    },
    [lessons, search]);

  function handleBack() {
    navigate(-1);
  }

  function openLesson(
    lessonId: string
  ) {
    navigate(
      `/lessons/${lessonId}`
    );
  }

  function canDeleteLesson(
    lesson: Lesson
  ) {
    return (
      isAdmin ||
      (
        !!currentUserId &&
        lesson.created_by ===
          currentUserId
      )
    );
  }

  async function handleDeleteLesson(
    lesson: Lesson
  ) {
    if (!canDeleteLesson(lesson)) {
      return;
    }

    const confirmed =
      window.confirm(
        `هل أنت متأكد من حذف الدرس "${lesson.title}"؟`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingLessonId(
        lesson.id
      );

      await deleteLesson(
        lesson.id
      );

      setLessons(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              lesson.id
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

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50"
      >
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4">
          <div className="rounded-3xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
            <Loader2 className="mx-auto mb-4 h-9 w-9 animate-spin text-blue-600" />

            <p className="text-sm font-medium text-slate-600">
              جاري تحميل الدروس...
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
        className="min-h-screen bg-slate-50 p-6"
      >
        <div className="mx-auto max-w-5xl">

          <button
            type="button"
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowRight className="h-4 w-4" />
            العودة
          </button>

          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-red-500" />

            <h1 className="text-xl font-bold text-red-700">
              تعذر تحميل الدروس
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* العودة */}

        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowRight className="h-4 w-4" />
          العودة
        </button>

        {/* Header */}

        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg">

          <div className="px-6 py-8 sm:px-8 lg:px-10">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <BookOpen className="h-7 w-7" />
              </div>

              <div className="min-w-0 flex-1">

                <p className="mb-2 text-sm font-medium text-white/80">
                  دروس المقياس
                </p>

                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                  {subject?.name ?? "الدروس"}
                </h1>

                {subject?.description && (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
                    {subject.description}
                  </p>
                )}

              </div>

            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">

              <div className="rounded-xl bg-white/10 px-4 py-2 text-sm">
                <span className="font-bold">
                  {lessons.length}
                </span>{" "}
                درس
              </div>

              {search && (
                <div className="rounded-xl bg-white/10 px-4 py-2 text-sm">
                  <span className="font-bold">
                    {filteredLessons.length}
                  </span>{" "}
                  نتيجة
                </div>
              )}

            </div>

          </div>

        </section>

        {/* البحث */}

        {lessons.length > 0 && (
          <div className="mb-6">

            <div className="relative">

              <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="ابحث عن درس..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pe-12 ps-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>
        )}

        {/* لا توجد دروس */}

        {lessons.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              لا توجد دروس بعد
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              لم تتم إضافة أي درس لهذا المقياس حتى الآن.
            </p>

          </div>
        )}

        {/* لا توجد نتائج بحث */}

        {lessons.length > 0 &&
          filteredLessons.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="h-8 w-8 text-slate-400" />
              </div>

              <h2 className="text-xl font-bold text-slate-800">
                لا توجد نتائج
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                لم يتم العثور على درس يطابق بحثك.
              </p>

            </div>
          )}

        {/* قائمة الدروس */}

        {filteredLessons.length > 0 && (
          <section>

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  قائمة الدروس
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  اختر درسًا لعرض محتواه بالتفصيل.
                </p>
              </div>

            </div>

            <div className="grid gap-4">

              {filteredLessons.map(
                (
                  lesson,
                  index
                ) => (
                  <div
                    key={lesson.id}
                    className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                  >

                    <div className="flex items-start gap-4">

                      <button
                        type="button"
                        onClick={() =>
                          openLesson(
                            lesson.id
                          )
                        }
                        className="flex min-w-0 flex-1 items-start gap-4 text-right"
                      >

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                          <FileText className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="mb-2 flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <p className="mb-1 text-xs font-medium text-blue-600">
                                الدرس {index + 1}
                              </p>

                              <h3 className="text-lg font-bold text-slate-800 transition group-hover:text-blue-700">
                                {lesson.title}
                              </h3>

                            </div>

                            <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition group-hover:-translate-x-1 group-hover:text-blue-600" />

                          </div>

                          {lesson.description && (
                            <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-500">
                              {lesson.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">

                            {lesson.created_at && (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4" />

                                {new Date(
                                  lesson.created_at
                                ).toLocaleDateString(
                                  "ar-DZ"
                                )}
                              </span>
                            )}

                            {lesson.content && (
                              <span className="inline-flex items-center gap-1.5">
                                <FileText className="h-4 w-4" />
                                يحتوي على محتوى
                              </span>
                            )}

                          </div>

                        </div>

                      </button>

                      {canDeleteLesson(
                        lesson
                      ) && (
                        <button
                          type="button"
                          disabled={
                            deletingLessonId ===
                            lesson.id
                          }
                          onClick={() =>
                            handleDeleteLesson(
                              lesson
                            )
                          }
                          title="حذف الدرس"
                          className="shrink-0 rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingLessonId ===
                          lesson.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

          </section>
        )}

      </div>
    </div>
  );
}