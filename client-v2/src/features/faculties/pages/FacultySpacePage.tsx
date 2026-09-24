import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronLeft,
  Sparkles,
  Users,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabaseClient";

// =====================================================
// Types
// =====================================================

interface Faculty {
  id: string;
  name: string;
  description?: string | null;
  university_id?: string | null;
}

interface Department {
  id: string;
  name: string;
  faculty_id?: string;
}

// =====================================================
// Page
// =====================================================

export default function FacultySpacePage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [faculty, setFaculty] =
    useState<Faculty | null>(null);

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // Load Faculty
  // ===================================================

  useEffect(() => {
    async function loadFacultySpace() {
      if (!id) {
        setError("معرف الكلية غير موجود");
        setLoading(false);
        return;
      }

      try {
        // =============================================
        // Faculty
        // =============================================

        const {
          data: facultyData,
          error: facultyError,
        } = await supabase
          .from("faculties")
          .select(
            "id,name,description,university_id",
          )
          .eq("id", id)
          .single();

        if (facultyError) {
          throw facultyError;
        }

        setFaculty(facultyData);

        // =============================================
        // Departments
        // =============================================

        const {
          data: departmentsData,
          error: departmentsError,
        } = await supabase
          .from("departments")
          .select(
            "id,name,faculty_id",
          )
          .eq("faculty_id", id)
          .order("name");

        if (departmentsError) {
          throw departmentsError;
        }

        setDepartments(
          departmentsData ?? [],
        );
      } catch (err: any) {
        console.error(
          "Faculty Space error:",
          err,
        );

        setError(
          err?.message ||
            "تعذر تحميل مساحة الكلية",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadFacultySpace();
  }, [id]);

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-gray-50
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div
          className="
            w-full
            max-w-xl
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-10
            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              text-center
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-700
              "
            >
              <Building2 size={30} />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-bold
                text-gray-900
              "
            >
              جاري تحميل مساحة الكلية...
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              يتم تحميل بيانات الكلية والأقسام.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // Error
  // ===================================================

  if (error) {
    return (
      <div
        className="
          min-h-screen
          bg-gray-50
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div
          className="
            w-full
            max-w-xl
            rounded-3xl
            border
            border-red-100
            bg-white
            p-10
            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              text-center
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-red-50
                text-red-600
              "
            >
              <Building2 size={30} />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-bold
                text-gray-900
              "
            >
              تعذر تحميل الكلية
            </h2>

            <p
              className="
                mt-3
                text-sm
                text-red-600
                break-words
              "
            >
              {error}
            </p>

            <button
              onClick={() =>
                navigate("/faculties")
              }
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <ArrowRight size={18} />

              العودة إلى الكليات
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!faculty || !id) {
    return null;
  }

  // ===================================================
  // Open Departments
  // ===================================================

  function openDepartments() {
    navigate(
      `/departments?facultyId=${id}`,
    );
  }

  // ===================================================
  // Main
  // ===================================================

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
      "
    >
      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-slate-950
          via-blue-950
          to-indigo-950
        "
      >
        {/* Decorative background */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-96
            w-96
            rounded-full
            bg-blue-500/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-20
            h-96
            w-96
            rounded-full
            bg-indigo-500/20
            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-7xl
            px-5
            py-6
            lg:px-8
          "
        >
          {/* Breadcrumb */}

          <div
            className="
              mb-12
              flex
              items-center
              gap-2
              text-sm
              text-white/70
            "
          >
            <button
              onClick={() =>
                navigate("/")
              }
              className="
                transition
                hover:text-white
              "
            >
              الرئيسية
            </button>

            <ChevronLeft size={15} />

            <button
              onClick={() =>
                navigate("/faculties")
              }
              className="
                transition
                hover:text-white
              "
            >
              الكليات
            </button>

            <ChevronLeft size={15} />

            <span
              className="
                truncate
                font-medium
                text-white
              "
            >
              {faculty.name}
            </span>
          </div>

          {/* Hero Content */}

          <div
            className="
              grid
              gap-10
              pb-14
              lg:grid-cols-[1fr_300px]
              lg:items-center
            "
          >
            {/* Faculty Information */}

            <div className="max-w-4xl">
              <div
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-blue-400/30
                  bg-blue-500/15
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-blue-300
                "
              >
                <Sparkles size={16} />

                Faculty Space
              </div>

              <h1
                className="
                  max-w-4xl
                  text-4xl
                  font-black
                  leading-[1.15]
                  tracking-tight
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {faculty.name}
              </h1>

              {/* Faculty Meta */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-4
                  text-white/80
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  <Building2
                    size={18}
                    className="text-blue-400"
                  />

                  كلية أكاديمية
                </span>

                <span
                  className="
                    hidden
                    text-white/30
                    sm:block
                  "
                >
                  •
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  <Building2
                    size={18}
                    className="text-blue-400"
                  />

                  {departments.length} أقسام
                </span>

                <span
                  className="
                    hidden
                    text-white/30
                    sm:block
                  "
                >
                  •
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  <Users
                    size={18}
                    className="text-blue-400"
                  />

                  مجتمع الطلاب
                </span>
              </div>

              {/* Description */}

              <p
                className="
                  mt-6
                  max-w-3xl
                  text-base
                  leading-8
                  text-white/70
                  md:text-lg
                "
              >
                {faculty.description ||
                  `مساحة أكاديمية خاصة بكلية ${faculty.name}، تجمع الطلبة حول الأقسام والتخصصات والمعلومات الجامعية.`}
              </p>

              {/* Actions */}

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={openDepartments}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-6
                    py-3.5
                    font-bold
                    text-blue-800
                    shadow-lg
                    transition
                    hover:bg-blue-50
                  "
                >
                  <Building2 size={19} />

                  استكشف الأقسام

                  <ArrowLeft size={17} />
                </button>
              </div>
            </div>

            {/* Faculty Identity Card */}

            <div
              className="
                flex
                justify-center
                lg:justify-end
              "
            >
              <div
                className="
                  flex
                  h-56
                  w-56
                  flex-col
                  items-center
                  justify-center
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/10
                  p-8
                  text-center
                  shadow-2xl
                  backdrop-blur-xl
                  sm:h-64
                  sm:w-64
                  lg:h-72
                  lg:w-72
                "
              >
                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-500/20
                    text-blue-300
                    ring-1
                    ring-blue-400/20
                  "
                >
                  <Building2 size={40} />
                </div>

                <p
                  className="
                    mt-5
                    text-sm
                    font-medium
                    text-white/60
                  "
                >
                  Academic Faculty
                </p>

                <p
                  className="
                    mt-2
                    line-clamp-3
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {faculty.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main
        className="
          mx-auto
          max-w-7xl
          px-5
          pb-16
          lg:px-8
        "
      >
        {/* =================================================
            STATS
        ================================================= */}

        <section
          className="
            relative
            z-20
            -mt-8
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            md:gap-4
          "
        >
          <StatCard
            icon={<Building2 size={23} />}
            value={departments.length}
            label="الأقسام الأكاديمية"
            description="أقسام الكلية والتخصصات التابعة لها"
            onClick={openDepartments}
          />

          <StatCard
            icon={<Users size={23} />}
            value="مجتمع الطلاب"
            label="المجتمع الأكاديمي"
            description="مساحة تجمع طلبة الكلية"
          />
        </section>

        {/* =================================================
            DEPARTMENTS ENTRY
        ================================================= */}

        <section
          className="
            mt-10
            rounded-[2rem]
            border
            border-gray-100
            bg-white
            p-8
            shadow-sm
            md:p-10
          "
        >
          <div
            className="
              flex
              flex-col
              gap-8
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <div
                className="
                  mb-3
                  inline-flex
                  items-center
                  gap-2
                  font-bold
                  text-blue-700
                "
              >
                <Building2 size={21} />

                Academic Departments
              </div>

              <h2
                className="
                  text-3xl
                  font-black
                  text-gray-950
                  md:text-4xl
                "
              >
                الأقسام الأكاديمية
              </h2>

              <p
                className="
                  mt-3
                  max-w-2xl
                  leading-7
                  text-gray-500
                "
              >
                استكشف أقسام كلية {faculty.name}
                للوصول إلى التخصصات والمسارات
                الأكاديمية التابعة لكل قسم.
              </p>

              <div
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-blue-100
                  bg-blue-50
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-blue-700
                "
              >
                <Building2 size={17} />

                {departments.length} أقسام أكاديمية
              </div>
            </div>

            <button
              type="button"
              onClick={openDepartments}
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-6
                py-3.5
                font-black
                text-white
                shadow-lg
                transition
                hover:bg-blue-700
                active:scale-[0.98]
              "
            >
              استكشف الأقسام

              <ArrowLeft size={18} />
            </button>
          </div>
        </section>

        {/* =================================================
            BOTTOM INFORMATION
        ================================================= */}

        <section
          className="
            relative
            mt-10
            overflow-hidden
            rounded-[2rem]
            bg-gradient-to-l
            from-slate-900
            to-blue-800
            p-8
            text-white
            shadow-xl
            md:p-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-3
                "
              >
                <Building2 size={30} />

                <span className="font-bold">
                  UniShare Faculty
                </span>
              </div>

              <h3
                className="
                  text-2xl
                  font-black
                  md:text-3xl
                "
              >
                استكشف المسار الأكاديمي
              </h3>

              <p
                className="
                  mt-2
                  max-w-2xl
                  leading-7
                  text-white/75
                "
              >
                ابدأ من القسم للوصول إلى التخصصات،
                ثم انتقل إلى المستويات والسداسيات
                والوحدات والمقاييس الخاصة بمسارك
                الأكاديمي.
              </p>
            </div>

            <button
              onClick={openDepartments}
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-6
                py-3.5
                font-black
                text-blue-800
                transition
                hover:bg-blue-50
              "
            >
              استكشف الأقسام

              <ArrowLeft size={18} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

// =====================================================
// Stat Card
// =====================================================

function StatCard({
  icon,
  value,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div
        className="
          mb-4
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-blue-50
          text-blue-700
        "
      >
        {icon}
      </div>

      <div
        className="
          text-2xl
          font-black
          text-blue-700
          md:text-3xl
        "
      >
        {value}
      </div>

      <div
        className="
          mt-1
          text-sm
          font-bold
          text-gray-800
          md:text-base
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1.5
          hidden
          text-xs
          text-gray-400
          sm:block
        "
      >
        {description}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-5
          text-right
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:border-blue-200
          hover:shadow-md
          md:p-6
        "
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-100
        bg-white
        p-5
        shadow-sm
        md:p-6
      "
    >
      {content}
    </div>
  );
}