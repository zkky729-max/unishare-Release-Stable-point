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

  const navigate =
    useNavigate();

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
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!levelId) {
      setError(
        "معرف السنة غير موجود.",
      );

      setLoading(false);

      return;
    }

    async function loadSemesters(
      id: string,
    ) {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getSemestersByLevel(
            id,
          );

        setSemesters(
          data ?? [],
        );
      } catch (err) {
        console.error(
          "ERROR LOADING SEMESTERS:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل السداسيات.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSemesters(
      levelId,
    );
  }, [levelId]);

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
            جاري تحميل السداسيات...
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            يتم تحميل السداسيات المرتبطة بهذه السنة.
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
            <CalendarDays
              size={30}
            />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            تعذر تحميل السداسيات
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

          العودة
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
                <GraduationCap
                  size={28}
                />
              </div>

              <p className="text-sm font-bold text-indigo-600">
                السنة الدراسية
              </p>

              <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
                السداسيات
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                اختر السداسي للوصول إلى المساحة الأكاديمية الخاصة به.
              </p>

            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-indigo-100 bg-white/80 px-5 py-4 shadow-sm">

              <CalendarDays
                size={25}
                className="text-indigo-600"
              />

              <div>
                <div className="text-2xl font-black text-slate-900">
                  {semesters.length}
                </div>

                <div className="text-xs font-bold text-slate-500">
                  سداسي متاح
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            Empty
        ================================================= */}

        {semesters.length ===
        0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <CalendarDays
                size={32}
              />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              لا توجد سداسيات
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              لا توجد سداسيات مرتبطة بهذه السنة حاليًا.
            </p>

          </div>
        ) : (

          /* =================================================
             Semesters
          ================================================= */

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {semesters.map(
              (
                semester,
                index,
              ) => (

                <button
                  key={
                    semester.id
                  }
                  type="button"
                  onClick={() => {

                    console.log(
                      "OPEN SEMESTER:",
                      semester.id,
                      semester.name,
                    );

                    /*
                     * المسار الصحيح:
                     *
                     * السنة
                     * ↓
                     * السداسي
                     * ↓
                     * المساحة الأكاديمية
                     */

                    navigate(
                      `/semesters/${semester.id}`,
                    );
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                >

                  {/* Decorative */}

                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-50 transition-transform duration-300 group-hover:scale-125" />

                  <div className="relative">

                    <div className="flex items-start justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white shadow-lg">
                        <BookOpen
                          size={27}
                        />
                      </div>

                      <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-500">
                        {semester.semester_number
                          ? `S${semester.semester_number}`
                          : `0${
                              index +
                              1
                            }`}
                      </span>

                    </div>

                    <h2 className="mt-6 text-2xl font-black text-slate-900 transition group-hover:text-indigo-600">
                      {semester.name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      المساحة الأكاديمية الخاصة بهذا السداسي.
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                      <span className="text-sm font-black text-indigo-600">
                        فتح السداسي
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                        <ChevronLeft
                          size={18}
                        />
                      </div>

                    </div>

                  </div>

                </button>
              ),
            )}

          </div>
        )}

      </div>
    </div>
  );
}