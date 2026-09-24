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
  ChevronDown,
  Layers3,
  Loader2,
} from "lucide-react";

import {
  getModulesBySemester,
} from "../api/modules";

import {
  getSubjectsByModule,
} from "../../subjects/api/subjects";

import type {
  Module,
} from "../types";

// =====================================================
// Subject Type
// =====================================================

interface Subject {
  id: string;
  name: string;
  description?: string | null;
}

// =====================================================
// Module With Subjects
// =====================================================

interface ModuleWithSubjects
  extends Module {
  subjects: Subject[];
  subjectsLoading: boolean;
}

// =====================================================
// Component
// =====================================================

export default function Modules() {
  const {
    semesterId,
  } = useParams<{
    semesterId: string;
  }>();

  const navigate =
    useNavigate();

  const [
    modules,
    setModules,
  ] = useState<ModuleWithSubjects[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  // =====================================================
  // Load Modules + Subjects
  // =====================================================

  useEffect(() => {
    if (!semesterId) {
      setError(
        "معرف السداسي غير موجود.",
      );

      setLoading(false);

      return;
    }

    async function loadModules(
      id: string,
    ) {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getModulesBySemester(
            id,
          );

        console.log(
          "Modules received from Supabase:",
          data,
        );

        const modulesWithInitialState =
          (data ?? []).map(
            (module) => ({
              ...module,
              subjects: [],
              subjectsLoading: true,
            }),
          );

        setModules(
          modulesWithInitialState,
        );

        // =================================================
        // Load Subjects For Every Module
        // =================================================

        const results =
          await Promise.all(
            modulesWithInitialState.map(
              async (module) => {
                try {
                  const subjects =
                    await getSubjectsByModule(
                      module.id,
                    );

                  return {
                    moduleId:
                      module.id,
                    subjects:
                      subjects ?? [],
                  };
                } catch (err) {
                  console.error(
                    `LOAD SUBJECTS ERROR FOR MODULE ${module.id}:`,
                    err,
                  );

                  return {
                    moduleId:
                      module.id,
                    subjects: [],
                  };
                }
              },
            ),
          );

        setModules(
          (currentModules) =>
            currentModules.map(
              (module) => {
                const result =
                  results.find(
                    (item) =>
                      item.moduleId ===
                      module.id,
                  );

                return {
                  ...module,
                  subjects:
                    result?.subjects ??
                    [],
                  subjectsLoading:
                    false,
                };
              },
            ),
        );
      } catch (err) {
        console.error(
          "LOAD MODULES ERROR:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل الوحدات.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadModules(
      semesterId,
    );
  }, [semesterId]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Loader2
              size={32}
              className="animate-spin"
            />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            جاري تحميل الوحدات والمقاييس...
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            يتم تحميل الوحدات والمقاييس المرتبطة بهذا السداسي.
          </p>
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
        className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
      >
        <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Layers3
              size={30}
            />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            تعذر تحميل الوحدات
          </h2>

          <p className="mt-3 text-sm text-red-600 break-words">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft
              size={18}
            />

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
      className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            Back
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-indigo-600"
        >
          <ArrowLeft
            size={18}
          />

          العودة إلى السداسي
        </button>

        {/* =================================================
            Header
        ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 shadow-sm sm:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white shadow-lg">
                <Layers3
                  size={28}
                />
              </div>

              <p className="text-sm font-bold text-indigo-600">
                السداسي
              </p>

              <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
                الوحدات والمقاييس
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                استعرض الوحدات والمقاييس التابعة لهذا السداسي في صفحة واحدة.
              </p>

            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-indigo-100 bg-white/80 px-5 py-4 shadow-sm">

              <BookOpen
                size={25}
                className="text-indigo-600"
              />

              <div>
                <div className="text-2xl font-black text-slate-900">
                  {modules.length}
                </div>

                <div className="text-xs font-bold text-slate-500">
                  وحدة
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            Empty
        ================================================= */}

        {modules.length ===
        0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Layers3
                size={32}
              />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              لا توجد وحدات
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              لا توجد وحدات مرتبطة بهذا السداسي حاليًا.
            </p>

          </div>
        ) : (

          /* =================================================
             Modules + Subjects
          ================================================= */

          <div className="space-y-6">

            {modules.map(
              (
                module,
                index,
              ) => (

                <section
                  key={
                    module.id
                  }
                  className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-lg"
                >

                  {/* Decorative */}

                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-indigo-50 transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative p-5 sm:p-7">

                    {/* =================================================
                        Module Header
                    ================================================= */}

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white shadow-lg">
                          <Layers3
                            size={27}
                          />
                        </div>

                        <div>

                          <div className="mb-1 flex items-center gap-2">

                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                              الوحدة{" "}
                              {String(
                                index + 1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                          </div>

                          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                            {module.name}
                          </h2>

                        </div>

                      </div>

                      <div className="flex items-center gap-2 self-start rounded-xl bg-slate-50 px-4 py-2.5 sm:self-auto">

                        <BookOpen
                          size={18}
                          className="text-indigo-600"
                        />

                        <span className="text-sm font-black text-slate-600">
                          {module.subjectsLoading
                            ? "..."
                            : module
                                .subjects
                                .length}{" "}
                          مقياس
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        Divider
                    ================================================= */}

                    <div className="my-6 h-px bg-slate-100" />

                    {/* =================================================
                        Subjects Loading
                    ================================================= */}

                    {module.subjectsLoading ? (
                      <div className="flex items-center justify-center rounded-2xl bg-slate-50 py-8">

                        <div className="flex items-center gap-3 text-sm font-bold text-slate-500">

                          <Loader2
                            size={20}
                            className="animate-spin text-indigo-600"
                          />

                          جاري تحميل المقاييس...

                        </div>

                      </div>
                    ) : module.subjects.length ===
                      0 ? (

                      /* =================================================
                         No Subjects
                      ================================================= */

                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">

                        <BookOpen
                          size={28}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-bold text-slate-500">
                          لا توجد مقاييس مضافة لهذه الوحدة حاليًا.
                        </p>

                      </div>

                    ) : (

                      /* =================================================
                         Subjects
                      ================================================= */

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                        {module.subjects.map(
                          (
                            subject,
                            subjectIndex,
                          ) => (

                            <button
                              key={
                                subject.id
                              }
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/modules/${module.id}/subjects/${subject.id}`,
                                )
                              }
                              className="group/subject flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                            >

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm transition group-hover/subject:bg-indigo-600 group-hover/subject:text-white">

                                <BookOpen
                                  size={20}
                                />

                              </div>

                              <div className="min-w-0 flex-1">

                                <div className="flex items-center gap-2">

                                  <span className="text-[10px] font-black text-slate-400">
                                    {String(
                                      subjectIndex +
                                        1,
                                    ).padStart(
                                      2,
                                      "0",
                                    )}
                                  </span>

                                  <h3 className="truncate text-sm font-black text-slate-800 transition group-hover/subject:text-indigo-600">
                                    {
                                      subject.name
                                    }
                                  </h3>

                                </div>

                                {subject.description ? (
                                  <p className="mt-1 truncate text-xs text-slate-500">
                                    {
                                      subject.description
                                    }
                                  </p>
                                ) : (
                                  <p className="mt-1 text-xs text-slate-400">
                                    مقياس دراسي
                                  </p>
                                )}

                              </div>

                              <ChevronDown
                                size={16}
                                className="-rotate-90 shrink-0 text-slate-300 transition group-hover/subject:text-indigo-500"
                              />

                            </button>

                          ),
                        )}

                      </div>

                    )}

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