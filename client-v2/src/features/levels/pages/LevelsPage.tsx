import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Info,
  Loader2,
  X,
  CalendarDays,
  ChevronLeft,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

interface Level {
  id: string;
  name: string;
  specialty_id: string;
}

interface Semester {
  id: string;
  name: string;
  semester_number: number | null;
  level_id: string;
}

export default function LevelsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedLevel, setSelectedLevel] =
    useState<Level | null>(null);

  const [semesters, setSemesters] =
    useState<Semester[]>([]);

  const [loadingSemesters, setLoadingSemesters] =
    useState(false);

  const [semesterError, setSemesterError] =
    useState("");

  /*
   * ==========================================
   * LOAD LEVELS
   * ==========================================
   */

  useEffect(() => {
    async function loadLevels() {
      if (!id) {
        setError("معرف التخصص غير موجود");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("levels")
          .select("id,name,specialty_id")
          .eq("specialty_id", id)
          .order("name");

        if (error) {
          throw error;
        }

        setLevels(data ?? []);
      } catch (err: any) {
        console.error("Levels page error:", err);

        setError(
          err?.message ||
            "تعذر تحميل مستويات التخصص"
        );
      } finally {
        setLoading(false);
      }
    }

    loadLevels();
  }, [id]);

  /*
   * ==========================================
   * LOAD SEMESTERS FOR SELECTED LEVEL
   * ==========================================
   */

  async function loadSemesters(levelId: string) {
    try {
      setLoadingSemesters(true);
      setSemesterError("");
      setSemesters([]);

      console.log(
        "SEMESTERS FOR LEVEL:",
        levelId
      );

      const { data, error } = await supabase
        .from("semesters")
        .select(
          "id,name,semester_number,level_id"
        )
        .eq("level_id", levelId)
        .order("semester_number", {
          ascending: true,
          nullsFirst: false,
        });

      if (error) {
        console.error(
          "SEMESTERS ERROR:",
          error
        );

        throw error;
      }

      console.log(
        "SEMESTERS RESULT:",
        data
      );

      setSemesters(data ?? []);
    } catch (err: any) {
      console.error(
        "LOAD SEMESTERS ERROR:",
        err
      );

      setSemesterError(
        err?.message ||
          "تعذر تحميل السداسيات"
      );
    } finally {
      setLoadingSemesters(false);
    }
  }

  /*
   * ==========================================
   * SELECT LEVEL
   * ==========================================
   */

  function handleLevelClick(level: Level) {
    setSelectedLevel(level);
    loadSemesters(level.id);
  }

  /*
   * ==========================================
   * LOADING LEVELS
   * ==========================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
            <Loader2
              size={30}
              className="animate-spin"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            جاري تحميل المستويات...
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            يتم تحميل المستويات الأكاديمية لهذا التخصص.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-10 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Info size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            تعذر تحميل المستويات
          </h2>

          <p className="mt-3 text-sm text-red-600 break-words">
            {error}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            <ArrowLeft size={18} />
            العودة
          </button>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * MAIN
   * ==========================================
   */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-green-950">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8">

          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            العودة
          </button>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/15 px-4 py-2 text-sm font-bold text-green-300">
                <GraduationCap size={17} />
                Academic Levels
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                المستويات الأكاديمية
              </h1>

              <p className="mt-4 max-w-2xl leading-8 text-white/70">
                اختر المستوى الأكاديمي للوصول إلى السداسيات والوحدات والمواد الدراسية المرتبطة به.
              </p>

            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-green-300 backdrop-blur-xl">
              <GraduationCap size={42} />
            </div>

          </div>

        </div>
      </section>

      {/* CONTENT */}

      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

        <div className="mb-8">

          <div className="mb-2 flex items-center gap-2 font-bold text-green-700">
            <BookOpen size={20} />
            Academic Structure
          </div>

          <h2 className="text-3xl font-black text-gray-950">
            اختر المستوى
          </h2>

          <p className="mt-2 text-gray-500">
            {levels.length} مستويات متاحة
          </p>

        </div>

        {levels.length === 0 ? (

          <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <GraduationCap size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              لا توجد مستويات
            </h3>

            <p className="mt-2 text-gray-500">
              لا توجد مستويات مرتبطة بهذا التخصص حاليًا.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {levels.map((level, index) => (

              <button
                key={level.id}
                onClick={() =>
                  handleLevelClick(level)
                }
                className="group rounded-3xl border border-gray-100 bg-white p-6 text-right shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-100 hover:shadow-xl"
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      index % 3 === 0
                        ? "bg-blue-50 text-blue-600"
                        : index % 3 === 1
                        ? "bg-green-50 text-green-600"
                        : "bg-violet-50 text-violet-600"
                    }`}
                  >
                    <GraduationCap size={28} />
                  </div>

                  <span className="text-sm font-bold text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-black text-gray-900 transition group-hover:text-green-700">
                  {level.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  اختر المستوى للوصول إلى السداسيات والوحدات والمواد الدراسية.
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">

                  <span className="text-sm font-bold text-green-700">
                    اختيار السداسي
                  </span>

                  <ArrowLeft
                    size={18}
                    className="text-green-700 transition group-hover:-translate-x-1"
                  />

                </div>

              </button>

            ))}

          </div>

        )}

      </main>

      {/* SEMESTER MODAL */}

      {selectedLevel && (

        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() =>
            setSelectedLevel(null)
          }
        >

          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 px-6 py-7 text-white sm:px-8">

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-green-500/20 blur-3xl" />

              <button
                onClick={() =>
                  setSelectedLevel(null)
                }
                className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>

              <div className="relative">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/15 px-3 py-1.5 text-xs font-bold text-green-300">
                  <GraduationCap size={15} />
                  المستوى الأكاديمي
                </div>

                <h2 className="pr-12 text-2xl font-black sm:text-3xl">
                  {selectedLevel.name}
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">
                  اختر السداسي الموجود فعليًا لهذا المستوى.
                </p>

              </div>

            </div>

            {/* MODAL CONTENT */}

            <div className="p-6 sm:p-8">

              <div className="mb-5">

                <div className="flex items-center gap-2 text-green-700">

                  <CalendarDays size={20} />

                  <h3 className="text-lg font-black text-gray-900">
                    السداسيات المتاحة
                  </h3>

                </div>

                <p className="mt-1 text-sm text-gray-500">
                  يتم عرض السداسيات الموجودة في قاعدة البيانات فقط.
                </p>

              </div>

              {/* LOADING */}

              {loadingSemesters && (

                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-10">

                  <Loader2
                    size={30}
                    className="animate-spin text-green-700"
                  />

                  <p className="mt-4 text-sm font-semibold text-gray-500">
                    جاري تحميل السداسيات...
                  </p>

                </div>

              )}

              {/* ERROR */}

              {!loadingSemesters &&
                semesterError && (

                  <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">

                    <Info
                      size={28}
                      className="mx-auto text-red-600"
                    />

                    <p className="mt-3 text-sm font-semibold text-red-600">
                      {semesterError}
                    </p>

                  </div>

                )}

              {/* NO SEMESTERS */}

              {!loadingSemesters &&
                !semesterError &&
                semesters.length === 0 && (

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center">

                    <CalendarDays
                      size={32}
                      className="mx-auto text-gray-400"
                    />

                    <h4 className="mt-4 font-bold text-gray-900">
                      لا توجد سداسيات
                    </h4>

                    <p className="mt-2 text-sm text-gray-500">
                      لا توجد سداسيات مرتبطة بهذا المستوى في قاعدة البيانات.
                    </p>

                  </div>

                )}

              {/* SEMESTERS */}

              {!loadingSemesters &&
                !semesterError &&
                semesters.length > 0 && (

                  <div className="grid gap-4 sm:grid-cols-2">

                    {semesters.map(
                      (semester) => (

                        <button
                          key={semester.id}

                          /*
                           * ==========================================
                           * IMPORTANT:
                           * Open Semester Space instead of Modules
                           * ==========================================
                           */

                          onClick={() => {
                            console.log(
                              "OPEN SEMESTER SPACE:",
                              semester.id,
                              semester.name
                            );

                            navigate(
                              `/semesters/${semester.id}`
                            );
                          }}

                          className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 text-right transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:bg-green-50 hover:shadow-lg"
                        >

                          <div className="flex items-center justify-between">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-green-700 shadow-sm transition group-hover:bg-green-600 group-hover:text-white">

                              <BookOpen size={25} />

                            </div>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-gray-500 shadow-sm">

                              {semester.semester_number
                                ? `S${semester.semester_number}`
                                : semester.name}

                            </span>

                          </div>

                          <h4 className="mt-5 text-lg font-black text-gray-900 group-hover:text-green-700">
                            {semester.name}
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            افتح المساحة الأكاديمية الخاصة بهذا السداسي للوصول إلى الدروس والملخصات والامتحانات والأسئلة.
                          </p>

                          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">

                            <span className="text-sm font-bold text-green-700">
                              فتح السداسي
                            </span>

                            <ChevronLeft
                              size={19}
                              className="text-green-700 transition group-hover:-translate-x-1"
                            />

                          </div>

                        </button>

                      )
                    )}

                  </div>

                )}

              <button
                onClick={() =>
                  setSelectedLevel(null)
                }
                className="mt-6 w-full rounded-xl border border-gray-200 py-3 font-bold text-gray-600 transition hover:bg-gray-50"
              >
                إلغاء
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}