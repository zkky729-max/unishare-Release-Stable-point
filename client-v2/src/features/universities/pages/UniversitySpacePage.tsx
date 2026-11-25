
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  CalendarDays,
  Landmark,
  MapPinned,
  ExternalLink,
  GraduationCap,
  FileText,
  ChevronDown,
  ChevronLeft,
  Network,
  BookOpen,
  University,
  ArrowLeft,
  School,
  LibraryBig,
  ShieldCheck,
  ArrowUpLeft,
  GitBranch,
  Megaphone,
  Bell,
} from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getFacultiesByUniversity } from "../../faculties/api/faculties";
import { getDepartmentsByFaculty } from "../../departments/api/departments";
import { getSpecialtiesByFaculty } from "../../specialties/api/specialties";

import { useUniversity } from "../hooks/useUniversity";

type AcademicSpecialty = {
  id: string;
  name: string;
  description?: string | null;
  department_id?: string | null;
};

type AcademicDepartment = {
  id: string;
  name: string;
  specialties: AcademicSpecialty[];
};

type AcademicFaculty = {
  id: string;
  name: string;
  departments: AcademicDepartment[];
  unassignedSpecialties: AcademicSpecialty[];
};

const facultyThemes = [
  {
    icon: Building2,
    iconBg: "bg-blue-400/15",
    iconColor: "text-cyan-300",
    border: "border-blue-400/30",
    accent: "from-blue-400 to-cyan-400",
    label: "text-cyan-300",
  },
  {
    icon: GraduationCap,
    iconBg: "bg-violet-400/15",
    iconColor: "text-violet-300",
    border: "border-violet-400/30",
    accent: "from-violet-400 to-fuchsia-400",
    label: "text-violet-300",
  },
  {
    icon: BookOpen,
    iconBg: "bg-cyan-400/15",
    iconColor: "text-cyan-300",
    border: "border-cyan-400/30",
    accent: "from-cyan-400 to-teal-400",
    label: "text-cyan-300",
  },
  {
    icon: Landmark,
    iconBg: "bg-emerald-400/15",
    iconColor: "text-emerald-300",
    border: "border-emerald-400/30",
    accent: "from-emerald-400 to-green-400",
    label: "text-emerald-300",
  },
  {
    icon: LibraryBig,
    iconBg: "bg-amber-400/15",
    iconColor: "text-amber-300",
    border: "border-amber-400/30",
    accent: "from-amber-400 to-orange-400",
    label: "text-amber-300",
  },
  {
    icon: School,
    iconBg: "bg-rose-400/15",
    iconColor: "text-rose-300",
    border: "border-rose-400/30",
    accent: "from-rose-400 to-pink-400",
    label: "text-rose-300",
  },
];

