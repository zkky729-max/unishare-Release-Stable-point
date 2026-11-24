
import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  Building2,
  GraduationCap,
  LogOut,
  MessageSquare,
  UserRound,
  Sparkles,
  LibraryBig,
  Compass,
  MapPin,
} from "lucide-react";

import {
  useAuth,
} from "../../auth/context/AuthContext";

import {
  supabase,
} from "../../../lib/supabaseClient";

import {
  getPosts,
} from "../../posts/api/getPosts";

import PostCard from "../../posts/components/PostCard";

import type {
  Post,
} from "../../posts/types/post";

interface AcademicData {
  universityId: string | null;
  universityName: string | null;
  facultyName: string | null;
  specialtyName: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    profile,
    loading: authLoading,
    signOut,
  } = useAuth();

  const [
    academic,
    setAcademic,
  ] = useState<AcademicData>({
    universityId: null,
    universityName: null,
    facultyName: null,
    specialtyName: null,
  });

  const [
    academicLoading,
    setAcademicLoading,
  ] = useState(true);

  const [
    universityPosts,
    setUniversityPosts,
  ] = useState<Post[]>([]);

  const [
    postsLoading,
    setPostsLoading,
  ] = useState(true);

  // =====================================================
  // Load Dashboard Data
  // =====================================================

  useEffect(() => {
    if (!profile) {
      setAcademicLoading(false);
      setPostsLoading(false);
      return;
    }

    loadDashboardData();
  }, [profile]);

  async function loadDashboardData() {
    if (!profile) return;

    setAcademicLoading(true);
    setPostsLoading(true);

    try {
      let universityId: string | null = null;
      let universityName: string | null = null;
      let facultyName: string | null = null;
      let specialtyName: string | null = null;

      // Faculty
      if (profile.faculty_id) {
        const {
          data: faculty,
          error: facultyError,
        } = await supabase
          .from("faculties")
          .select("name, university_id")
          .eq("id", profile.faculty_id)
          .maybeSingle();

        if (facultyError) {
          console.error(
            "Dashboard faculty error:",
            facultyError
          );
        }

        facultyName = faculty?.name ?? null;
        universityId = faculty?.university_id ?? null;

        // University
        if (universityId) {
          const {
            data: university,
            error: universityError,
          } = await supabase
            .from("universities")
            .select("name")
            .eq("id", universityId)
            .maybeSingle();

          if (universityError) {
            console.error(
              "Dashboard university error:",
              universityError
            );
          }

          universityName = university?.name ?? null;
        }
      }

      // Specialty
      if (profile.specialty_id) {
        const {
          data: specialty,
          error: specialtyError,
        } = await supabase
          .from("specialties")
          .select("name")
          .eq("id", profile.specialty_id)
          .maybeSingle();

        if (specialtyError) {
          console.error(
            "Dashboard specialty error:",
            specialtyError
          );
        }

        specialtyName = specialty?.name ?? null;
      }

      // Save Academic Data
      setAcademic({
        universityId,
        universityName,
        facultyName,
        specialtyName,
      });

      // University Posts
      if (universityId) {
        try {
          const posts = await getPosts(
            "all",
            {
              universityId,
              limit: 5,
            }
          );

          setUniversityPosts(posts);
        } catch (error) {
          console.error(
            "Dashboard university posts error:",
            error
          );

          setUniversityPosts([]);
        }
      } else {
        setUniversityPosts([]);
      }
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );

      setAcademic({
        universityId: null,
        universityName: null,
        facultyName: null,
        specialtyName: null,
      });

      setUniversityPosts([]);
    } finally {
      setAcademicLoading(false);
      setPostsLoading(false);
    }
  }

  // =====================================================
  // Logout
  // =====================================================

  async function handleSignOut() {
    try {
      await signOut();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  }

  // =====================================================
  // Loading
  // =====================================================

  if (authLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center px-4"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            جاري تحميل حسابك...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // No User
  // =====================================================

  if (!user || !profile) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center px-4"
      >
        <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <UserRound size={30} />
          </div>

          <p className="mt-5 font-medium text-gray-700 dark:text-gray-200">
            لم يتم العثور على بيانات الحساب.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // User Name
  // =====================================================

  const displayName =
    profile.full_name ||
    profile.username ||
    "الطالب";

  const academicPath = [
    academic.universityName,
    academic.facultyName,
    academic.specialtyName,
  ].filter(Boolean);

  return (
    <div
      dir="rtl"
      className="mx-auto w-full max-w-7xl space-y-6 px-2 pb-8 sm:space-y-8 sm:px-0"
    >
      {/* ================================================= */}
      {/* Welcome Hero */}
      {/* ================================================= */}

      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-5 text-white shadow-xl shadow-indigo-900/10 sm:rounded-[2rem] sm:p-8 lg:p-10">

        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

          <div className="min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50 backdrop-blur-md sm:text-sm">
              <Sparkles size={15} />
              مساحتك الأكاديمية
            </div>

            <p className="text-sm font-medium text-blue-100 sm:text-base">
              مرحباً بعودتك 👋
            </p>

            <h1 className="mt-2 break-words text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {displayName}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base sm:leading-8">
              تعلّم، شارك، واكتشف فرصاً جديدة.
              هنا تبدأ رحلتك الأكاديمية مع مجتمع
              UniShare.
            </p>

            {academic.universityName && (
              <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/90 backdrop-blur-md sm:text-sm">
                <MapPin size={15} className="shrink-0" />

                <span className="truncate">
                  {academic.universityName}
                </span>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-bold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25"
            >
              <UserRound size={17} />
              الملف الشخصي
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <LogOut size={17} />
              خروج
            </button>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* Academic Identity */}
      {/* ================================================= */}

      <section>
        <SectionHeading
          icon={<GraduationCap size={22} />}
          title="مساري الأكاديمي"
          description="تعرّف على هويتك ومسارك داخل الجامعة"
          color="blue"
        />

        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

          {academicLoading ? (
            <div className="grid gap-3 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              <AcademicItem
                icon={<Building2 size={23} />}
                label="الجامعة"
                value={academic.universityName}
                number="01"
                color="blue"
              />

              <AcademicItem
                icon={<GraduationCap size={23} />}
                label="الكلية"
                value={academic.facultyName}
                number="02"
                color="violet"
              />

              <AcademicItem
                icon={<BookOpen size={23} />}
                label="التخصص"
                value={academic.specialtyName}
                number="03"
                color="cyan"
              />
            </div>
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* Quick Access */}
      {/* ================================================= */}

      <section>
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
              الوصول السريع
            </h2>

            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              كل ما تحتاجه للوصول إلى عالمك الجامعي
            </p>
          </div>

          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 sm:flex">
            <Compass size={21} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {/* Faculty */}

          <QuickCard
            icon={<GraduationCap size={29} />}
            title="كلية المستخدم"
            description="اكتشف أقسام كليتك وتعرّف على التخصصات والمسارات المتاحة."
            label="استكشف الكلية"
            variant="blue"
            disabled={!profile.faculty_id}
            onClick={() => {
              if (profile.faculty_id) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );
              }
            }}
          />

          {/* Academic Path */}

          <QuickCard
            icon={<BookOpen size={29} />}
            title="المسار الأكاديمي"
            description="تصفّح المسارات الأكاديمية والمراحل الدراسية المرتبطة بك."
            label="اكتشف مسارك"
            variant="violet"
            disabled={!profile.faculty_id}
            onClick={() => {
              if (profile.faculty_id) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );
              }
            }}
          />

          {/* Resources */}

          <QuickCard
            icon={<LibraryBig size={29} />}
            title="الموارد التعليمية"
            description="توجّه إلى فضاء الدراسة للوصول إلى المحتوى الأكاديمي."
            label="تصفّح الموارد"
            variant="cyan"
            disabled={!profile.faculty_id}
            onClick={() => {
              if (profile.faculty_id) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );

                return;
              }

              navigate("/universities");
            }}
          />
        </div>
      </section>

      {/* ================================================= */}
      {/* University Community */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <MessageSquare size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white sm:text-xl">
                مجتمع الجامعة
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                آخر ما يشاركه مجتمعك الجامعي
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/70 sm:px-4 sm:text-sm"
          >
            عرض الكل
            <ArrowLeft size={15} />
          </button>
        </div>

        <div className="p-3 sm:p-6">
          {postsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : universityPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/50 px-4 py-10 text-center dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50 sm:py-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm dark:bg-gray-900">
                <MessageSquare size={29} />
              </div>

              <h3 className="mt-4 text-base font-bold text-gray-800 dark:text-white">
                لا توجد منشورات بعد
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-gray-500 dark:text-gray-400 sm:text-sm">
                ستظهر هنا آخر منشورات مجتمع جامعتك
                عندما يتم نشرها.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {universityPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* Educational Resources */}
      {/* ================================================= */}

      <section className="relative isolate overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:border-cyan-900/40 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">

        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/10" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-500/10" />

        <div className="relative z-10 flex flex-col items-center gap-5 p-6 text-center sm:p-9">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 sm:h-20 sm:w-20 sm:rounded-3xl">
            <LibraryBig size={34} />
          </div>

          <div className="max-w-xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">
              <Sparkles size={13} />
              فضاء المعرفة
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
              الموارد التعليمية
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
              مكان مخصص لاكتشاف الموارد الدراسية
              وتنظيمها حسب الجامعة والتخصص والمستوى
              والسداسي والوحدة التعليمية.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <ResourceTag label="الدروس" />
            <ResourceTag label="الملخصات" />
            <ResourceTag label="الامتحانات" />
            <ResourceTag label="البحوث" />
          </div>

          <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
            سيتم ربط هذا القسم بالموارد الموجودة فعلياً في المنصة.
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* Continue Academic Journey */}
      {/* ================================================= */}

      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-l from-gray-950 via-slate-900 to-indigo-950 p-5 text-white shadow-xl shadow-indigo-950/10 sm:p-7">

        <div className="pointer-events-none absolute -left-12 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
              <Sparkles size={16} />
              واصل رحلتك
            </div>

            <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
              {academic.specialtyName ||
                academic.facultyName ||
                academic.universityName ||
                "ابدأ مسارك الأكاديمي"}
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-gray-300 sm:text-sm">
              {academicPath.length > 0
                ? academicPath.join(" • ")
                : "اكتشف جامعتك وحدد مسارك الأكاديمي للانطلاق."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (profile.faculty_id) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );

                return;
              }

              navigate("/universities");
            }}
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-indigo-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-50 md:w-auto"
          >
            متابعة الدراسة
            <ArrowLeft size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

