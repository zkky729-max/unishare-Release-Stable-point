import {
  Building2,
  GraduationCap,
  ArrowLeft,
  Sparkles,
  Network,
  BookOpen,
  Landmark,
  Orbit,
  Stars,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getFaculties,
  getFacultiesByUniversity,
} from "../api/faculties";

interface Faculty {
  id: string;
  name: string;
}

const facultyStyles = [
  {
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    glow: "bg-blue-400/20",
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
    border: "hover:border-blue-300 dark:hover:border-blue-500/40",
    decoration: "text-blue-400/20",
  },
  {
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    glow: "bg-violet-400/20",
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    border: "hover:border-violet-300 dark:hover:border-violet-500/40",
    decoration: "text-violet-400/20",
  },
  {
    gradient: "from-cyan-600 via-sky-600 to-blue-600",
    glow: "bg-cyan-400/20",
    icon: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
    border: "hover:border-cyan-300 dark:hover:border-cyan-500/40",
    decoration: "text-cyan-400/20",
  },
  {
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    glow: "bg-emerald-400/20",
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    border: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
    decoration: "text-emerald-400/20",
  },
  {
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    glow: "bg-orange-400/20",
    icon: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
    border: "hover:border-orange-300 dark:hover:border-orange-500/40",
    decoration: "text-orange-400/20",
  },
  {
    gradient: "from-pink-600 via-rose-600 to-fuchsia-600",
    glow: "bg-pink-400/20",
    icon: "bg-pink-500/10 text-pink-600 dark:text-pink-300",
    border: "hover:border-pink-300 dark:hover:border-pink-500/40",
    decoration: "text-pink-400/20",
  },
];