export default function UniversitySpacePage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const { university, loading, error } = useUniversity(slug);

  const [academicTree, setAcademicTree] = useState<AcademicFaculty[]>([]);
  const [academicLoading, setAcademicLoading] = useState(false);
  const [academicError, setAcademicError] = useState<string | null>(null);

  const [expandedFaculties, setExpandedFaculties] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const universityId = university?.id;

    if (!universityId) {
      setAcademicTree([]);
      return;
    }

    let active = true;

    async function loadAcademicTree(id: string) {
      try {
        setAcademicLoading(true);
        setAcademicError(null);

        const faculties = await getFacultiesByUniversity(id);

        const tree = await Promise.all(
          faculties.map(async (faculty) => {
            const [departments, specialties] = await Promise.all([
              getDepartmentsByFaculty(faculty.id),
              getSpecialtiesByFaculty(faculty.id),
            ]);

            const departmentNodes: AcademicDepartment[] = departments.map(
              (department) => ({
                id: department.id,
                name: department.name,
                specialties: (specialties ?? []).filter(
                  (specialty) => specialty.department_id === department.id,
                ) as AcademicSpecialty[],
              }),
            );

            const departmentIds = new Set(
              departmentNodes.map((department) => department.id),
            );

            const unassignedSpecialties = (specialties ?? []).filter(
              (specialty) =>
                !specialty.department_id ||
                !departmentIds.has(specialty.department_id),
            ) as AcademicSpecialty[];

            return {
              id: faculty.id,
              name: faculty.name,
              departments: departmentNodes,
              unassignedSpecialties,
            };
          }),
        );

        if (active) {
          setAcademicTree(tree);
        }
      } catch (loadError) {
        console.error(
          "Failed to load university academic structure:",
          loadError,
        );

        if (active) {
          setAcademicError(
            "تعذر تحميل الهيكل الأكاديمي. تحقق من صلاحيات قراءة الجداول والعلاقات في Supabase.",
          );
        }
      } finally {
        if (active) {
          setAcademicLoading(false);
        }
      }
    }

    loadAcademicTree(universityId);

    return () => {
      active = false;
    };
  }, [university?.id]);

  const totalDepartments = academicTree.reduce(
    (total, faculty) => total + faculty.departments.length,
    0,
  );

  const totalSpecialties = academicTree.reduce(
    (total, faculty) =>
      total +
      faculty.departments.reduce(
        (sum, department) => sum + department.specialties.length,
        0,
      ) +
      faculty.unassignedSpecialties.length,
    0,
  );

  const toggleFaculty = (facultyId: string) => {
    setExpandedFaculties((current) => ({
      ...current,
      [facultyId]: !current[facultyId],
    }));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#080f20]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
          <p className="mt-5 text-sm font-semibold text-slate-600 dark:text-slate-300">
            جارٍ تحميل بيانات الجامعة...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#080f20]">
        <div className="max-w-lg rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <Building2 size={36} className="mx-auto" />
          <h1 className="mt-4 text-xl font-bold">تعذر تحميل الجامعة</h1>
          <p className="mt-3 text-sm leading-7">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/universities")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            العودة إلى الجامعات
          </button>
        </div>
      </main>
    );
  }

  if (!university) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#080f20]">
        <div className="text-center">
          <Building2 size={42} className="mx-auto text-slate-500" />
          <h1 className="mt-5 text-xl font-bold text-slate-800 dark:text-white">
            الجامعة غير موجودة
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            لم نتمكن من العثور على الجامعة المطلوبة.
          </p>
          <button
            type="button"
            onClick={() => navigate("/universities")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            العودة إلى الجامعات
          </button>
        </div>
      </main>
    );
  }

  const informationItems = [
    {
      label: "سنة التأسيس",
      value: university.founded_year,
      icon: CalendarDays,
    },
    {
      label: "نوع المؤسسة",
      value: university.institution_type,
      icon: Landmark,
    },
    {
      label: "المدينة",
      value: university.city,
      icon: MapPin,
    },
    {
      label: "العنوان",
      value: university.address,
      icon: MapPinned,
    },
  ].filter(
    (item) =>
      item.value !== null &&
      item.value !== undefined &&
      item.value !== "",
  );

  const stats = [
    {
      label: "الكليات",
      value: academicTree.length,
      icon: Building2,
      color:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    },
    {
      label: "الأقسام",
      value: totalDepartments,
      icon: Network,
      color:
        "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    },
    {
      label: "التخصصات",
      value: totalSpecialties,
      icon: GraduationCap,
      color:
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    },
  ];

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#f5f8ff] text-slate-800 dark:bg-[#080f20] dark:text-white"
    >
      <style>{`
        @keyframes academicFadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes academicLineFlow {
          from { background-position: 100% 0; }
          to { background-position: 0 0; }
        }

        @keyframes academicDotPulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(56,189,248,.10), 0 0 12px rgba(56,189,248,.35);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(56,189,248,.04), 0 0 22px rgba(56,189,248,.65);
          }
        }

        @keyframes sciencePulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(56,189,248,0);
          }
          50% {
            box-shadow: 0 0 24px 2px rgba(56,189,248,.18);
          }
        }

        @keyframes scienceShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes scienceFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes scienceOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes scienceBranch {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .academic-enter {
          animation: academicFadeUp .65s cubic-bezier(.2,.75,.25,1) both;
        }

        .academic-line {
          background-size: 220% 100%;
          animation: academicLineFlow 5s linear infinite;
        }

        .academic-dot {
          animation: academicDotPulse 2.4s ease-in-out infinite;
        }

        .academic-branch {
          animation: scienceBranch .35s ease-out both;
        }

        .science-card {
          position: relative;
          isolation: isolate;
          transition:
            transform .35s ease,
            box-shadow .35s ease,
            border-color .35s ease;
        }

        .science-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background: linear-gradient(
            115deg,
            transparent 20%,
            rgba(255,255,255,.10) 45%,
            transparent 70%
          );
          background-size: 220% 100%;
          opacity: 0;
          transition: opacity .3s ease;
        }

        .science-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(14,165,233,.16);
        }

        .science-card:hover::before {
          opacity: 1;
          animation: scienceShimmer 2.5s linear infinite;
        }

        .science-card-accent {
          background-size: 200% 100%;
          animation: scienceShimmer 6s linear infinite;
        }

        .science-node {
          animation: sciencePulse 3s ease-in-out infinite;
        }

        .science-icon {
          transition: transform .4s ease;
        }

        .science-card:hover .science-icon {
          transform: rotate(-8deg) scale(1.08);
        }

        .science-orbit {
          animation: scienceOrbit 12s linear infinite;
        }

        .science-float {
          animation: scienceFloat 4s ease-in-out infinite;
        }

        .academic-faculty-grid {
          position: relative;
        }

        @media (min-width: 768px) {
          .academic-faculty-grid::before {
            content: "";
            position: absolute;
            top: -25px;
            right: 25%;
            left: 25%;
            height: 2px;
            background: linear-gradient(90deg, #38bdf8, #818cf8, #34d399, #f59e0b);
            background-size: 220% 100%;
            animation: academicLineFlow 6s linear infinite;
            opacity: .8;
          }

          .academic-faculty-node::before {
            content: "";
            position: absolute;
            top: -25px;
            right: 50%;
            height: 25px;
            width: 2px;
            transform: translateX(50%);
            background: linear-gradient(to bottom, #60a5fa, #818cf8);
          }
        }

        .academic-faculty-node {
          position: relative;
        }

        .academic-faculty-node::after {
          content: "";
          position: absolute;
          top: -29px;
          right: calc(50% - 3px);
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #60a5fa;
          box-shadow: 0 0 12px rgba(59,130,246,.7);
        }

        @media (max-width: 767px) {
          .academic-faculty-node {
            margin-right: 15px;
          }

          .academic-faculty-node::before {
            content: "";
            position: absolute;
            top: -18px;
            right: -16px;
            width: 2px;
            height: 18px;
            background: linear-gradient(to bottom, #60a5fa, #818cf8);
          }

          .academic-faculty-node::after {
            top: -22px;
            right: -19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .academic-enter,
          .academic-line,
          .academic-dot,
          .science-card,
          .science-card::before,
          .science-node,
          .science-icon,
          .science-orbit,
          .science-float,
          .academic-branch {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* HERO */}

      <section className="relative isolate overflow-hidden bg-[#122448] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_5%_10%,rgba(59,130,246,.28),transparent_42%),radial-gradient(ellipse_at_90%_90%,rgba(99,102,241,.22),transparent_40%)]" />

        <div className="pointer-events-none absolute -left-32 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute -left-16 -top-24 h-[370px] w-[370px] rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-transparent via-blue-400/60 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 sm:pb-20 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-blue-100 sm:text-sm">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="transition hover:text-white"
            >
              الرئيسية
            </button>

            <ChevronLeft size={14} />

            <button
              type="button"
              onClick={() => navigate("/universities")}
              className="transition hover:text-white"
            >
              الجامعات
            </button>

            <ChevronLeft size={14} />

            <span className="max-w-[220px] truncate font-bold text-white">
              {university.name}
            </span>
          </nav>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <div className="relative z-10 academic-enter">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/15 px-4 py-2 text-xs font-bold text-blue-100">
                <ShieldCheck size={15} />
                البوابة الأكاديمية للجامعة
              </div>

              <h1 className="mt-7 max-w-3xl text-3xl font-black leading-[1.5] tracking-tight text-white sm:text-4xl lg:text-5xl">
                اكتشف البنية الأكاديمية
                <span className="block bg-gradient-to-l from-cyan-200 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
                  وابدأ رحلتك الجامعية.
                </span>
              </h1>

              <div className="mt-6 inline-block max-w-3xl rounded-2xl border border-cyan-300/30 bg-gradient-to-l from-blue-400/15 via-indigo-400/10 to-cyan-400/15 px-5 py-4 shadow-lg shadow-blue-950/20 backdrop-blur-md sm:px-7 sm:py-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-cyan-200">
                  <University size={15} />
                  المؤسسة الجامعية
                </div>

                <h2 className="text-xl font-black leading-relaxed text-white sm:text-2xl lg:text-3xl">
                  {university.name}
                </h2>
              </div>

              {university.city && (
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
                  <MapPin size={17} className="text-blue-300" />
                  {university.city}
                </div>
              )}

              {university.description && (
                <p className="mt-6 max-w-2xl text-sm leading-8 text-blue-100 sm:text-base">
                  {university.description}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("academic-structure")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-blue-500 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-1 hover:bg-blue-400"
                >
                  استكشف الهيكل الأكاديمي
                  <ArrowLeft
                    size={18}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/universities")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  جميع الجامعات
                  <Building2 size={17} />
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6 text-xs font-medium text-blue-100">
                <span className="flex items-center gap-2">
                  <University size={15} className="text-blue-300" />
                  مؤسسة تعليم عالٍ
                </span>
                <span className="flex items-center gap-2">
                  <Network size={15} className="text-blue-300" />
                  شبكة أكاديمية مترابطة
                </span>
              </div>
            </div>

            {/* UNIVERSITY VISUAL */}

            <div className="relative mx-auto w-full max-w-md academic-enter [animation-delay:150ms]">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/[0.16] to-white/[0.06] p-7 shadow-2xl shadow-blue-950/30 backdrop-blur-sm sm:p-9">
                <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-l from-blue-300 via-violet-400 to-cyan-300" />

                <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl" />

                <div className="relative flex flex-col items-center text-center">
                  <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/30 bg-white shadow-xl shadow-blue-950/20">
                    {university.logo_url ? (
                      <img
                        src={university.logo_url}
                        alt={university.name}
                        className="h-full w-full object-contain p-3"
                      />
                    ) : (
                      <University size={52} className="text-blue-700" />
                    )}
                  </div>

                  <span className="mt-7 text-[11px] font-bold tracking-[.18em] text-blue-200">
                    UNISHARE • ACADEMIC NETWORK
                  </span>

                  <h3 className="mt-4 text-xl font-black leading-relaxed text-white sm:text-2xl">
                    {university.short_name || university.name}
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-blue-100">
                    منصة موحدة للتعرف على الكليات والأقسام والتخصصات والمسارات
                    الأكاديمية.
                  </p>

                  <div className="mt-8 grid w-full grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/15 bg-white/[0.09] p-4 text-center">
                      <Building2 size={21} className="mx-auto text-blue-300" />
                      <p className="mt-2 text-xs font-medium text-blue-100">
                        الكليات
                      </p>
                      <p className="mt-1 text-xl font-black text-white">
                        {academicTree.length}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/[0.09] p-4 text-center">
                      <GraduationCap
                        size={21}
                        className="mx-auto text-cyan-300"
                      />
                      <p className="mt-2 text-xs font-medium text-blue-100">
                        التخصصات
                      </p>
                      <p className="mt-1 text-xl font-black text-white">
                        {totalSpecialties}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 -z-10 h-32 w-32 rounded-full bg-blue-500/25 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}

      <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-5 sm:px-8 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                style={{ animationDelay: `${index * 100}ms` }}
                className="academic-enter group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#111c34]"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={23} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-3xl font-black text-slate-800 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ACADEMIC STRUCTURE */}

      <section
        id="academic-structure"
        className="scroll-mt-8 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                <Network size={15} />
                الهيكل التنظيمي والأكاديمي
              </div>

              <h2 className="text-3xl font-black leading-tight text-slate-800 dark:text-white sm:text-4xl">
                الهيكل الأكاديمي
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
                تعرف على الكليات والأقسام التابعة للجامعة. اضغط على أي قسم
                للانتقال إلى صفحته واستكشاف التخصصات والمسارات الأكاديمية.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="academic-dot h-2.5 w-2.5 rounded-full bg-emerald-500" />
              البيانات الأكاديمية للجامعة
            </div>
          </div>

          {academicLoading && (
            <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-[#111c34]">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
              <p className="mt-5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                جارٍ تحميل الهيكل الأكاديمي...
              </p>
            </div>
          )}

          {!academicLoading && academicError && (
            <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm leading-7 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              {academicError}
            </div>
          )}

          {!academicLoading &&
            !academicError &&
            academicTree.length === 0 && (
              <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/20 dark:bg-[#111c34]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  <Building2 size={36} />
                </div>

                <h3 className="mt-6 text-xl font-black text-slate-800 dark:text-white">
                  لا توجد كليات مسجلة حالياً
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">
                  ستظهر الكليات هنا تلقائياً عند ربطها بهذه الجامعة في قاعدة
                  البيانات.
                </p>
              </div>
            )}

          {/* ACADEMIC TREE */}

          {!academicLoading &&
            !academicError &&
            academicTree.length > 0 && (
              <div className="mt-14">
                {/* UNIVERSITY ROOT NODE */}

                <div className="relative mx-auto mb-14 max-w-xl academic-enter">
                  <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-5 shadow-lg shadow-blue-900/[0.06] dark:border-blue-500/30 dark:bg-[#111c34] sm:p-6">
                    <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-cyan-500" />

                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                        {university.logo_url ? (
                          <img
                            src={university.logo_url}
                            alt={university.name}
                            className="h-full w-full bg-white object-contain p-2"
                          />
                        ) : (
                          <University size={32} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                          المؤسسة الجامعية
                        </span>
                        <h3 className="mt-1 break-words text-lg font-black leading-7 text-slate-800 dark:text-white">
                          {university.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {academicTree.length} كلية تابعة
                        </p>
                      </div>

                      <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 sm:flex">
                        <Landmark size={21} />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-14 right-1/2 h-14 w-[2px] translate-x-1/2 bg-gradient-to-b from-blue-500 via-violet-500 to-cyan-500">
                    <span className="academic-dot absolute -bottom-1 -right-[3px] h-2 w-2 rounded-full bg-cyan-400" />
                  </div>
                </div>

                {/* FACULTY NETWORK */}

                <div className="academic-faculty-grid grid gap-x-6 gap-y-12 pt-1 md:grid-cols-2">
                  {academicTree.map((faculty, index) => {
                    const theme =
                      facultyThemes[index % facultyThemes.length];

                    const FacultyIcon = theme.icon;
                    const isExpanded = Boolean(
                      expandedFaculties[faculty.id],
                    );

                    const specialtyCount =
                      faculty.departments.reduce(
                        (sum, department) =>
                          sum + department.specialties.length,
                        0,
                      ) + faculty.unassignedSpecialties.length;

                    return (
                      <article
                        key={faculty.id}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className="academic-faculty-node academic-enter group overflow-visible rounded-2xl"
                      >
                        <div
                          className={`science-card relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#10294b] via-[#142d50] to-[#17234a] shadow-xl shadow-blue-950/10 ${theme.border}`}
                        >
                          <div
                            className={`science-card-accent h-1.5 bg-gradient-to-l ${theme.accent}`}
                          />

                          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
                          <div className="pointer-events-none absolute -bottom-20 -right-16 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />

                          <button
                            type="button"
                            onClick={() => toggleFaculty(faculty.id)}
                            aria-expanded={isExpanded}
                            className="relative flex w-full items-center gap-4 p-5 text-right transition sm:p-6"
                          >
                            <div
                              className={`science-icon relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconColor}`}
                            >
                              <FacultyIcon size={27} />
                              <span className="science-node absolute -left-1 -top-1 h-3 w-3 rounded-full bg-white/80" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`text-[10px] font-black ${theme.label}`}
                                >
                                  الكلية {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-blue-300/60" />
                                <span className="text-[10px] font-semibold !text-blue-100">
                                  مؤسسة أكاديمية
                                </span>
                              </div>

                              <h3 className="mt-2 break-words text-base font-black leading-7 !text-white sm:text-lg">
                                {faculty.name}
                              </h3>

                              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold !text-blue-100">
                                <span className="flex items-center gap-1.5">
                                  <Network
                                    size={14}
                                    className={theme.iconColor}
                                  />
                                  {faculty.departments.length} قسم
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <BookOpen
                                    size={14}
                                    className={theme.iconColor}
                                  />
                                  {specialtyCount} تخصص
                                </span>
                              </div>
                            </div>

                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 transition duration-300 ${
                                isExpanded
                                  ? "rotate-180 bg-cyan-400 text-[#10294b]"
                                  : "bg-white/10 text-cyan-100 hover:bg-white/20"
                              }`}
                            >
                              <ChevronDown size={19} />
                            </div>
                          </button>

                          {/* FACULTY DETAILS */}

                          <div
                            className={`relative grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                              isExpanded
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="academic-branch border-t border-white/10 bg-[#0d1d36]/80 p-5 sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                                    <GitBranch size={19} />
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-black !text-white">
                                      أقسام الكلية
                                    </h4>
                                    <p className="mt-1 text-[11px] font-medium !text-blue-200">
                                      اختر القسم لاستكشاف تخصصاته
                                    </p>
                                  </div>
                                </div>

                                {faculty.departments.length === 0 && (
                                  <div className="rounded-xl border border-dashed border-blue-300/30 bg-white/5 p-6 text-center">
                                    <School
                                      className="mx-auto text-blue-200"
                                      size={27}
                                    />
                                    <p className="mt-3 text-xs font-medium leading-6 !text-blue-100">
                                      لا توجد أقسام مسجلة لهذه الكلية بعد.
                                    </p>
                                  </div>
                                )}

                                {/* DEPARTMENTS - CLICK TO OPEN DEPARTMENT PAGE */}

                                <div className="relative space-y-3 border-r-2 border-dashed border-cyan-400/30 pr-4">
                                  {faculty.departments.map(
                                    (department, departmentIndex) => (
                                      <div
                                        key={department.id}
                                        className="academic-branch relative"
                                        style={{
                                          animationDelay: `${departmentIndex * 70}ms`,
                                        }}
                                      >
                                        <span className="science-node absolute -right-[21px] top-7 h-3 w-3 rounded-full border-2 border-[#142d50] bg-cyan-300" />

                                        <button
                                          type="button"
                                          onClick={() =>
                                            navigate(
                                              `/departments/${department.id}`,
                                            )
                                          }
                                          className="science-card group/department flex w-full items-center gap-3 overflow-hidden rounded-xl border border-cyan-400/20 bg-gradient-to-br from-[#142d4d] to-[#192b49] p-4 text-right shadow-md shadow-blue-950/10 transition hover:border-cyan-300/50 hover:from-[#19385d] hover:to-[#20365b] focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                                          aria-label={`فتح قسم ${department.name}`}
                                        >
                                          <div className="science-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-300">
                                            <Network size={20} />
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <span className="text-[10px] font-black text-violet-300">
                                              القسم{" "}
                                              {String(
                                                departmentIndex + 1,
                                              ).padStart(2, "0")}
                                            </span>

                                            <span className="mt-1 block break-words text-sm font-bold !text-white">
                                              {department.name}
                                            </span>

                                            <span className="mt-1 block text-[11px] font-medium !text-blue-100">
                                              {department.specialties.length}{" "}
                                              تخصص
                                            </span>
                                          </div>

                                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-200 transition group-hover/department:translate-x-[-3px] group-hover/department:bg-cyan-400/20">
                                            <ArrowLeft size={18} />
                                          </div>
                                        </button>
                                      </div>
                                    ),
                                  )}
                                </div>

                                {faculty.unassignedSpecialties.length > 0 && (
                                  <div className="mt-5 rounded-xl border border-amber-300/25 bg-amber-400/[0.07] p-4">
                                    <div className="flex items-center gap-2 text-amber-200">
                                      <BookOpen size={17} />
                                      <p className="text-xs font-bold">
                                        تخصصات مرتبطة بالكلية مباشرة
                                      </p>
                                    </div>

                                    <p className="mt-2 text-xs font-medium leading-6 !text-amber-100">
                                      {faculty.unassignedSpecialties.length}{" "}
                                      تخصص غير مرتبط بقسم محدد.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </section>

      {/* UNIVERSITY ANNOUNCEMENTS */}

      <section className="relative mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-8">
        <div className="science-card relative isolate overflow-hidden rounded-[2rem] border border-blue-400/30 bg-gradient-to-br from-[#10294b] via-[#142d50] to-[#1b2852] p-6 shadow-2xl shadow-blue-950/15 sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-l from-cyan-400 via-blue-500 to-violet-500" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-100">
                <Bell size={15} />
                فضاء التواصل الجامعي
              </div>

              <h2 className="mt-6 text-2xl font-black leading-relaxed !text-white sm:text-3xl lg:text-4xl">
                إعلانات الجامعة
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-8 !text-blue-100 sm:text-base">
                تابع آخر المستجدات والإعلانات الرسمية الخاصة بالجامعة،
                بما في ذلك الأخبار الجامعية، الإعلانات الإدارية،
                المواعيد والأنشطة والفعاليات الأكاديمية.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-xs font-semibold !text-blue-50">
                  <ShieldCheck size={16} className="text-emerald-300" />
                  إعلانات بإشراف الجهات المخولة
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-xs font-semibold !text-blue-50">
                  <Megaphone size={16} className="text-cyan-300" />
                  فضاء مخصص للجامعة
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="science-card rounded-3xl border border-white/15 bg-white/[0.07] p-6 text-center shadow-xl backdrop-blur-md">
                <div className="science-float mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-200 shadow-lg shadow-cyan-950/20">
                  <Megaphone size={37} />
                </div>

                <h3 className="mt-5 text-lg font-black !text-white">
                  لوحة إعلانات الجامعة
                </h3>

                <p className="mt-3 text-xs font-medium leading-7 !text-blue-100">
                  ستظهر هنا الإعلانات والمنشورات الرسمية الخاصة بهذه الجامعة.
                </p>

                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-xs font-bold !text-amber-100">
                  <Bell size={15} />
                  فضاء الإعلانات قيد الإعداد
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-9 rounded-2xl border border-dashed border-cyan-300/25 bg-[#0b1b33]/70 p-7 text-center sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/10 text-blue-200">
              <FileText size={27} />
            </div>

            <h3 className="mt-4 text-base font-black !text-white sm:text-lg">
              لا توجد إعلانات منشورة حالياً
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-xs font-medium leading-7 !text-blue-200 sm:text-sm">
              ستُعرض هنا الإعلانات الجامعية فور نشرها من طرف الحسابات
              التي تمتلك صلاحية النشر المعتمدة.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-[11px] font-bold !text-violet-100">
              <ShieldCheck size={14} />
              صلاحيات النشر ستُدار من لوحة الإدارة
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERSITY INFORMATION */}

      <section className="border-y border-slate-200 bg-white py-20 dark:border-white/10 dark:bg-[#0d172c] sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                <Landmark size={15} />
                معلومات المؤسسة
              </div>

              <h2 className="text-3xl font-black leading-tight text-slate-800 dark:text-white sm:text-4xl">
                عن الجامعة
              </h2>

              <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
                تعرف على المؤسسة الجامعية، ومعلوماتها التعريفية والإدارية،
                ووسائل التواصل الرسمية المعتمدة لديها.
              </p>

              <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/80 p-5 dark:border-blue-500/20 dark:bg-blue-500/[0.08]">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-blue-700 shadow-sm dark:bg-[#17243d] dark:text-blue-300">
                    {university.logo_url ? (
                      <img
                        src={university.logo_url}
                        alt={university.name}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <University size={28} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-blue-800 dark:text-blue-200">
                      المؤسسة الجامعية
                    </p>
                    <p className="mt-1 break-words text-sm font-black leading-6 text-slate-800 dark:text-white">
                      {university.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[#f7f9ff] p-5 dark:border-white/10 dark:bg-[#111c34] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <FileText size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">
                    البيانات المؤسسية
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    المعلومات الرسمية للجامعة
                  </p>
                </div>
              </div>

              {informationItems.length > 0 && (
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {informationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#17243d]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {item.label}
                          </p>
                          <p className="mt-2 break-words text-sm font-bold text-slate-800 dark:text-white">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {(university.website_url ||
                university.official_email ||
                university.phone) && (
                <div className="mt-8 border-t border-slate-200 pt-6 dark:border-white/10">
                  <h4 className="font-black text-slate-800 dark:text-white">
                    قنوات التواصل الرسمية
                  </h4>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {university.website_url && (
                      <a
                        href={
                          /^https?:\/\//i.test(university.website_url)
                            ? university.website_url
                            : `https://${university.website_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-[#17243d]"
                      >
                        <Globe
                          size={19}
                          className="shrink-0 text-blue-700 dark:text-blue-300"
                        />
                        <span className="min-w-0 flex-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                          الموقع الإلكتروني
                        </span>
                        <ExternalLink
                          size={14}
                          className="shrink-0 text-slate-500 dark:text-slate-300"
                        />
                      </a>
                    )}

                    {university.official_email && (
                      <a
                        href={`mailto:${university.official_email}`}
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-300 hover:shadow-md dark:border-white/10 dark:bg-[#17243d]"
                      >
                        <Mail
                          size={19}
                          className="shrink-0 text-violet-700 dark:text-violet-300"
                        />
                        <span className="min-w-0 flex-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                          البريد الإلكتروني
                        </span>
                        <ExternalLink
                          size={14}
                          className="shrink-0 text-slate-500 dark:text-slate-300"
                        />
                      </a>
                    )}

                    {university.phone && (
                      <a
                        href={`tel:${university.phone.replace(/[^\d+]/g, "")}`}
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-[#17243d]"
                      >
                        <Phone
                          size={19}
                          className="shrink-0 text-cyan-700 dark:text-cyan-300"
                        />
                        <span className="min-w-0 flex-1 break-all text-xs font-bold text-slate-700 dark:text-slate-200">
                          {university.phone}
                        </span>
                        <ExternalLink
                          size={14}
                          className="shrink-0 text-slate-500 dark:text-slate-300"
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {informationItems.length === 0 &&
                !university.website_url &&
                !university.official_email &&
                !university.phone && (
                  <p className="mt-7 rounded-xl bg-white p-5 text-center text-sm font-medium text-slate-600 dark:bg-[#17243d] dark:text-slate-300">
                    لا توجد معلومات تعريفية إضافية لهذه الجامعة حالياً.
                  </p>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}

      <section className="relative isolate overflow-hidden bg-[#122448] px-5 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(59,130,246,.25),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-blue-200">
            <GraduationCap size={28} />
          </div>

          <p className="mt-6 text-xs font-bold tracking-[.18em] text-blue-200">
            UNISHARE ACADEMIC NETWORK
          </p>

          <h2 className="mt-4 text-2xl font-black leading-relaxed text-white sm:text-4xl">
            المعرفة تبدأ من هنا.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-blue-100 sm:text-base">
            اكتشف المسارات الأكاديمية، وتواصل مع المجتمع الجامعي، واجعل
            تجربتك التعليمية أكثر ارتباطاً وتنظيماً.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/universities")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-blue-800 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              استكشف جامعات أخرى
              <ArrowUpLeft size={17} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
            >
              انضم إلى UniShare
              <GraduationCap size={18} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
