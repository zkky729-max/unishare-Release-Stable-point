import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Loader2,
  LockKeyhole,
  LogIn,
  UserPlus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";

import {
  getLessonById,
} from "../api/lessons";

import type {
  Lesson,
} from "../api/lessons";

export default function LessonDetailsPage() {
  const params =
    useParams<{ id: string }>();

  const id =
    params.id;

  const navigate =
    useNavigate();

  const [lesson, setLesson] =
    useState<Lesson | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    if (!id) {
      setError("معرف الدرس غير موجود.");
      setLoading(false);
      return;
    }

    async function loadLesson(lessonId: string) {
      try {
        setLoading(true);
        setError(null);

        const {
          data: {
            user,
          },
        } = await supabase.auth.getUser();

        /*
         * الزائر لا يتم جلب محتوى الدرس له.
         */
        if (!user) {
          setIsAuthenticated(false);
          setLesson(null);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);

        const data =
          await getLessonById(lessonId);

        if (!data) {
          setError(
            "لم يتم العثور على هذا الدرس."
          );
          setLesson(null);
          return;
        }

        setLesson(data);
      } catch (err) {
        console.error(
          "LOAD LESSON ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل الدرس."
        );

        setLesson(null);
      } finally {
        setLoading(false);
      }
    }

    loadLesson(id);
  }, [id]);

  function handleBack() {
    if (lesson?.subject_id) {
      navigate(
        `/subjects/${lesson.subject_id}/lessons`
      );
      return;
    }

    navigate(-1);
  }

  function handleRegister() {
    navigate("/register");
  }

  function handleLogin() {
    navigate("/login");
  }

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 p-6"
      >
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />

            <p className="text-sm text-slate-500">
              جاري تحميل الدرس...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * الزائر
   * =====================================================
   */

  if (!isAuthenticated) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50"
      >
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الدروس
          </button>

          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 px-6 py-8 text-white sm:px-8 lg:px-10">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <BookOpen className="h-7 w-7" />
                </div>

                <div className="min-w-0">

                  <p className="mb-2 text-sm font-medium text-white/80">
                    درس
                  </p>

                  <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                    محتوى الدرس
                  </h1>

                </div>

              </div>

            </div>

            {/* Body */}

            <div className="p-6 sm:p-8 lg:p-10">

              <section>

                <div className="mx-auto max-w-2xl rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 text-center sm:p-10">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <LockKeyhole className="h-8 w-8" />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    أنشئ حسابًا لمشاهدة الدرس
                  </h2>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                    محتوى هذا الدرس متاح للمستخدمين
                    المسجلين فقط. أنشئ حسابًا مجانيًا
                    أو سجّل الدخول للوصول إلى محتوى
                    الدرس.
                  </p>

                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={handleRegister}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4" />
                      إنشاء حساب
                    </button>

                    <button
                      type="button"
                      onClick={handleLogin}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <LogIn className="h-4 w-4" />
                      تسجيل الدخول
                    </button>

                  </div>

                </div>

              </section>

            </div>

          </article>

        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 p-6"
      >
        <div className="mx-auto max-w-4xl">

          <button
            type="button"
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الدروس
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-red-500" />

            <h1 className="text-xl font-bold text-red-700">
              تعذر تحميل الدرس
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error ??
                "لم يتم العثور على هذا الدرس."}
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
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

        {/* العودة */}

        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الدروس
        </button>

        {/* الدرس */}

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}

          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 px-6 py-8 text-white sm:px-8 lg:px-10">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <BookOpen className="h-7 w-7" />
              </div>

              <div className="min-w-0">

                <p className="mb-2 text-sm font-medium text-white/80">
                  درس
                </p>

                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                  {lesson.title}
                </h1>

              </div>

            </div>

          </div>

          {/* Body */}

          <div className="p-6 sm:p-8 lg:p-10">

            {/* الوصف */}

            {lesson.description && (
              <section className="mb-8">

                <div className="mb-3 flex items-center gap-2">

                  <div className="h-8 w-1 rounded-full bg-blue-600" />

                  <h2 className="text-lg font-bold text-slate-800">
                    وصف الدرس
                  </h2>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5">

                  <p className="text-sm leading-7 text-slate-600">
                    {lesson.description}
                  </p>

                </div>

              </section>
            )}

            {/* المحتوى */}

            <section>

              <div className="mb-4 flex items-center gap-2">

                <div className="h-8 w-1 rounded-full bg-indigo-600" />

                <h2 className="text-lg font-bold text-slate-800">
                  محتوى الدرس
                </h2>

              </div>

              {lesson.content ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                  <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
                    {lesson.content}
                  </div>

                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                  <p className="text-sm text-slate-500">
                    لا يوجد محتوى لهذا الدرس بعد.
                  </p>

                </div>
              )}

            </section>

            {/* التاريخ */}

            {lesson.created_at && (
              <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">

                <CalendarDays className="h-4 w-4" />

                <span>
                  تمت إضافة الدرس في{" "}
                  {new Date(
                    lesson.created_at
                  ).toLocaleDateString("ar-DZ")}
                </span>

              </div>
            )}

          </div>

        </article>

      </div>
    </div>
  );
}