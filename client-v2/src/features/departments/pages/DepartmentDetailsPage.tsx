import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  Loader2,
  RefreshCw,
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

  async function loadData(departmentId: string) {
    try {
      setLoading(true);
      setError(null);

      // =====================================================
      // Load Department
      // =====================================================

      const departmentData =
        await getDepartment(departmentId);

      // =====================================================
      // Load Specialties
      // =====================================================

      const specialtiesData =
        await getSpecialtiesByDepartment(
          departmentId,
        );

      const specialties =
        (specialtiesData ?? []) as Specialty[];

      // =====================================================
      // Load Levels for all specialties
      // =====================================================

      const specialtiesWithLevels: SpecialtyWithLevels[] =
        await Promise.all(
          specialties.map(
            async (specialty) => {
              const {
                data,
                error: levelsError,
              } = await supabase
                .from("levels")
                .select(
                  "id,name,specialty_id",
                )
                .eq(
                  "specialty_id",
                  specialty.id,
                )
                .order("name", {
                  ascending: true,
                });

              if (levelsError) {
                throw levelsError;
              }

              return {
                ...specialty,
                levels:
                  (data ?? []) as Level[],
              };
            },
          ),
        );

      // =====================================================
      // Group specialties by year
      //
      // Important:
      // The same year is shown only once.
      // =====================================================

      const groups =
        new Map<
          string,
          YearGroup
        >();

      for (const specialty of specialtiesWithLevels) {
        for (const level of specialty.levels) {
          const yearName =
            level.name.trim();

          if (!yearName) {
            continue;
          }

          if (!groups.has(yearName)) {
            groups.set(
              yearName,
              {
                name: yearName,
                specialties: [],
              },
            );
          }

          const group =
            groups.get(yearName);

          if (!group) {
            continue;
          }

          const alreadyExists =
            group.specialties.some(
              (item) =>
                item.id === specialty.id,
            );

          if (!alreadyExists) {
            group.specialties.push(
              specialty,
            );
          }
        }
      }

      // =====================================================
      // Sort years
      //
      // السنة الأولى
      // السنة الثانية
      // السنة الثالثة
      // =====================================================

      const sortedGroups =
        Array.from(groups.values()).sort(
          (a, b) => {
            const aNumber =
              extractYearNumber(a.name);

            const bNumber =
              extractYearNumber(b.name);

            if (
              aNumber !== null &&
              bNumber !== null
            ) {
              return aNumber - bNumber;
            }

            return a.name.localeCompare(
              b.name,
              "ar",
            );
          },
        );

      setDepartment(
        departmentData,
      );

      setYearGroups(
        sortedGroups,
      );
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
      setError(
        "معرف القسم غير موجود.",
      );

      setLoading(false);

      return;
    }

    void loadData(id);
  }, [id]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2
            size={40}
            className="animate-spin text-blue-600"
          />

          <span>
            جاري تحميل القسم والسنوات...
          </span>
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
        className="min-h-screen bg-slate-50 px-4 py-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <h1 className="text-2xl font-black text-slate-900">
              تعذر تحميل بيانات القسم
            </h1>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (id) {
                    void loadData(id);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                <RefreshCw size={17} />
                إعادة المحاولة
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
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

  // =====================================================
  // Department Not Found
  // =====================================================

  if (!department) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 px-4 py-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Building2
              size={48}
              className="mx-auto mb-4 text-slate-300"
            />

            <h1 className="text-2xl font-black text-slate-900">
              القسم غير موجود
            </h1>

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              <ArrowRight size={18} />
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Back */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-white hover:text-blue-600"
        >
          <ArrowRight size={18} />

          العودة إلى الأقسام
        </button>

        {/* =================================================
            Department Header
        ================================================= */}

        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 px-6 py-10 text-white sm:px-10">

            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                  <Building2 size={32} />
                </div>

                <p className="mb-2 text-sm font-semibold text-white/80">
                  القسم
                </p>

                <h1 className="text-3xl font-black sm:text-4xl">
                  {department.name}
                </h1>

                {department.description && (
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                    {department.description}
                  </p>
                )}

              </div>

              <div className="flex w-fit items-center gap-3 rounded-2xl bg-white/15 px-5 py-4">

                <GraduationCap size={24} />

                <div>
                  <div className="text-2xl font-black">
                    {yearGroups.length}
                  </div>

                  <div className="text-xs text-white/80">
                    سنوات دراسية
                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className="px-6 py-5 sm:px-10">

            <div className="flex items-center gap-2 text-sm text-slate-500">

              <BookOpen
                size={18}
                className="text-indigo-500"
              />

              <span>
                اختر السنة الدراسية لعرض التخصصات
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            No Years
        ================================================= */}

        {yearGroups.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <GraduationCap
              size={50}
              className="mx-auto mb-4 text-slate-300"
            />

            <h2 className="text-xl font-black text-slate-900">
              لا توجد سنوات دراسية
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              لا توجد مستويات دراسية مرتبطة بتخصصات هذا القسم حاليًا.
            </p>

          </div>
        ) : (

          <div className="space-y-8">

            {yearGroups.map(
              (yearGroup) => (

                <section
                  key={yearGroup.name}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >

                  {/* =================================================
                      Year Header
                  ================================================= */}

                  <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6 sm:px-8">

                    <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

                    <div className="pointer-events-none absolute -bottom-12 right-20 h-32 w-32 rounded-full bg-white/10" />

                    <div className="relative flex items-center justify-between gap-4">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                          <GraduationCap
                            size={28}
                          />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-white/75">
                            السنة الدراسية
                          </p>

                          <h2 className="text-2xl font-black text-white sm:text-3xl">
                            {yearGroup.name}
                          </h2>

                        </div>

                      </div>

                      <div className="hidden rounded-xl bg-white/15 px-4 py-2 text-sm font-bold text-white sm:block">
                        {yearGroup.specialties.length} تخصص
                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      Specialties
                  ================================================= */}

                  <div className="p-5 sm:p-8">

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

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
                              onClick={() => {

                                if (!level) {
                                  return;
                                }

                                navigate(
                                  `/levels/${level.id}/semesters`,
                                );
                              }}
                              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                            >

                              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-125" />

                              <div className="relative">

                                <div className="mb-5 flex items-center justify-between">

                                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white shadow-lg">
                                    <BookOpen
                                      size={27}
                                    />
                                  </div>

                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                                    <ArrowRight
                                      size={20}
                                    />
                                  </div>

                                </div>

                                <h3 className="mb-3 text-xl font-black text-slate-900">
                                  {specialty.name}
                                </h3>

                                {specialty.description && (
                                  <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500">
                                    {specialty.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">

                                  <GraduationCap
                                    size={17}
                                    className="text-indigo-500"
                                  />

                                  <span>
                                    عرض السداسيات
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
              ),
            )}

          </div>
        )}

      </div>
    </div>
  );
}

// =====================================================
// Helpers
// =====================================================

function extractYearNumber(
  name: string,
): number | null {
  const normalized =
    name
      .trim()
      .replace(/[٠-٩]/g, (digit) =>
        String(
          "٠١٢٣٤٥٦٧٨٩".indexOf(
            digit,
          ),
        ),
      );

  const match =
    normalized.match(
      /(\d+)/,
    );

  if (!match) {
    return null;
  }

  const number =
    Number(match[1]);

  return Number.isNaN(number)
    ? null
    : number;
}