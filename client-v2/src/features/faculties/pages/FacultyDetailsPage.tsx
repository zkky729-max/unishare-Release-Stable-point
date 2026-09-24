import {
  Building2,
  ChevronLeft,
  Loader2,
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
  supabase,
} from "@/lib/supabaseClient";

interface Faculty {
  id: string;
  name: string;
}

export default function FacultyDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [faculty, setFaculty] =
    useState<Faculty | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadFaculty() {
      if (!id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("faculties")
        .select("id, name")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error(
          "Failed to load faculty:",
          error,
        );

        setLoading(false);
        return;
      }

      setFaculty(data);
      setLoading(false);
    }

    void loadFaculty();
  }, [id]);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50"
      >
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2
            size={36}
            className="animate-spin text-blue-600"
          />

          <span>
            جاري تحميل الكلية...
          </span>
        </div>
      </div>
    );
  }

  if (!faculty || !id) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Building2
            size={44}
            className="mx-auto mb-4 text-slate-300"
          />

          <h1 className="text-2xl font-bold text-slate-900">
            الكلية غير موجودة
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Faculty Header */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Building2
                size={32}
                strokeWidth={2}
              />
            </div>

            <div>
              <p className="mb-1 text-sm font-medium text-white/80">
                الكلية
              </p>

              <h1 className="text-2xl font-extrabold sm:text-3xl">
                {faculty.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            الأقسام الأكاديمية
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            اختر القسم للوصول إلى التخصصات التابعة له.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/departments?facultyId=${id}`,
            )
          }
          className="group w-full rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
        >
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white shadow-lg">
                <Building2
                  size={28}
                  strokeWidth={2}
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  أقسام الكلية
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  عرض جميع الأقسام والتخصصات التابعة للكلية
                </p>
              </div>

            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-blue-50 group-hover:text-blue-600">
              <ChevronLeft size={22} />
            </div>

          </div>
        </button>

      </div>
    </div>
  );
}