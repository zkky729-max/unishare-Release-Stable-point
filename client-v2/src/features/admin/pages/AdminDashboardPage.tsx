import {
  Activity,
  ArrowUpLeft,
  Building2,
  FileText,
  GraduationCap,
  Layers3,
  Loader2,
  School,
  ShieldCheck,
  Users,
  BookOpen,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAdminStats } from "../hooks/useAdminStats";

export default function AdminDashboardPage() {
  const {
    stats,
    loading,
    error,
    refresh,
  } = useAdminStats();

  /*
   * =========================
   * Loading
   * =========================
   */

  if (loading && !stats) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
            <Loader2
              size={30}
              className="animate-spin"
            />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            جاري تحميل لوحة التحكم
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            يتم جلب إحصائيات منصة UniShare...
          </p>
        </div>
      </div>
    );
  }

  /*
   * =========================
   * Error
   * =========================
   */

  if (error && !stats) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Activity size={30} />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            تعذر تحميل الإحصائيات
          </h2>

          <p className="mt-3 break-words text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={refresh}
            className="mt-6 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  /*
   * =========================
   * Main statistics
   * =========================
   */

  const mainStats = [
    {
      title: "المستخدمون",
      value: stats.totalUsers,
      description: "إجمالي المستخدمين",
      icon: Users,
      path: "/admin/users",
    },

    {
      title: "الجامعات",
      value: stats.universities,
      description: "الجامعات المسجلة",
      icon: Building2,
      path: "/admin/universities",
    },

    {
      title: "الكليات",
      value: stats.faculties,
      description: "الكليات المسجلة",
      icon: School,
      path: "/admin/faculties",
    },

    {
      title: "المنشورات",
      value: stats.posts,
      description: "منشورات المنصة",
      icon: FileText,
      path: "/admin/posts",
    },
  ];

  /*
   * =========================
   * Academic statistics
   * =========================
   */

  const academicStats = [
    {
      title: "التخصصات",
      value: stats.specialties,
      icon: GraduationCap,
    },

    {
      title: "المستويات",
      value: stats.levels,
      icon: Layers3,
    },

    {
      title: "السداسيات",
      value: stats.semesters,
      icon: BookOpen,
    },

    {
      title: "الوحدات",
      value: stats.modules,
      icon: Layers3,
    },

    {
      title: "المواد",
      value: stats.subjects,
      icon: BookOpen,
    },
  ];

  /*
   * =========================
   * User roles
   * =========================
   */

  const userRoles = [
    {
      label: "الطلاب",
      value: stats.students,
    },

    {
      label: "الطلبة النخبة",
      value: stats.eliteStudents,
    },

    {
      label: "الأساتذة",
      value: stats.professors,
    },

    {
      label: "المدراء",
      value: stats.admins,
    },
  ];

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-7xl space-y-10"
    >
      {/* =================================
          Hero
      ================================= */}

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 p-7 shadow-xl lg:p-10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-green-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-xs font-bold text-green-300">
            <ShieldCheck size={15} />
            مركز التحكم الإداري
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                لوحة تحكم UniShare
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                مركز التحكم الرئيسي لإدارة المستخدمين،
                الجامعات، الهيكل الأكاديمي، المحتوى
                وإعدادات المنصة.
              </p>
            </div>

            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Activity
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              تحديث الإحصائيات
            </button>
          </div>
        </div>
      </section>

      {/* =================================
          Overview
      ================================= */}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-950">
            نظرة عامة
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            ملخص سريع لحالة المنصة.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {mainStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.title}
                to={stat.path}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                    <Icon size={22} />
                  </div>

                  <ArrowUpLeft
                    size={18}
                    className="text-slate-300 transition group-hover:text-green-600"
                  />
                </div>

                <p className="mt-6 text-sm font-bold text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-black text-slate-950">
                  {(stat.value ?? 0).toLocaleString("ar-DZ")}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {stat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =================================
          User distribution
      ================================= */}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-950">
            توزيع المستخدمين
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            توزيع الحسابات حسب الصلاحية والدور.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {userRoles.map((role) => (
            <div
              key={role.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-bold text-slate-500">
                {role.label}
              </p>

              <p className="mt-2 text-3xl font-black text-slate-950">
                {(role.value ?? 0).toLocaleString("ar-DZ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================
          Academic Structure
      ================================= */}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-950">
            الهيكل الأكاديمي
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            ملخص البنية الأكاديمية المسجلة في المنصة.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {academicStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon size={21} />
                </div>

                <p className="mt-5 text-sm font-bold text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-black text-slate-950">
                  {(stat.value ?? 0).toLocaleString("ar-DZ")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================
          Status
      ================================= */}

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
          تم تحميل الإحصائيات السابقة، لكن تعذر تحديث بعض البيانات.
        </div>
      )}
    </div>
  );
}