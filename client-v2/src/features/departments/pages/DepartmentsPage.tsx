import {
  ArrowRight,
  Building2,
  GraduationCap,
  Loader2,
  RefreshCw,
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

export default function DepartmentsPage() {
  const navigate = useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const facultyId =
    searchParams.get(
      "facultyId",
    );

  const [
    departments,
    setDepartments,
  ] = useState<Department[]>([]);

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

  // =================================================
  // Load Departments
  // =================================================

  async function loadDepartments() {
    if (!facultyId) {
      setError(
        "لم يتم تحديد الكلية.",
      );

      setDepartments([]);
      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        await getDepartmentsByFaculty(
          facultyId,
        );

      setDepartments(
        data ?? [],
      );
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

  const [
    search,
    setSearch,
  ] = useState("");

  const filteredDepartments =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return departments;
      }

      return departments.filter(
        (department) =>
          department.name
            .toLowerCase()
            .includes(value),
      );
    }, [
      departments,
      search,
    ]);

  // =================================================
  // Missing Faculty
  // =================================================

  if (!facultyId) {
    return (
      <div
        dir="rtl"
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        <div className="mx-auto max-w-3xl">
          <div
            className="
              rounded-3xl
              border
              border-amber-200
              bg-amber-50
              p-10
              text-center
            "
          >
            <Building2
              size={48}
              className="
                mx-auto
                mb-4
                text-amber-500
              "
            />

            <h1
              className="
                text-2xl
                font-black
                text-slate-900
              "
            >
              لم يتم تحديد الكلية
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              يجب الدخول إلى صفحة الأقسام
              من خلال كلية محددة.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-slate-900
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-slate-800
              "
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
  // Loading
  // =================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            text-slate-500
          "
        >
          <Loader2
            size={40}
            className="
              animate-spin
              text-blue-600
            "
          />

          <span>
            جاري تحميل الأقسام...
          </span>
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
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        <div className="mx-auto max-w-3xl">
          <div
            className="
              rounded-3xl
              border
              border-red-200
              bg-red-50
              p-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-red-100
                text-2xl
              "
            >
              ⚠️
            </div>

            <h1
              className="
                text-2xl
                font-black
                text-slate-900
              "
            >
              تعذر تحميل الأقسام
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-red-600
              "
            >
              {error}
            </p>

            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  void loadDepartments()
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                <RefreshCw size={17} />
                إعادة المحاولة
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
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
      </div>
    );
  }

  // =================================================
  // Main
  // =================================================

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-slate-50
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
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
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            px-3
            py-2
            text-sm
            font-bold
            text-slate-500
            transition
            hover:bg-white
            hover:text-blue-600
          "
        >
          <ArrowRight size={18} />
          العودة إلى الكليات
        </button>

        {/* =================================================
            Header
        ================================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-blue-50
                px-4
                py-2
                text-sm
                font-bold
                text-blue-600
              "
            >
              <Building2 size={17} />
              الهيكل الأكاديمي
            </div>

            <h1
              className="
                text-3xl
                font-black
                tracking-tight
                text-slate-900
                sm:text-4xl
              "
            >
              أقسام الكلية
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-7
                text-slate-500
                sm:text-base
              "
            >
              اختر القسم للوصول إلى التخصصات
              التابعة له.
            </p>
          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              font-bold
              text-slate-600
              shadow-sm
            "
          >
            <GraduationCap
              size={18}
              className="text-indigo-600"
            />

            {departments.length} قسم
          </div>
        </div>

        {/* =================================================
            Search
        ================================================= */}

        {departments.length > 0 && (
          <div className="mb-7">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="ابحث عن قسم..."
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-4
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-300
                focus:ring-4
                focus:ring-blue-50
              "
            />
          </div>
        )}

        {/* =================================================
            Empty
        ================================================= */}

        {departments.length === 0 ? (
          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-12
              text-center
            "
          >
            <Building2
              size={48}
              className="
                mx-auto
                mb-4
                text-slate-300
              "
            />

            <h2
              className="
                text-xl
                font-black
                text-slate-900
              "
            >
              لا توجد أقسام
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              لا توجد أقسام مرتبطة بهذه الكلية
              حاليًا.
            </p>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-10
              text-center
            "
          >
            <h2
              className="
                text-lg
                font-bold
                text-slate-800
              "
            >
              لا توجد نتائج
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              لم يتم العثور على قسم بهذا الاسم.
            </p>
          </div>
        ) : (

          /* =================================================
             Departments
          ================================================= */

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredDepartments.map(
              (department) => (
                <DepartmentCard
                  key={department.id}
                  department={department}
                  onClick={() =>
                    navigate(
                      `/departments/${department.id}`,
                    )
                  }
                />
              ),
            )}
          </div>
        )}

      </div>
    </div>
  );
}