
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronLeft,
  Sparkles,
  Users,
  GraduationCap,
  Network,
  BookOpen,
  Layers3,
  Orbit,
  Megaphone,
  CalendarDays,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

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
        const {
          data: facultyData,
          error: facultyError,
        } = await supabase
          .from("faculties")
          .select("id,name,description,university_id")
          .eq("id", id)
          .single();

        if (facultyError) {
          throw facultyError;
        }

        setFaculty(facultyData);

        const {
          data: departmentsData,
          error: departmentsError,
        } = await supabase
          .from("departments")
          .select("id,name,faculty_id")
          .eq("faculty_id", id)
          .order("name");

        if (departmentsError) {
          throw departmentsError;
        }

        setDepartments(departmentsData ?? []);
      } catch (err: any) {
        console.error("Faculty Space error:", err);

        setError(
          err?.message || "تعذر تحميل مساحة الكلية",
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200">
              <Building2 size={30} />
            </div>

            <div className="mt-6 h-2 w-36 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              جاري تحميل مساحة الكلية...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              يتم تحميل بيانات الكلية والأقسام الأكاديمية.
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Building2 size={30} />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            تعذر تحميل الكلية
          </h2>

          <p className="mt-3 break-words text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => navigate("/faculties")}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <ArrowRight size={18} />
            العودة إلى الكليات
          </button>
        </div>
      </div>
    );
  }

  if (!faculty || !id) {
    return null;
  }

  // ===================================================
  // Navigation
  // ===================================================

  function openDepartments() {
    navigate(`/departments?facultyId=${id}`);
  }

  // ===================================================
  // Main
  // ===================================================

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="pointer-events-none absolute right-1/2 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute right-1/2 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full border border-white/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-7 lg:px-8">

          {/* Breadcrumb */}

          <div className="mb-12 flex flex-wrap items-center gap-2 text-sm text-white/75">

            <button
              onClick={() => navigate("/")}
              className="transition hover:text-white"
            >
              الرئيسية
            </button>

            <ChevronLeft size={15} />

            <button
              onClick={() => navigate("/faculties")}
              className="transition hover:text-white"
            >
              الكليات
            </button>

            <ChevronLeft size={15} />

            <span className="max-w-[220px] truncate font-bold text-white">
              {faculty.name}
            </span>
          </div>

          {/* Hero Content */}

          <div className="grid gap-12 pb-16 lg:grid-cols-[1fr_310px] lg:items-center">

            <div className="max-w-4xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md">
                <Sparkles size={17} />
                Faculty Space
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {faculty.name}
              </h1>

              {/* Faculty Meta */}

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-white/90">

                <span className="inline-flex items-center gap-2">
                  <Building2 size={18} className="text-cyan-200" />
                  كلية أكاديمية
                </span>

                <span className="hidden text-white/40 sm:block">
                  •
                </span>

                <span className="inline-flex items-center gap-2">
                  <Network size={18} className="text-cyan-200" />
                  {departments.length} أقسام
                </span>

                <span className="hidden text-white/40 sm:block">
                  •
                </span>

                <span className="inline-flex items-center gap-2">
                  <Users size={18} className="text-cyan-200" />
                  مجتمع الطلاب
                </span>
              </div>

              <p className="mt-7 max-w-3xl text-base leading-8 text-white/85 md:text-lg">
                {faculty.description ||
                  `مساحة أكاديمية خاصة بكلية ${faculty.name}، تجمع الطلبة حول الأقسام والتخصصات والمسارات الجامعية.`}
              </p>

              {/* Actions */}

              <div className="mt-9 flex flex-wrap gap-3">

                <button
                  onClick={openDepartments}
                  className="group inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-black text-blue-700 shadow-xl shadow-blue-950/10 transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-2xl"
                >
                  <Building2 size={20} />

                  استكشف الأقسام

                  <ArrowLeft
                    size={18}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </button>

                <button
                  onClick={() => navigate("/faculties")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <ArrowRight size={18} />
                  جميع الكليات
                </button>
              </div>
            </div>

            {/* Faculty Identity Card */}

            <div className="flex justify-center lg:justify-end">

              <div className="group relative w-full max-w-[290px] overflow-hidden rounded-[2rem] border border-white/25 bg-white/15 p-7 text-center shadow-2xl shadow-blue-950/20 backdrop-blur-xl transition duration-500 hover:-translate-y-2">

                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/30 bg-white/20 text-white shadow-inner transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Building2 size={48} />
                </div>

                <p className="relative mt-7 text-sm font-bold tracking-wider text-white/65">
                  ACADEMIC FACULTY
                </p>

                <h2 className="relative mt-3 line-clamp-3 text-lg font-black leading-8 text-white">
                  {faculty.name}
                </h2>

                <div className="relative mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-200 to-white" />

                <p className="relative mt-5 text-xs font-semibold text-white/70">
                  UniShare Academic Community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="relative mx-auto max-w-7xl px-5 pb-20 lg:px-8">

        {/* =================================================
            STATS
        ================================================= */}

        <section className="relative z-20 -mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <StatCard
            icon={<Building2 size={24} />}
            value={departments.length}
            label="الأقسام الأكاديمية"
            description="أقسام الكلية والمسارات التابعة لها"
            color="blue"
            onClick={openDepartments}
          />

          <StatCard
            icon={<Users size={24} />}
            value="مجتمع الطلاب"
            label="المجتمع الأكاديمي"
            description="مساحة تجمع طلبة الكلية"
            color="violet"
          />
        </section>

        {/* =================================================
            DEPARTMENTS SECTION
        ================================================= */}

        <section className="mt-14">

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
                <Network size={16} />
                ACADEMIC DEPARTMENTS
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                الأقسام الأكاديمية
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-500 md:text-base">
                استكشف أقسام كلية {faculty.name} للوصول إلى التخصصات والمسارات الأكاديمية التابعة لكل قسم.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-blue-700 shadow-sm">
              <Building2 size={18} />
              {departments.length} أقسام
            </div>
          </div>

          {/* Departments Discovery Card - Entire Card Clickable */}

          <button
            type="button"
            onClick={openDepartments}
            aria-label={`اكتشف الأقسام الأكاديمية لكلية ${faculty.name}`}
            className="group relative block w-full overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-indigo-50/80 p-7 text-right shadow-md shadow-blue-100/50 transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-200/60 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 md:p-10"
          >

            {/* Decorative Background */}

            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-indigo-200/40" />

            <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl transition-all duration-700 group-hover:scale-125" />

            <div className="pointer-events-none absolute left-8 top-8 h-32 w-32 rounded-full border border-blue-200/40 transition duration-700 group-hover:scale-125 group-hover:rotate-45" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

              <div className="flex items-start gap-5">

                {/* Animated Icon */}

                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-300/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-indigo-300/60">
                  <Network size={30} />

                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-cyan-400 text-white shadow-md transition-transform duration-500 group-hover:rotate-180">
                    <Sparkles size={14} />
                  </span>
                </div>

                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[11px] font-black text-blue-700 shadow-sm">
                    <Orbit size={13} />
                    EXPLORE ACADEMIC STRUCTURE
                  </div>

                  <h3 className="text-xl font-black text-slate-900 transition-colors duration-300 group-hover:text-blue-700 md:text-2xl">
                    اكتشف البنية الأكاديمية للكلية
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-600 md:text-base">
                    انتقل بين الأقسام الأكاديمية وتعرّف على التخصصات والمسارات التعليمية التي تضمها الكلية.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <InfoTag icon={<Building2 size={14} />} label="الأقسام" />
                    <InfoTag icon={<GraduationCap size={14} />} label="التخصصات" />
                    <InfoTag icon={<BookOpen size={14} />} label="المسارات الأكاديمية" />
                  </div>
                </div>
              </div>

              {/* Click Indicator */}

              <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:border-blue-300 group-hover:bg-white group-hover:shadow-lg md:min-w-[190px] md:flex-col md:justify-center md:gap-3">

                <span className="text-sm font-black text-blue-700">
                  استكشف الأقسام
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover:-translate-x-2 group-hover:scale-110">
                  <ArrowLeft size={21} />
                </span>
              </div>
            </div>

            {/* Bottom Accent */}

            <div className="absolute bottom-0 right-0 h-1 w-0 bg-gradient-to-l from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-700 group-hover:w-full" />
          </button>
        </section>

        {/* =================================================
            FACULTY ANNOUNCEMENTS
            Below Departments Discovery
        ================================================= */}

        <section className="mt-14">

          {/* Announcements Heading */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-700">
                <Megaphone size={16} />
                FACULTY ANNOUNCEMENTS
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                إعلانات الكلية
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-500 md:text-base">
                تابع آخر الأخبار والإعلانات الأكاديمية والمستجدات الخاصة بكلية {faculty.name}.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm font-bold text-amber-700 shadow-sm">
              <CalendarDays size={17} />
              الإعلانات والأخبار
            </div>
          </div>

          {/* Announcements Placeholder */}

          <div className="group relative overflow-hidden rounded-[2rem] border border-amber-100 bg-white p-7 shadow-sm transition duration-500 hover:border-amber-200 hover:shadow-lg md:p-10">

            {/* Decorative Background */}

            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-50/80 blur-3xl transition duration-500 group-hover:bg-orange-50" />

            <div className="relative flex flex-col items-center text-center">

              {/* Announcement Icon */}

              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 shadow-sm transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Megaphone size={36} />

                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                  <Sparkles size={12} />
                </span>
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-900 md:text-2xl">
                مساحة إعلانات الكلية
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-8 text-slate-500 md:text-base">
                ستظهر هنا الإعلانات الرسمية والأخبار الجامعية والتنبيهات المهمة الموجهة إلى طلبة وأعضاء كلية {faculty.name}.
              </p>

              {/* Empty State */}

              <div className="mt-7 w-full max-w-2xl rounded-2xl border border-dashed border-amber-200 bg-gradient-to-br from-amber-50/70 to-orange-50/40 px-5 py-8">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-500 shadow-sm">
                  <CalendarDays size={23} />
                </div>

                <p className="mt-4 font-bold text-slate-700">
                  لا توجد إعلانات حاليًا
                </p>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  ستظهر الإعلانات الجديدة هنا عند نشرها.
                </p>
              </div>

              {/* Future Feature Label */}

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500">
                <Sparkles size={14} className="text-amber-500" />
                مساحة مخصصة لإعلانات الكلية
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            ACADEMIC PATH
        ================================================= */}

        <section className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 text-white shadow-xl md:p-10">

          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative">

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-300">
                <Orbit size={26} />
              </div>

              <div>
                <p className="text-xs font-black tracking-widest text-cyan-300">
                  UNISHARE FACULTY
                </p>

                <p className="mt-1 text-sm font-semibold text-white/60">
                  Academic Journey
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-3xl">
                <h3 className="text-2xl font-black leading-tight md:text-3xl">
                  استكشف مسارك الأكاديمي
                </h3>

                <p className="mt-4 text-sm leading-8 text-white/70 md:text-base">
                  ابدأ من الكلية، ثم انتقل إلى القسم والتخصص، واستكشف المستويات والسداسيات والوحدات والمقاييس المرتبطة بمسارك الدراسي.
                </p>

                {/* Academic Path */}

                <div className="mt-7 flex flex-wrap items-center gap-2">

                  <PathStep icon={<Building2 size={15} />} label="الكلية" />

                  <ArrowLeft size={15} className="text-cyan-300" />

                  <PathStep icon={<Network size={15} />} label="القسم" />

                  <ArrowLeft size={15} className="text-cyan-300" />

                  <PathStep icon={<GraduationCap size={15} />} label="التخصص" />

                  <ArrowLeft size={15} className="text-cyan-300" />

                  <PathStep icon={<Layers3 size={15} />} label="المستويات" />

                  <ArrowLeft size={15} className="text-cyan-300" />

                  <PathStep icon={<BookOpen size={15} />} label="المقاييس" />
                </div>
              </div>

              <button
                onClick={openDepartments}
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-black text-blue-800 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-cyan-50"
              >
                ابدأ الاستكشاف
                <ArrowLeft size={19} />
              </button>
            </div>
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
  color,
  onClick,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  description: string;
  color: "blue" | "violet";
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: {
      icon: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      value: "text-blue-700",
      border: "hover:border-blue-200",
      glow: "group-hover:shadow-blue-100",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
      value: "text-violet-700",
      border: "hover:border-violet-200",
      glow: "group-hover:shadow-violet-100",
    },
  };

  const styles = colorClasses[color];

  const content = (
    <>
      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 ${styles.icon}`}>
        {icon}
      </div>

      <div className={`text-2xl font-black md:text-3xl ${styles.value}`}>
        {value}
      </div>

      <div className="mt-2 text-sm font-black text-slate-800 md:text-base">
        {label}
      </div>

      <p className="mt-2 text-xs leading-6 text-slate-400">
        {description}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group rounded-3xl border border-slate-100 bg-white p-6 text-right shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.border} ${styles.glow}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.border} ${styles.glow}`}>
      {content}
    </div>
  );
}

// =====================================================
// Info Tag
// =====================================================

function InfoTag({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
      <span className="text-blue-600">
        {icon}
      </span>
      {label}
    </span>
  );
}

// =====================================================
// Academic Path Step
// =====================================================

function PathStep({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white/90 backdrop-blur-sm">
      <span className="text-cyan-300">
        {icon}
      </span>
      {label}
    </span>
  );
}