export default function Faculties() {
  const { universityId } = useParams();

  const navigate = useNavigate();

  const [faculties, setFaculties] =
    useState<Faculty[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadFaculties() {
      try {
        setLoading(true);

        let data: Faculty[];

        if (universityId) {
          data = await getFacultiesByUniversity(universityId);
          console.log("Faculties by university:", data);
        } else {
          data = await getFaculties();
          console.log("All Faculties:", data);
        }

        setFaculties(data || []);
      } catch (error) {
        console.error("Faculties loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadFaculties();
  }, [universityId]);

  const openFacultyDepartments = (facultyId: string) => {
    navigate(`/departments?facultyId=${facultyId}`);
  };

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950"
      >
        <div className="text-center">
          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-xl shadow-blue-500/20">
            <GraduationCap size={30} />
            <span className="absolute -inset-2 animate-ping rounded-3xl border border-blue-400/20" />
          </div>

          <p className="font-bold text-slate-700 dark:text-slate-200">
            جاري تحميل الكليات...
          </p>

          <p className="mt-2 text-sm text-slate-400">
            نجهز لك البنية الأكاديمية
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-slate-50 px-3 py-6 sm:px-6 sm:py-8 lg:px-8 dark:bg-slate-950"
    >
      <style>{`
        @keyframes faculty-enter {
          0% {
            opacity: 0;
            transform: translateY(35px) scale(0.96);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes faculty-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes faculty-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes faculty-shimmer {
          0% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(-120%);
          }
        }

        .faculty-card-enter {
          opacity: 0;
          animation: faculty-enter 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .faculty-icon-float {
          animation: faculty-float 4s ease-in-out infinite;
        }

        .faculty-orbit {
          animation: faculty-orbit 18s linear infinite;
        }

        .faculty-card-shimmer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          border-radius: inherit;
        }

        .faculty-card-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.10),
            transparent
          );
          transform: translateX(120%);
          opacity: 0;
        }

        .faculty-card:hover .faculty-card-shimmer::after {
          opacity: 1;
          animation: faculty-shimmer 1s ease-in-out;
        }

        .faculty-card:hover .faculty-icon-float {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .faculty-card-enter,
          .faculty-icon-float,
          .faculty-orbit {
            animation: none !important;
            opacity: 1;
            transform: none;
            filter: none;
          }

          .faculty-card,
          .faculty-card * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl space-y-8">

        {/* HERO */}
        <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-l from-blue-700 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/10 sm:p-9 lg:p-11">

          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="pointer-events-none absolute left-10 top-8 opacity-20 faculty-orbit">
            <Orbit size={100} strokeWidth={0.7} />
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-blue-100 backdrop-blur-md">
                <Sparkles size={15} />
                UniShare Academic Network
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                الكليات
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-8 text-blue-100 sm:text-base">
                اكتشف الكليات والمؤسسات الأكاديمية، واستكشف أقسامها وتخصصاتها ضمن شبكة جامعية مترابطة.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90 sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                  <Landmark size={16} />
                  مؤسسات جامعية
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                  <Network size={16} />
                  بنية أكاديمية
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                  <BookOpen size={16} />
                  تخصصات علمية
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:ml-6">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-[35px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md sm:h-44 sm:w-44">
                <div className="absolute inset-3 rounded-[28px] border border-dashed border-white/20 faculty-orbit" />
                <GraduationCap size={76} strokeWidth={1.2} />

                <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/20 shadow-lg backdrop-blur-md">
                  <Stars size={23} />
                </div>

                <div className="absolute -bottom-3 -left-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/20 shadow-lg backdrop-blur-md">
                  <Building2 size={21} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-blue-900/50 dark:from-blue-950/40 dark:to-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  الكليات المتاحة
                </p>
                <p className="mt-3 text-3xl font-black text-blue-800 dark:text-blue-200">
                  {faculties.length}
                </p>
                <p className="mt-1 text-xs text-blue-600/70 dark:text-blue-300/70">
                  مؤسسة أكاديمية
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-transform duration-500 hover:rotate-12 hover:scale-110">
                <Building2 size={27} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-violet-900/50 dark:from-violet-950/40 dark:to-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  المسار الأكاديمي
                </p>
                <p className="mt-3 text-xl font-black text-violet-800 dark:text-violet-200">
                  الكليات
                </p>
                <p className="mt-1 text-xs text-violet-600/70 dark:text-violet-300/70">
                  بوابة استكشاف الجامعة
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-violet-500/20 transition-transform duration-500 hover:rotate-12 hover:scale-110">
                <GraduationCap size={27} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-cyan-900/50 dark:from-cyan-950/40 dark:to-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                  الاستكشاف
                </p>
                <p className="mt-3 text-xl font-black text-cyan-800 dark:text-cyan-200">
                  الأقسام
                </p>
                <p className="mt-1 text-xs text-cyan-600/70 dark:text-cyan-300/70">
                  انتقل لاكتشاف الأقسام
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-transform duration-500 hover:rotate-12 hover:scale-110">
                <Network size={27} />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION TITLE */}
        <section className="space-y-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 size={19} />
                </div>

                <h2 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                  الكليات المتاحة
                </h2>
              </div>

              <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                اختر الكلية للوصول إلى أقسامها ثم استكشف تخصصاتها.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {faculties.length} كلية
            </span>
          </div>

          {/* EMPTY STATE */}
          {faculties.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20">
                <Building2 size={36} />
              </div>

              <h3 className="relative mt-6 text-xl font-black text-slate-900 dark:text-white">
                لا توجد كليات متاحة
              </h3>

              <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                لم يتم العثور على كليات في هذه الجامعة حاليًا.
              </p>
            </div>
          ) : (

            /* FACULTY CARDS */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {faculties.map((faculty, index) => {
                const style =
                  facultyStyles[index % facultyStyles.length];

                return (
                  <article
                    key={faculty.id}
                    style={{
                      animationDelay: `${index * 110}ms`,
                    }}
                    className={`faculty-card faculty-card-enter group relative isolate overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-3 hover:scale-[1.015] hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${style.border}`}
                  >
                    {/* SHIMMER EFFECT */}
                    <div className="faculty-card-shimmer" />

                    {/* GLOW DECORATION */}
                    <div className={`pointer-events-none absolute -left-12 -top-12 -z-10 h-40 w-40 rounded-full ${style.glow} blur-3xl transition-all duration-700 group-hover:scale-[1.8] group-hover:opacity-100`} />

                    <div className="relative p-5 sm:p-6">

                      {/* CARD TOP */}
                      <div className="flex items-center justify-between">
                        <div className={`faculty-icon-float relative flex h-14 w-14 items-center justify-center rounded-2xl ${style.icon} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                          <span className="absolute -inset-1 rounded-2xl border border-current opacity-0 transition-all duration-500 group-hover:inset-[-7px] group-hover:opacity-30" />
                          <Building2 size={27} />
                        </div>

                        <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:border-blue-800 dark:group-hover:bg-blue-950/40">
                          كلية أكاديمية
                        </span>
                      </div>

                      {/* FACULTY NAME */}
                      <div className="mt-6 min-h-[88px]">
                        <h3 className="text-lg font-black leading-8 text-slate-900 transition-colors duration-300 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                          {faculty.name}
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                          استكشف الأقسام والتخصصات التابعة لهذه الكلية.
                        </p>
                      </div>

                      {/* DECORATIVE LINE */}
                      <div className="my-5 h-px origin-right scale-x-100 bg-gradient-to-l from-slate-200 via-slate-100 to-transparent transition-transform duration-700 group-hover:scale-x-0 dark:from-slate-700 dark:via-slate-800" />

                      {/* CARD FOOTER */}
                      <button
                        type="button"
                        onClick={() =>
                          openFacultyDepartments(faculty.id)
                        }
                        className={`group/button flex w-full items-center justify-between rounded-xl bg-gradient-to-l ${style.gradient} px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-xl active:scale-[0.97]`}
                      >
                        <span className="flex items-center gap-2">
                          <Network size={17} className="transition-transform duration-300 group-hover/button:rotate-12" />
                          استعراض الأقسام
                        </span>

                        <ArrowLeft
                          size={18}
                          className="transition-transform duration-300 group-hover/button:-translate-x-2"
                        />
                      </button>
                    </div>

                    {/* BOTTOM DECORATION */}
                    <div className={`pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full ${style.glow} blur-2xl transition-all duration-700 group-hover:scale-[2]`} />

                    {/* DECORATIVE ORBIT */}
                    <div className={`pointer-events-none absolute -bottom-5 left-5 opacity-0 transition-all duration-500 group-hover:opacity-100 ${style.decoration}`}>
                      <Orbit size={65} strokeWidth={0.8} />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* FOOTER */}
        {faculties.length > 0 && (
          <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <Sparkles size={14} className="text-blue-500" />
            استكشف البنية الأكاديمية لجامعتك مع UniShare
          </div>
        )}
      </div>
    </div>
  );
}