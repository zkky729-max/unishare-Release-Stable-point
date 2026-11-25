
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  GraduationCap,
  Loader2,
  Sparkles,
  Orbit,
  Layers3,
} from "lucide-react";

import {
  getSemestersByLevel,
} from "../api/semesters";

import type {
  Semester,
} from "../types";

export default function Semesters() {
  const {
    levelId,
  } = useParams<{
    levelId: string;
  }>();

  const navigate = useNavigate();

  const [
    semesters,
    setSemesters,
  ] = useState<Semester[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!levelId) {
      setError("معرف السنة غير موجود.");
      setLoading(false);
      return;
    }

    async function loadSemesters(id: string) {
      try {
        setLoading(true);
        setError(null);

        const data = await getSemestersByLevel(id);

        setSemesters(data ?? []);
      } catch (err) {
        console.error("ERROR LOADING SEMESTERS:", err);

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل السداسيات."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSemesters(levelId);
  }, [levelId]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8ff] px-4"
      >
        <div className="absolute -right-20 top-10 h-72 w-72 animate-pulse rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 animate-pulse rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative w-full max-w-md rounded-[2rem] border border-indigo-100 bg-white/90 p-10 text-center shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
            <Loader2
              size={34}
              className="animate-spin"
            />
          </div>

          <h2 className="mt-6 text-xl font-black text-slate-900">
            جاري تحميل السداسيات...
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            نحضّر لك المساحة الأكاديمية الخاصة بهذه السنة.
          </p>

          <div className="mx-auto mt-6 h-1.5 max-w-[180px] overflow-hidden rounded-full bg-indigo-100">
            <div className="h-full w-1/2 animate-[loadingBar_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
          </div>
        </div>

        <style>{`
          @keyframes loadingBar {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-200%); }
          }
        `}</style>
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <div
        dir="rtl"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8ff] px-4 py-10"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-200/20 blur-3xl" />

        <div className="relative w-full max-w-xl rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/30 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-orange-100 text-red-500">
            <CalendarDays size={30} />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            تعذر تحميل السداسيات
          </h2>

          <p className="mt-3 break-words text-sm leading-7 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95"
          >
            <ArrowLeft size={18} />
            العودة
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // Main
  // =====================================================

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#f5f8ff] px-4 py-7 sm:px-6 sm:py-9 lg:px-8"
    >
      {/* Background Decoration */}

      <div className="pointer-events-none absolute -right-40 top-20 h-[450px] w-[450px] animate-pulse rounded-full bg-blue-300/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-40 top-[500px] h-[450px] w-[450px] animate-pulse rounded-full bg-violet-300/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Back */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-2.5 text-sm font-bold text-slate-500 transition-all duration-300 hover:border-indigo-100 hover:bg-white hover:text-indigo-600 hover:shadow-md active:scale-95"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          العودة
        </button>

        {/* Hero */}

        <section className="group/hero relative mb-9 overflow-hidden rounded-[2rem] border border-indigo-100/80 bg-gradient-to-br from-[#eef2ff] via-white to-[#e8faff] p-6 shadow-[0_20px_60px_-35px_rgba(79,70,229,0.35)] sm:p-9 lg:p-11">

          {/* Animated Background */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl transition-transform duration-1000 group-hover/hero:scale-125" />

          <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl transition-transform duration-1000 group-hover/hero:scale-125" />

          <div className="pointer-events-none absolute right-1/2 top-0 h-full w-px rotate-12 bg-gradient-to-b from-transparent via-indigo-200/30 to-transparent" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0">

              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Sparkles size={15} />
                </span>

                <span className="text-xs font-black tracking-wide text-indigo-600">
                  UNISHARE ACADEMIC NETWORK
                </span>
              </div>

              <div className="flex items-center gap-4">

                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25 transition-transform duration-500 hover:rotate-6 hover:scale-110">
                  <GraduationCap size={31} />

                  <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-cyan-400 opacity-60" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-cyan-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-indigo-600">
                    السنة الدراسية
                  </p>

                  <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    السداسيات
                  </h1>
                </div>

              </div>

              <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">
                اكتشف الفضاء الأكاديمي لكل سداسي، وتابع
                الدروس والملخصات والامتحانات والمحتوى
                العلمي الذي يشاركه الطلبة.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
                  <Layers3 size={14} />
                  المسار الأكاديمي
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/80 px-4 py-2 text-xs font-bold text-cyan-700 shadow-sm backdrop-blur">
                  <BookOpen size={14} />
                  محتوى علمي منظم
                </span>
              </div>

            </div>

            {/* Counter */}

            <div className="relative flex w-full shrink-0 items-center gap-5 overflow-hidden rounded-[1.75rem] border border-white bg-white/75 p-5 shadow-lg shadow-indigo-100/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:w-fit sm:min-w-[220px] sm:p-6">

              <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 opacity-70 blur-2xl" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                <CalendarDays size={25} />
              </div>

              <div className="relative">
                <div className="text-3xl font-black tabular-nums text-slate-900">
                  {semesters.length.toString().padStart(2, "0")}
                </div>

                <div className="mt-1 text-xs font-bold text-slate-500">
                  السداسيات المتاحة
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Section Heading */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />

              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                اختر السداسي
              </h2>
            </div>

            <p className="mt-2 pr-3 text-xs leading-6 text-slate-500 sm:text-sm">
              اضغط على إحدى البطاقات للدخول إلى فضائها الأكاديمي.
            </p>
          </div>

          {semesters.length > 0 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-black text-indigo-600 shadow-sm">
              <Orbit size={15} />
              {semesters.length} سداسي
            </div>
          )}

        </div>

        {/* Empty */}

        {semesters.length === 0 ? (
          <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-cyan-50/80 px-6 py-16 text-center shadow-sm">

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/20 blur-3xl" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-indigo-100 to-cyan-100 text-indigo-600 shadow-inner">
              <CalendarDays size={34} />
            </div>

            <h2 className="relative mt-6 text-xl font-black text-slate-900">
              لا توجد سداسيات بعد
            </h2>

            <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              لم تتم إضافة سداسيات مرتبطة بهذه السنة الدراسية
              حاليًا. ستظهر هنا بمجرد إضافتها إلى الهيكل الأكاديمي.
            </p>

          </div>
        ) : (

          /* Semesters */

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {semesters.map((semester, index) => {

              const number = semester.semester_number || index + 1;

              const themes = [
                {
                  icon: "from-blue-500 to-cyan-500",
                  glow: "bg-blue-400/20",
                  soft: "from-blue-50 to-cyan-50",
                  border: "hover:border-blue-200",
                  text: "group-hover:text-blue-700",
                  badge: "bg-blue-50 text-blue-700 border-blue-100",
                  accent: "from-blue-500 via-cyan-500 to-indigo-500",
                  shadow: "hover:shadow-blue-200/60",
                },
                {
                  icon: "from-violet-500 to-indigo-600",
                  glow: "bg-violet-400/20",
                  soft: "from-violet-50 to-indigo-50",
                  border: "hover:border-violet-200",
                  text: "group-hover:text-violet-700",
                  badge: "bg-violet-50 text-violet-700 border-violet-100",
                  accent: "from-violet-500 via-purple-500 to-indigo-500",
                  shadow: "hover:shadow-violet-200/60",
                },
                {
                  icon: "from-cyan-500 to-teal-500",
                  glow: "bg-cyan-400/20",
                  soft: "from-cyan-50 to-teal-50",
                  border: "hover:border-cyan-200",
                  text: "group-hover:text-cyan-700",
                  badge: "bg-cyan-50 text-cyan-700 border-cyan-100",
                  accent: "from-cyan-500 via-teal-500 to-blue-500",
                  shadow: "hover:shadow-cyan-200/60",
                },
              ];

              const theme = themes[index % themes.length];

              return (
                <button
                  key={semester.id}
                  type="button"
                  onClick={() => {
                    console.log(
                      "OPEN SEMESTER:",
                      semester.id,
                      semester.name
                    );

                    navigate(`/semesters/${semester.id}`);
                  }}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  className={`group relative isolate min-h-[255px] overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-white p-6 text-right shadow-[0_12px_35px_-25px_rgba(15,23,42,0.3)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] ${theme.border} ${theme.shadow} animate-[cardEnter_0.65s_ease-out_both]`}
                >

                  {/* Animated Accent */}

                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.accent}`} />

                  {/* Animated Glow */}

                  <div className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full ${theme.glow} blur-3xl transition-all duration-700 group-hover:scale-[1.8] group-hover:opacity-100`} />

                  <div className={`pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full ${theme.glow} opacity-40 blur-3xl transition-all duration-700 group-hover:scale-150`} />

                  {/* Moving Light */}

                  <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[130%] group-hover:opacity-100" />

                  {/* Card Content */}

                  <div className="relative">

                    <div className="flex items-start justify-between">

                      <div className={`relative flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-gradient-to-br ${theme.icon} text-white shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-xl`}>

                        <BookOpen size={29} />

                        <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-white/90 opacity-0 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100" />

                      </div>

                      <div className={`rounded-xl border px-3.5 py-2 text-xs font-black tabular-nums transition-all duration-300 group-hover:scale-105 ${theme.badge}`}>
                        S{String(number).padStart(2, "0")}
                      </div>

                    </div>

                    <div className="mt-7">

                      <div className="mb-2 flex items-center gap-2">
                        <Sparkles
                          size={14}
                          className="text-indigo-400 transition-transform duration-500 group-hover:rotate-180"
                        />

                        <span className="text-[11px] font-bold tracking-wide text-slate-400">
                          الفضاء الأكاديمي
                        </span>
                      </div>

                      <h3 className={`text-xl font-black text-slate-900 transition-colors duration-300 sm:text-2xl ${theme.text}`}>
                        {semester.name}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        اكتشف الدروس والملخصات والامتحانات
                        الخاصة بهذا السداسي.
                      </p>

                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                      <span className="text-sm font-black text-indigo-600 transition-all duration-300 group-hover:translate-x-[-3px]">
                        فتح السداسي
                      </span>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-indigo-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/25">
                        <ChevronLeft
                          size={19}
                          className="transition-transform duration-300 group-hover:-translate-x-0.5"
                        />
                      </div>

                    </div>

                  </div>

                </button>
              );
            })}

          </div>
        )}

        {/* Footer */}

        <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-indigo-100/70 py-7 text-center">
          <div className="flex items-center gap-2 text-indigo-500">
            <Sparkles size={15} />
            <span className="text-xs font-black tracking-wide">
              UNISHARE ACADEMIC NETWORK
            </span>
          </div>

          <p className="text-xs text-slate-400">
            تعلّم، شارك، وتقدّم مع مجتمعك الأكاديمي.
          </p>
        </div>

      </div>

      <style>{`
        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
