
import {
  ArrowRight,
  ArrowUpLeft,
  Atom,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Layers3,
  LibraryBig,
  Loader2,
  RefreshCw,
  Sparkles,
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
  getDepartment,
} from "../api/departments";

import {
  getSpecialtiesByDepartment,
} from "../../specialties/api/specialties";

import {
  supabase,
} from "../../../lib/supabaseClient";

import type {
  Department,
} from "../types";

interface Specialty {
  id: string;
  name: string;
  description?: string | null;
  department_id?: string | null;
  faculty_id?: string | null;
}

interface Level {
  id: string;
  name: string;
  specialty_id: string;
}

interface SpecialtyWithLevels extends Specialty {
  levels: Level[];
}

interface YearGroup {
  name: string;
  specialties: SpecialtyWithLevels[];
}

export default function DepartmentDetailsPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [department, setDepartment] =
    useState<Department | null>(null);

  const [yearGroups, setYearGroups] =
    useState<YearGroup[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // Load Department Data
  // =====================================================

  async function loadData(departmentId: string) {
    try {
      setLoading(true);
      setError(null);

      const departmentData =
        await getDepartment(departmentId);

      const specialtiesData =
        await getSpecialtiesByDepartment(
          departmentId,
        );

      const specialties =
        (specialtiesData ?? []) as Specialty[];

      // Load levels for all specialties.

      const specialtiesWithLevels: SpecialtyWithLevels[] =
        await Promise.all(
          specialties.map(
            async (specialty) => {
              const {
                data,
                error: levelsError,
              } = await supabase
                .from("levels")
                .select("id,name,specialty_id")
                .eq("specialty_id", specialty.id)
                .order("name", {
                  ascending: true,
                });

              if (levelsError) {
                throw levelsError;
              }

              return {
                ...specialty,
                levels: (data ?? []) as Level[],
              };
            },
          ),
        );

      // Group specialties by academic year.

      const groups = new Map<string, YearGroup>();

      for (const specialty of specialtiesWithLevels) {
        for (const level of specialty.levels) {
          const yearName = level.name.trim();

          if (!yearName) {
            continue;
          }

          if (!groups.has(yearName)) {
            groups.set(yearName, {
              name: yearName,
              specialties: [],
            });
          }

          const group = groups.get(yearName);

          if (!group) {
            continue;
          }

          const alreadyExists =
            group.specialties.some(
              (item) => item.id === specialty.id,
            );

          if (!alreadyExists) {
            group.specialties.push(specialty);
          }
        }
      }

      // Sort academic years.

      const sortedGroups =
        Array.from(groups.values()).sort(
          (a, b) => {
            const aOrder = getYearOrder(a.name);
            const bOrder = getYearOrder(b.name);

            if (aOrder !== bOrder) {
              return aOrder - bOrder;
            }

            return a.name.localeCompare(
              b.name,
              "ar",
            );
          },
        );

      setDepartment(departmentData);
      setYearGroups(sortedGroups);
    } catch (err) {
      console.error(
        "LOAD DEPARTMENT DETAILS ERROR:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "تعذر تحميل بيانات القسم.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      setError("معرف القسم غير موجود.");
      setLoading(false);
      return;
    }

    void loadData(id);
  }, [id]);

  // =====================================================
  // Statistics
  // =====================================================

  const totalSpecialties =
    new Set(
      yearGroups.flatMap(
        (group) =>
          group.specialties.map(
            (specialty) => specialty.id,
          ),
      ),
    ).size;

  const totalLevels =
    new Set(
      yearGroups.flatMap(
        (group) =>
          group.specialties.flatMap(
            (specialty) =>
              specialty.levels.map(
                (level) => level.id,
              ),
          ),
      ),
    ).size;

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          overflow-hidden
          bg-slate-950
        "
      >
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-5">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 animate-pulse rounded-3xl bg-blue-500/10" />

            <Loader2
              size={42}
              className="animate-spin text-cyan-400"
            />
          </div>

          <div className="text-center">
            <p className="text-lg font-black text-white">
              جاري تجهيز الفضاء الأكاديمي
            </p>

            <p className="mt-2 text-sm text-slate-400">
              يتم تحميل القسم والتخصصات والسنوات الدراسية...
            </p>
          </div>
        </div>
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
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
          px-4
          py-8
        "
      >
        <div className="w-full max-w-xl rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/40 sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
            <RefreshCw size={36} />
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            تعذر تحميل بيانات القسم
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {error}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (id) {
                  void loadData(id);
                }
              }}
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-blue-600
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-blue-600/20
                transition
                hover:-translate-y-1
                hover:bg-blue-700
              "
            >
              <RefreshCw size={17} />
              إعادة المحاولة
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-6
                py-3
                text-sm
                font-bold
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              <ArrowRight size={17} />
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // Department Not Found
  // =====================================================

  if (!department) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
      >
        <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
            <Building2 size={38} />
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            القسم غير موجود
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            لم نتمكن من العثور على القسم المطلوب.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <ArrowRight size={18} />
            العودة
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // Main Page
  // =====================================================

  return (
    <div
      dir="rtl"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#f5f8ff]
        px-4
        pb-16
        pt-6
        sm:px-6
        sm:pt-8
        lg:px-8
      "
    >
      {/* Background Decorations */}

      <div className="pointer-events-none absolute -right-52 top-40 h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-[100px]" />

      <div className="pointer-events-none absolute -left-52 top-[900px] h-[500px] w-[500px] rounded-full bg-violet-200/20 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Navigation */}

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-2xl
              border
              border-slate-200/80
              bg-white/80
              px-4
              py-3
              text-sm
              font-bold
              text-slate-600
              shadow-sm
              backdrop-blur
              transition
              hover:-translate-y-0.5
              hover:border-blue-200
              hover:text-blue-600
              hover:shadow-md
            "
          >
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
            العودة إلى الأقسام
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 sm:text-sm">
            <Building2 size={15} />
            <span>الفضاء الأكاديمي</span>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600">
              تفاصيل القسم
            </span>
          </div>
        </div>

        {/* ================================================= */}
        {/* Department Hero */}
        {/* ================================================= */}

        <section className="relative mb-9 overflow-hidden rounded-[2rem] bg-[#101d43] shadow-2xl shadow-blue-950/15">

          {/* Gradient Layers */}

          <div className="absolute inset-0 bg-gradient-to-l from-blue-700/80 via-indigo-800/70 to-slate-950" />

          <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-40 left-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="pointer-events-none absolute right-[45%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="relative grid gap-10 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">

            {/* Department Identity */}

            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-200 backdrop-blur-md">
                <Sparkles size={15} />
                UniShare Academic Network
              </div>

              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-xl sm:h-20 sm:w-20">
                  <Building2
                    size={38}
                    strokeWidth={1.6}
                  />

                  <span className="absolute -bottom-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#172653] bg-cyan-400 text-slate-950">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                <div>
                  <p className="mb-1 text-sm font-semibold text-blue-200">
                    القسم الأكاديمي
                  </p>

                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Stars size={13} />
                    <span>
                      اكتشف مسارك العلمي
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {department.name}
              </h1>

              {department.description ? (
                <p className="mt-5 max-w-2xl text-sm leading-8 text-blue-100/75 sm:text-base">
                  {department.description}
                </p>
              ) : (
                <p className="mt-5 max-w-2xl text-sm leading-8 text-blue-100/75 sm:text-base">
                  استكشف التخصصات والمسارات الدراسية المتاحة في هذا القسم، وتعرّف على مختلف السنوات والمراحل الأكاديمية.
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/80 backdrop-blur-md">
                  <Atom size={15} className="text-cyan-300" />
                  بيئة أكاديمية متكاملة
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/80 backdrop-blur-md">
                  <BookOpen size={15} className="text-violet-300" />
                  المسارات التعليمية
                </div>
              </div>
            </div>

            {/* Hero Statistics */}

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-64 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl transition hover:bg-white/15">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-100/70">
                    السنوات الدراسية
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/20 text-blue-200">
                    <GraduationCap size={20} />
                  </div>
                </div>

                <div className="text-3xl font-black text-white">
                  {yearGroups.length}
                </div>

                <div className="mt-1 text-xs text-blue-100/60">
                  سنة دراسية متاحة
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl transition hover:bg-white/15">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-100/70">
                    التخصصات
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/20 text-violet-200">
                    <LibraryBig size={20} />
                  </div>
                </div>

                <div className="text-3xl font-black text-white">
                  {totalSpecialties}
                </div>

                <div className="mt-1 text-xs text-blue-100/60">
                  تخصص أكاديمي
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decoration */}

          <div className="relative h-1.5 bg-gradient-to-l from-cyan-400 via-blue-500 to-violet-500" />
        </section>

        {/* ================================================= */}
        {/* Academic Overview */}
        {/* ================================================= */}

        <section className="mb-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-600">
                <Layers3 size={17} />
                المسارات الأكاديمية
              </div>

              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                استكشف السنوات الدراسية
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                اختر التخصص المناسب لك للوصول إلى مواده وسداسياته الدراسية.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm">
              <BookOpen size={16} className="text-blue-500" />
              {totalLevels} مستوى دراسي
            </div>
          </div>

          {/* No Years */}

          {yearGroups.length === 0 ? (
            <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-16">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-50 blur-2xl" />

              <div className="relative">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-400">
                  <GraduationCap size={48} />
                </div>

                <h3 className="text-2xl font-black text-slate-900">
                  لا توجد سنوات دراسية بعد
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  لا توجد مستويات دراسية مرتبطة بتخصصات هذا القسم حاليًا. ستظهر المسارات هنا عند إضافتها.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {yearGroups.map((yearGroup, index) => {
                const yearColors = [
                  {
                    gradient: "from-blue-600 via-indigo-600 to-blue-700",
                    soft: "from-blue-50 to-indigo-50",
                    icon: "bg-blue-100 text-blue-700",
                    accent: "text-blue-600",
                    number: "bg-blue-500",
                  },
                  {
                    gradient: "from-violet-600 via-purple-600 to-indigo-700",
                    soft: "from-violet-50 to-purple-50",
                    icon: "bg-violet-100 text-violet-700",
                    accent: "text-violet-600",
                    number: "bg-violet-500",
                  },
                  {
                    gradient: "from-cyan-600 via-teal-600 to-blue-700",
                    soft: "from-cyan-50 to-teal-50",
                    icon: "bg-cyan-100 text-cyan-700",
                    accent: "text-cyan-600",
                    number: "bg-cyan-500",
                  },
                  {
                    gradient: "from-indigo-600 via-blue-600 to-sky-700",
                    soft: "from-indigo-50 to-sky-50",
                    icon: "bg-indigo-100 text-indigo-700",
                    accent: "text-indigo-600",
                    number: "bg-indigo-500",
                  },
                  {
                    gradient: "from-purple-600 via-fuchsia-600 to-violet-700",
                    soft: "from-purple-50 to-fuchsia-50",
                    icon: "bg-purple-100 text-purple-700",
                    accent: "text-purple-600",
                    number: "bg-purple-500",
                  },
                ];

                const theme =
                  yearColors[index % yearColors.length];

                return (
                  <section
                    key={yearGroup.name}
                    className="
                      group/year
                      overflow-hidden
                      rounded-[2rem]
                      border
                      border-slate-200/80
                      bg-white
                      shadow-lg
                      shadow-slate-200/40
                      transition-all
                      duration-500
                      hover:shadow-xl
                      hover:shadow-blue-100/50
                    "
                  >
                    {/* Year Header */}

                    <div className={`relative overflow-hidden bg-gradient-to-l ${theme.gradient} px-5 py-6 sm:px-8 sm:py-7`}>
                      <div className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full border border-white/10" />

                      <div className="pointer-events-none absolute -right-2 -top-12 h-40 w-40 rounded-full border border-white/10" />

                      <div className="pointer-events-none absolute -bottom-24 left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                      <div className="relative flex flex-wrap items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition-transform duration-500 group-hover/year:rotate-6 group-hover/year:scale-105">
                            <GraduationCap size={34} />
                          </div>

                          <div>
                            <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-white/70">
                              <Sparkles size={13} />
                              المرحلة الأكاديمية
                            </div>

                            <h3 className="text-2xl font-black text-white sm:text-3xl">
                              {yearGroup.name}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl border border-white/15 bg-white/15 px-4 py-3 text-center backdrop-blur-md">
                            <div className="text-2xl font-black text-white">
                              {yearGroup.specialties.length}
                            </div>

                            <div className="mt-1 text-[11px] font-semibold text-white/75">
                              تخصصات
                            </div>
                          </div>

                          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white/80 sm:flex">
                            <Layers3 size={24} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Specialties Section */}

                    <div className="p-5 sm:p-8">
                      <div className="mb-6 flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-base font-black text-slate-800">
                            التخصصات المتاحة
                          </h4>

                          <p className="mt-1 text-xs text-slate-400">
                            اختر تخصصًا للانتقال إلى السداسيات الدراسية
                          </p>
                        </div>

                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.icon}`}>
                          <LibraryBig size={20} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {yearGroup.specialties.map(
                          (specialty) => {
                            const level =
                              specialty.levels.find(
                                (item) =>
                                  item.name.trim() ===
                                  yearGroup.name.trim(),
                              );

                            return (
                              <button
                                key={`${yearGroup.name}-${specialty.id}`}
                                type="button"
                                disabled={!level}
                                onClick={() => {
                                  if (!level) {
                                    return;
                                  }

                                  navigate(
                                    `/levels/${level.id}/semesters`,
                                  );
                                }}
                                className="
                                  group/card
                                  relative
                                  flex
                                  min-h-[230px]
                                  flex-col
                                  overflow-hidden
                                  rounded-3xl
                                  border
                                  border-slate-200
                                  bg-white
                                  p-5
                                  text-right
                                  shadow-sm
                                  transition-all
                                  duration-300
                                  hover:-translate-y-1.5
                                  hover:border-blue-200
                                  hover:shadow-xl
                                  hover:shadow-blue-100/60
                                  disabled:cursor-not-allowed
                                  disabled:opacity-60
                                "
                              >
                                {/* Card Background */}

                                <div className={`pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${theme.soft} opacity-80 transition-transform duration-500 group-hover/card:scale-150`} />

                                <div className="pointer-events-none absolute bottom-0 right-0 h-1 w-0 bg-gradient-to-l from-cyan-400 to-blue-600 transition-all duration-500 group-hover/card:w-full" />

                                <div className="relative flex h-full flex-1 flex-col">
                                  {/* Card Top */}

                                  <div className="mb-6 flex items-start justify-between">
                                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover/card:rotate-6 group-hover/card:scale-110">
                                      <BookOpen size={27} />

                                      <span className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-white bg-cyan-400 text-slate-900">
                                        <Atom size={12} />
                                      </span>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover/card:bg-blue-600 group-hover/card:text-white">
                                      <ArrowUpLeft size={19} />
                                    </div>
                                  </div>

                                  {/* Specialty Name */}

                                  <div className="flex-1">
                                    <div className="mb-2 text-[11px] font-bold text-slate-400">
                                      التخصص الأكاديمي
                                    </div>

                                    <h5 className="text-lg font-black leading-8 text-slate-900 transition-colors group-hover/card:text-blue-700">
                                      {specialty.name}
                                    </h5>

                                    {specialty.description && (
                                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">
                                        {specialty.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Card Footer */}

                                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors group-hover/card:text-blue-600">
                                      <GraduationCap
                                        size={16}
                                        className="text-indigo-500"
                                      />

                                      <span>
                                        {level
                                          ? "استكشاف السداسيات"
                                          : "لا يوجد مستوى مرتبط"}
                                      </span>
                                    </div>

                                    <span className="text-xs font-black text-blue-600 opacity-0 transition-all duration-300 group-hover/card:translate-x-1 group-hover/card:opacity-100">
                                      ←
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* Footer Information */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/30 sm:p-8">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <GraduationCap size={29} />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  رحلتك الأكاديمية تبدأ هنا
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  اكتشف تخصصك وتابع مسارك الدراسي عبر UniShare.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
              <Sparkles size={17} />
              <span>UniShare Academic Network</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// =====================================================
// Academic Year Sorting
// =====================================================

function getYearOrder(name: string): number {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/ـ/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");

  const isMaster =
    normalized.includes("ماستر") ||
    normalized.includes("master");

  let yearNumber = 99;

  if (/اولى|الاولى|اول|الاول/.test(normalized)) {
    yearNumber = 1;
  } else if (/ثانيه|الثانيه|ثاني|الثاني/.test(normalized)) {
    yearNumber = 2;
  } else if (/ثالثه|الثالثه|ثالث|الثالث/.test(normalized)) {
    yearNumber = 3;
  }

  if (yearNumber === 99) {
    return 99;
  }

  return isMaster
    ? yearNumber + 3
    : yearNumber;
}
