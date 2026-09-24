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
    if (!profile) {
      return;
    }

    setAcademicLoading(true);
    setPostsLoading(true);

    try {
      let universityId: string | null = null;
      let universityName: string | null = null;
      let facultyName: string | null = null;
      let specialtyName: string | null = null;

      // ===================================================
      // Faculty
      // ===================================================

      if (profile.faculty_id) {
        const {
          data: faculty,
          error: facultyError,
        } = await supabase
          .from("faculties")
          .select("name, university_id")
          .eq(
            "id",
            profile.faculty_id
          )
          .maybeSingle();

        if (facultyError) {
          console.error(
            "Dashboard faculty error:",
            facultyError
          );
        }

        facultyName =
          faculty?.name ?? null;

        universityId =
          faculty?.university_id ?? null;

        // ===============================================
        // University
        // ===============================================

        if (universityId) {
          const {
            data: university,
            error: universityError,
          } = await supabase
            .from("universities")
            .select("name")
            .eq(
              "id",
              universityId
            )
            .maybeSingle();

          if (universityError) {
            console.error(
              "Dashboard university error:",
              universityError
            );
          }

          universityName =
            university?.name ?? null;
        }
      }

      // ===================================================
      // Specialty
      // ===================================================

      if (profile.specialty_id) {
        const {
          data: specialty,
          error: specialtyError,
        } = await supabase
          .from("specialties")
          .select("name")
          .eq(
            "id",
            profile.specialty_id
          )
          .maybeSingle();

        if (specialtyError) {
          console.error(
            "Dashboard specialty error:",
            specialtyError
          );
        }

        specialtyName =
          specialty?.name ?? null;
      }

      // ===================================================
      // Save Academic Data
      // ===================================================

      setAcademic({
        universityId,
        universityName,
        facultyName,
        specialtyName,
      });

      setAcademicLoading(false);

      // ===================================================
      // University Posts
      // ===================================================

      if (universityId) {
        try {
          const posts =
            await getPosts(
              "all",
              {
                universityId,
                limit: 5,
              }
            );

          setUniversityPosts(
            posts
          );
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

      navigate(
        "/login",
        {
          replace: true,
        }
      );
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
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
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
        <div className="w-full max-w-sm rounded-2xl border bg-white p-6 text-center shadow-sm sm:rounded-3xl sm:p-8">
          <UserRound
            size={38}
            className="mx-auto text-gray-400"
          />

          <p className="mt-4 text-gray-600">
            لم يتم العثور على بيانات الحساب.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
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

  return (
    <div
      dir="rtl"
      className="mx-auto w-full max-w-7xl space-y-3 px-2 pb-6 sm:space-y-6 sm:px-0"
    >
      {/* ================================================= */}
      {/* Welcome */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-4 text-white shadow-md sm:rounded-3xl sm:p-8">
        <div className="relative z-10 flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-100 sm:text-sm">
              مرحباً بعودتك 👋
            </p>

            <h1 className="mt-1.5 truncate text-2xl font-bold tracking-tight sm:mt-2 sm:text-4xl">
              {displayName}
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-blue-100 sm:mt-3 sm:text-base sm:leading-6">
              هذه مساحتك الأكاديمية في UniShare.
              يمكنك متابعة جامعتك والوصول بسرعة إلى
              مسارك والموارد التعليمية.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-xs font-medium backdrop-blur transition hover:bg-white/25 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <UserRound size={16} />

              الملف الشخصي
            </button>

            <button
              type="button"
              onClick={
                handleSignOut
              }
              className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <LogOut size={16} />

              خروج
            </button>
          </div>
        </div>

        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

        <div className="absolute -bottom-24 right-5 h-52 w-52 rounded-full bg-violet-400/20 blur-3xl sm:-bottom-32 sm:right-10 sm:h-72 sm:w-72" />
      </section>

      {/* ================================================= */}
      {/* Academic Identity */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm sm:rounded-3xl">
        <div className="border-b px-4 py-3.5 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-11 sm:w-11 sm:rounded-xl">
              <GraduationCap
                size={20}
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                مساري الأكاديمي
              </h2>

              <p className="text-xs text-gray-500 sm:text-sm">
                المسار المرتبط بحسابك
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          {academicLoading ? (
            <div className="grid gap-2.5 sm:gap-4 md:grid-cols-3">
              {[
                1,
                2,
                3,
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-gray-100 sm:h-28 sm:rounded-2xl"
                  />
                )
              )}
            </div>
          ) : (
            <div className="grid gap-2.5 sm:gap-4 md:grid-cols-3">
              <AcademicItem
                icon={
                  <Building2
                    size={18}
                  />
                }
                label="الجامعة"
                value={
                  academic.universityName
                }
              />

              <AcademicItem
                icon={
                  <GraduationCap
                    size={18}
                  />
                }
                label="الكلية"
                value={
                  academic.facultyName
                }
              />

              <AcademicItem
                icon={
                  <BookOpen
                    size={18}
                  />
                }
                label="التخصص"
                value={
                  academic.specialtyName
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* Quick Access */}
      {/* ================================================= */}

      <section>
        <div className="mb-2.5 sm:mb-4">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            الوصول السريع
          </h2>

          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
            أهم الأماكن المرتبطة بمسارك الجامعي
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {/* Faculty */}

          <QuickCard
            icon={
              <GraduationCap
                size={21}
              />
            }
            title="كلية المستخدم"
            description="استكشف أقسام كليتك"
            disabled={
              !profile.faculty_id
            }
            onClick={() => {
              if (
                profile.faculty_id
              ) {
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
            icon={
              <BookOpen
                size={21}
              />
            }
            title="المسار الأكاديمي"
            description="انتقل إلى مسارك الأكاديمي"
            disabled={
              !profile.faculty_id
            }
            onClick={() => {
              if (
                profile.faculty_id
              ) {
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
            icon={
              <BookOpen
                size={21}
              />
            }
            title="الموارد التعليمية"
            description="الوصول إلى الموارد الدراسية"
            disabled={
              !profile.faculty_id
            }
            onClick={() => {
              if (
                profile.faculty_id
              ) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );

                return;
              }

              navigate(
                "/universities"
              );
            }}
          />
        </div>
      </section>

      {/* ================================================= */}
      {/* University Community */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm sm:rounded-3xl">
        <div className="flex flex-row items-center justify-between gap-2 border-b px-3.5 py-3.5 sm:flex-row sm:gap-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-11 sm:w-11 sm:rounded-xl">
              <MessageSquare
                size={19}
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-gray-900 sm:text-xl">
                مجتمع الجامعة
              </h2>

              <p className="mt-0.5 truncate text-xs text-gray-500 sm:mt-1 sm:text-sm">
                آخر المنشورات من جامعتك
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/posts")
            }
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700 sm:gap-2 sm:text-sm"
          >
            عرض الكل

            <ArrowLeft
              size={15}
            />
          </button>
        </div>

        <div className="p-2.5 sm:p-6">
          {postsLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {[
                1,
                2,
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-xl bg-gray-100 sm:h-44 sm:rounded-2xl"
                  />
                )
              )}
            </div>
          ) : universityPosts.length ===
            0 ? (
            <div className="rounded-xl border border-dashed bg-gray-50 px-4 py-8 text-center sm:rounded-2xl sm:px-6 sm:py-12">
              <MessageSquare
                size={30}
                className="mx-auto text-gray-400"
              />

              <h3 className="mt-3 text-sm font-semibold text-gray-800 sm:mt-4 sm:text-base">
                لا توجد منشورات بعد
              </h3>

              <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-gray-500 sm:mt-2 sm:text-sm sm:leading-6">
                ستظهر هنا آخر منشورات مجتمع جامعتك
                عندما يتم نشرها.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-5">
              {universityPosts.map(
                (post) => (
                  <PostCard
                    key={
                      post.id
                    }
                    post={post}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* Educational Resources */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm sm:rounded-3xl">
        <div className="border-b px-4 py-3.5 sm:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 sm:h-11 sm:w-11 sm:rounded-xl">
              <BookOpen
                size={19}
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-gray-900 sm:text-xl">
                الموارد التعليمية
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
                موارد مرتبطة بمسارك الأكاديمي
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-7 text-center sm:p-8">
          <BookOpen
            size={34}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-3 text-sm font-semibold text-gray-800 sm:mt-4 sm:text-base">
            الموارد التعليمية ستكون هنا
          </h3>

          <p className="mx-auto mt-1.5 max-w-lg text-xs leading-5 text-gray-500 sm:mt-2 sm:text-sm sm:leading-6">
            سنربط هذا القسم بالموارد التعليمية
            الموجودة فعليًا في المشروع، ونرتبها حسب
            الجامعة والتخصص والمستوى والسداسي والوحدة.
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* Continue Academic Journey */}
      {/* ================================================= */}

      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-600 sm:text-sm">
              مساحتك الأكاديمية
            </p>

            <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
              {academic.specialtyName ||
                academic.facultyName ||
                academic.universityName ||
                "ابدأ مسارك الأكاديمي"}
            </h2>

            <p className="mt-1.5 truncate text-xs text-gray-500 sm:mt-2 sm:text-sm">
              {[
                academic.universityName,
                academic.facultyName,
                academic.specialtyName,
              ]
                .filter(Boolean)
                .join(" • ") ||
                "لم يتم تحديد المسار الأكاديمي بعد"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (
                profile.faculty_id
              ) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );

                return;
              }

              navigate(
                "/universities"
              );
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-gray-800 sm:w-auto sm:py-3 sm:text-sm"
          >
            متابعة الدراسة

            <ArrowLeft
              size={17}
            />
          </button>
        </div>
      </section>
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
}

function AcademicItem({
  icon,
  label,
  value,
}: AcademicItemProps) {
  return (
    <div className="rounded-xl border bg-gray-50 p-3 sm:rounded-2xl sm:p-5">
      <div className="flex items-center gap-1.5 text-blue-600 sm:gap-2">
        {icon}

        <span className="text-[11px] font-medium text-gray-500 sm:text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-gray-900 sm:mt-4 sm:text-sm sm:leading-6">
        {value ||
          "غير محدد"}
      </p>
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
  onClick: () => void;
  disabled?: boolean;
}

function QuickCard({
  icon,
  title,
  description,
  onClick,
  disabled = false,
}: QuickCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "group rounded-xl border bg-white p-3.5 text-right shadow-sm transition sm:rounded-2xl sm:p-5",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white sm:h-11 sm:w-11 sm:rounded-xl">
          {icon}
        </div>

        <ArrowLeft
          size={16}
          className="text-gray-300 transition group-hover:-translate-x-1 group-hover:text-blue-600 sm:h-[18px] sm:w-[18px]"
        />
      </div>

      <h3 className="mt-3 text-sm font-bold text-gray-900 sm:mt-5 sm:text-base">
        {title}
      </h3>

      <p className="mt-0.5 text-xs leading-5 text-gray-500 sm:mt-1 sm:text-sm sm:leading-6">
        {description}
      </p>
    </button>
  );
}