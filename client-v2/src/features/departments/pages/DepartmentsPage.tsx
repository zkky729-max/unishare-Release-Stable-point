import {
  ArrowRight,
  Building2,
  GraduationCap,
  RefreshCw,
  Sparkles,
  Network,
  BookOpen,
  Landmark,
  Orbit,
  Stars,
  Search,
  Layers3,
  ArrowLeft,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  getDepartmentsByFaculty,
} from "../api/departments";

import DepartmentCard from "../components/DepartmentCard";

import type {
  Department,
} from "../types";

const departmentStyles = [
  {
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    glow: "bg-blue-400/20",
    border: "hover:border-blue-300 dark:hover:border-blue-500/40",
    decoration: "text-blue-400/20",
  },
  {
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    glow: "bg-violet-400/20",
    border: "hover:border-violet-300 dark:hover:border-violet-500/40",
    decoration: "text-violet-400/20",
  },
  {
    gradient: "from-cyan-600 via-sky-600 to-blue-600",
    glow: "bg-cyan-400/20",
    border: "hover:border-cyan-300 dark:hover:border-cyan-500/40",
    decoration: "text-cyan-400/20",
  },
  {
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    glow: "bg-emerald-400/20",
    border: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
    decoration: "text-emerald-400/20",
  },
  {
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    glow: "bg-orange-400/20",
    border: "hover:border-orange-300 dark:hover:border-orange-500/40",
    decoration: "text-orange-400/20",
  },
  {
    gradient: "from-pink-600 via-rose-600 to-fuchsia-600",
    glow: "bg-pink-400/20",
    border: "hover:border-pink-300 dark:hover:border-pink-500/40",
    decoration: "text-pink-400/20",
  },
];

