import {
  Building2,
  GraduationCap,
  ArrowLeft,
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
        let data: Faculty[];

        // =============================================
        // إذا دخلنا من جامعة محددة
        // =============================================

        if (universityId) {
          data =
            await getFacultiesByUniversity(
              universityId,
            );

          console.log(
            "Faculties by university:",
            data,
          );
        }

        // =============================================
        // إذا دخلنا من Dashboard
        // =============================================

        else {
          data =
            await getFaculties();

          console.log(
            "All Faculties:",
            data,
          );
        }

        setFaculties(
          data || [],
        );
      } catch (error) {
        console.error(
          "Faculties loading error:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    void loadFaculties();
  }, [universityId]);

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="
          min-h-screen
          bg-slate-50
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-600
            "
          >
            <GraduationCap size={28} />
          </div>

          <p className="text-slate-500">
            جاري تحميل الكليات...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // Main
  // ===================================================

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
            HEADER
        ================================================= */}

        <div className="mb-8">
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
            <GraduationCap size={17} />

            التعليم الجامعي
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
            الكليات
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-7
              text-slate-500
              sm:text-base
            "
          >
            اختر الكلية للوصول إلى أقسامها،
            ثم اختر القسم للوصول إلى تخصصاته.
          </p>
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {faculties.length === 0 ? (
          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-12
              text-center
              shadow-sm
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
                font-bold
                text-slate-900
              "
            >
              لا توجد كليات
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              لم يتم العثور على كليات متاحة حاليًا.
            </p>
          </div>
        ) : (

          /* =================================================
             FACULTIES
          ================================================= */

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {faculties.map((faculty) => (
              <div
                key={faculty.id}
                className="
                  group
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                {/* =================================================
                    Faculty Card
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/departments?facultyId=${faculty.id}`,
                    )
                  }
                  className="
                    w-full
                    text-right
                  "
                >
                  <div
                    className="
                      relative
                      overflow-hidden
                      bg-gradient-to-br
                      from-blue-600
                      via-indigo-600
                      to-cyan-500
                      p-6
                      text-white
                    "
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -left-8
                        -top-8
                        h-28
                        w-28
                        rounded-full
                        bg-white/10
                      "
                    />

                    <div
                      className="
                        relative
                        flex
                        items-center
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-white/15
                          backdrop-blur-sm
                        "
                      >
                        <Building2
                          size={28}
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            text-xs
                            font-medium
                            text-white/70
                          "
                        >
                          كلية أكاديمية
                        </p>

                        <h2
                          className="
                            mt-1
                            line-clamp-2
                            text-xl
                            font-black
                          "
                        >
                          {faculty.name}
                        </h2>
                      </div>
                    </div>

                    {/* Small navigation hint */}

                    <div
                      className="
                        relative
                        mt-5
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-bold
                        text-white/80
                      "
                    >
                      استعرض الأقسام

                      <ArrowLeft size={15} />
                    </div>
                  </div>
                </button>

                {/* =================================================
                    Card Footer
                ================================================= */}

                <div className="p-5">

                  <p
                    className="
                      mb-4
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    استكشف الأقسام التابعة لهذه
                    الكلية ثم اختر القسم للوصول
                    إلى تخصصاته.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/departments?facultyId=${faculty.id}`,
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-blue-600
                      px-3
                      py-3
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-blue-700
                      active:scale-[0.98]
                    "
                  >
                    <Building2 size={17} />

                    الأقسام

                    <ArrowLeft size={16} />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}