// =======================================================
// Section Heading
// =======================================================

interface SectionHeadingProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: "blue";
}

function SectionHeading({
  icon,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-center gap-3 sm:mb-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl">
          {title}
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

// =======================================================
// Academic Item
// =======================================================

interface AcademicItemProps {
  icon: ReactNode;
  label: string;
  value: string | null;
  number: string;
  color: "blue" | "violet" | "cyan";
}

function AcademicItem({
  icon,
  label,
  value,
  number,
  color,
}: AcademicItemProps) {
  const styles = {
    blue: {
      icon: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
      number: "text-blue-200 dark:text-blue-900/60",
      border: "hover:border-blue-200 dark:hover:border-blue-800",
    },
    violet: {
      icon: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
      number: "text-violet-200 dark:text-violet-900/60",
      border: "hover:border-violet-200 dark:hover:border-violet-800",
    },
    cyan: {
      icon: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
      number: "text-cyan-200 dark:text-cyan-900/60",
      border: "hover:border-cyan-200 dark:hover:border-cyan-800",
    },
  };

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg dark:border-gray-800 dark:bg-gray-800/60 dark:hover:bg-gray-800 sm:p-5",
        styles[color].border,
      ].join(" ")}
    >
      <span className={`pointer-events-none absolute -left-1 -top-5 text-7xl font-black ${styles[color].number}`}>
        {number}
      </span>

      <div className="relative z-10 flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles[color].icon}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {label}
          </p>

          <p className="mt-1 line-clamp-2 text-sm font-extrabold leading-6 text-gray-900 dark:text-white sm:text-base">
            {value || "غير محدد"}
          </p>
        </div>
      </div>
    </div>
  );
}