export default function DepartmentsPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const facultyId = searchParams.get("facultyId");

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");

  // =================================================
  // Load Departments
  // =================================================

  async function loadDepartments() {
    if (!facultyId) {
      setError("لم يتم تحديد الكلية.");
      setDepartments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        await getDepartmentsByFaculty(facultyId);

      setDepartments(data ?? []);
    } catch (err) {
      console.error(
        "LOAD DEPARTMENTS ERROR:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "تعذر تحميل الأقسام.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDepartments();
  }, [facultyId]);

  // =================================================
  // Search
  // =================================================

  const filteredDepartments = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return departments;
    }

    return departments.filter((department) =>
      department.name.toLowerCase().includes(value),
    );
  }, [departments, search]);

  // =================================================
  // Loading
  // =================================================

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
            جاري تحميل الأقسام...
          </p>

          <p className="mt-2 text-sm text-slate-400">
            نجهز لك البنية الأكاديمية
          </p>
        </div>
      </div>
    );
  }

  // =================================================
  // Missing Faculty
  // =================================================

  if (!facultyId) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[30px] border border-amber-200 bg-white p-10 text-center shadow-sm dark:border-amber-900/50 dark:bg-slate-900">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl">
              <Building2 size={36} />
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              لم يتم تحديد الكلية
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              يجب الدخول إلى صفحة الأقسام من خلال كلية محددة.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <ArrowRight size={18} />
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =================================================
  // Error
  // =================================================

  if (error) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[30px] border border-red-200 bg-white p-10 text-center shadow-sm dark:border-red-900/50 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-xl">
              <Building2 size={36} />
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              تعذر تحميل الأقسام
            </h1>

            <p className="mt-3 text-sm leading-7 text-red-600 dark:text-red-400">
              {error}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => void loadDepartments()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <RefreshCw size={17} />
                إعادة المحاولة
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <ArrowRight size={17} />
                العودة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =================================================
  // Main
  // =================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-slate-50 px-3 py-6 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8"
    >
      <style>{`
        @keyframes department-enter {
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

        @keyframes department-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes department-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes department-shimmer {
          0% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(-120%);
          }
        }

        .department-card-enter {
          opacity: 0;
          animation: department-enter 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .department-icon-float {
          animation: department-float 4s ease-in-out infinite;
        }

        .department-orbit {
          animation: department-orbit 18s linear infinite;
        }

        .department-card-shimmer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          border-radius: inherit;
        }

        .department-card-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.12),
            transparent
          );
          transform: translateX(120%);
          opacity: 0;
        }

        .department-card-shell:hover .department-card-shimmer::after {
          opacity: 1;
          animation: department-shimmer 1s ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .department-card-enter,
          .department-icon-float,
          .department-orbit {
            animation: none !important;
            opacity: 1;
            transform: none;
            filter: none;
          }

          .department-card-shell,
          .department-card-shell * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl space-y-8">

        {/* HERO */}

        <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-l from-blue-700 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/10 sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="pointer-events-none absolute left-10 top-8 opacity-20 department-orbit">
            <Orbit size={100} strokeWidth={0.7} />
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-blue-100 backdrop-blur-md">
                <Sparkles size={15} />
                UniShare Academic Network
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                أقسام الكلية
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-8 text-blue-100 sm:text-base">
                اكتشف الأقسام الأكاديمية واستكشف التخصصات والمسارات العلمية التابعة لكل قسم ضمن بنية جامعية مترابطة.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90 sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                  <Landmark size={16} />
                  أقسام جامعية
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                  <Network size={16} />
                  شبكة أكاديمية
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                  <BookOpen size={16} />
                  تخصصات علمية
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:ml-6">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-[35px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md sm:h-44 sm:w-44">
                <div className="absolute inset-3 rounded-[28px] border border-dashed border-white/20 department-orbit" />

                <Building2 size={72} strokeWidth={1.2} />

                <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/20 shadow-lg backdrop-blur-md">
                  <Stars size={23} />
                </div>

                <div className="absolute -bottom-3 -left-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/20 shadow-lg backdrop-blur-md">
                  <GraduationCap size={21} />
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
                  الأقسام المتاحة
                </p>

                <p className="mt-3 text-3xl font-black text-blue-800 dark:text-blue-200">
                  {departments.length}
                </p>

                <p className="mt-1 text-xs text-blue-600/70 dark:text-blue-300/70">
                  قسم أكاديمي
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
                  التخصصات
                </p>

                <p className="mt-1 text-xs text-violet-600/70 dark:text-violet-300/70">
                  بوابة استكشاف التخصصات
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
                  اختر القسم المناسب
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
                  <Layers3 size={19} />
                </div>

                <h2 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                  الأقسام المتاحة
                </h2>
              </div>

              <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                اختر القسم للوصول إلى تخصصاته ومساراته الأكاديمية.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {departments.length} قسم
            </span>
          </div>

          {/* SEARCH */}

          {departments.length > 0 && (
            <div className="relative">
              <Search
                size={19}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="ابحث عن قسم..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pr-14 pl-5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-700 dark:focus:ring-blue-950/40"
              />
            </div>
          )}

          {/* EMPTY STATE */}

          {departments.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20">
                <Building2 size={36} />
              </div>

              <h3 className="relative mt-6 text-xl font-black text-slate-900 dark:text-white">
                لا توجد أقسام متاحة
              </h3>

              <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                لا توجد أقسام مرتبطة بهذه الكلية حاليًا.
              </p>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Search size={28} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-800 dark:text-white">
                لا توجد نتائج
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                لم يتم العثور على قسم بهذا الاسم.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 text-sm font-bold text-blue-600 transition hover:text-violet-600 dark:text-blue-400"
              >
                مسح البحث
              </button>
            </div>
          ) : (
            /* DEPARTMENT CARDS */

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredDepartments.map((department, index) => {
                const style =
                  departmentStyles[index % departmentStyles.length];

                return (
                  <div
                    key={department.id}
                    style={{
                      animationDelay: `${index * 110}ms`,
                    }}
                    className={`department-card-shell department-card-enter group relative isolate overflow-hidden rounded-[26px] border border-slate-200 bg-white p-1 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:scale-[1.015] hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${style.border}`}
                  >
                    {/* SHIMMER */}

                    <div className="department-card-shimmer" />

                    {/* GLOW */}

                    <div className={`pointer-events-none absolute -left-12 -top-12 -z-10 h-40 w-40 rounded-full ${style.glow} blur-3xl transition-all duration-700 group-hover:scale-[1.8]`} />

                    {/* CARD ICON DECORATION */}

                    <div className={`pointer-events-none absolute -bottom-6 left-4 opacity-0 transition-all duration-500 group-hover:opacity-100 ${style.decoration}`}>
                      <Orbit size={65} strokeWidth={0.8} />
                    </div>

                    <div className="relative z-10">
                      <div className="pointer-events-none absolute right-4 top-4 z-20">
                        <div className={`department-icon-float flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient} text-white shadow-lg`}>
                          <Building2 size={19} />
                        </div>
                      </div>

                      <DepartmentCard
                        department={department}
                        specialtiesCount={
                          department.specialties_count ?? 0
                        }
                        onClick={() =>
                          navigate(
                            `/departments/${department.id}`,
                          )
                        }
                      />
                    </div>

                    {/* BOTTOM GLOW */}

                    <div className={`pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full ${style.glow} blur-2xl transition-all duration-700 group-hover:scale-[2]`} />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* FOOTER */}

        {departments.length > 0 && (
          <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <Sparkles size={14} className="text-blue-500" />
            استكشف البنية الأكاديمية لجامعتك مع UniShare
          </div>
        )}

        {/* BACK */}

        <div className="flex justify-center pb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-all duration-300 hover:bg-white hover:text-blue-600 dark:hover:bg-slate-900 dark:hover:text-blue-400"
          >
            <ArrowRight size={17} />
            العودة إلى الكليات
            <ArrowLeft size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}