// =======================================================
// Quick Card
// =======================================================

interface QuickCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant: "blue" | "violet" | "cyan";
}

function QuickCard({
  icon,
  title,
  description,
  label,
  onClick,
  disabled = false,
  variant,
}: QuickCardProps) {
  const styles = {
    blue: {
      background: "from-blue-600 via-blue-700 to-indigo-800",
      glow: "bg-cyan-300/20",
      icon: "bg-white/15 text-white",
      label: "text-blue-100",
      decoration: "border-white/10",
    },
    violet: {
      background: "from-violet-600 via-purple-700 to-indigo-900",
      glow: "bg-fuchsia-300/20",
      icon: "bg-white/15 text-white",
      label: "text-violet-100",
      decoration: "border-white/10",
    },
    cyan: {
      background: "from-cyan-600 via-teal-700 to-emerald-800",
      glow: "bg-emerald-300/20",
      icon: "bg-white/15 text-white",
      label: "text-cyan-100",
      decoration: "border-white/10",
    },
  };

  const style = styles[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "group relative isolate flex min-h-[215px] flex-col overflow-hidden rounded-3xl border p-5 text-right text-white shadow-lg transition duration-300 sm:min-h-[235px] sm:p-6",
        `bg-gradient-to-br ${style.background}`,
        style.decoration,
        disabled
          ? "cursor-not-allowed opacity-55"
          : "hover:-translate-y-1.5 hover:shadow-2xl active:translate-y-0",
      ].join(" ")}
    >
      <div className={`pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full ${style.glow} blur-3xl transition duration-500 group-hover:scale-150`} />

      <div className="pointer-events-none absolute -bottom-12 -right-8 h-40 w-40 rounded-full border-[24px] border-white/5" />

      <div className="relative z-10 flex w-full items-start justify-between">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.icon} shadow-inner backdrop-blur-md transition duration-300 group-hover:scale-110`}>
          {icon}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm transition duration-300 group-hover:-translate-x-1 group-hover:bg-white/20">
          <ArrowLeft size={18} />
        </div>
      </div>

      <div className="relative z-10 mt-auto pt-7">
        <h3 className="text-lg font-extrabold sm:text-xl">
          {title}
        </h3>

        <p className="mt-2 max-w-xs text-xs leading-6 text-white/80 sm:text-sm sm:leading-7">
          {description}
        </p>

        <div className={`mt-4 inline-flex items-center gap-2 text-xs font-bold ${style.label} sm:text-sm`}>
          {label}
          <ArrowLeft
            size={15}
            className="transition group-hover:-translate-x-1"
          />
        </div>
      </div>
    </button>
  );
}

// =======================================================
// Resource Tag
// =======================================================

function ResourceTag({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full border border-cyan-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-cyan-800 dark:border-cyan-900 dark:bg-gray-900/60 dark:text-cyan-300">
      {label}
    </span>
  );
}
