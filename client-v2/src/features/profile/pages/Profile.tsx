
import {
  ArrowLeft,
  Award,
  Calendar,
  Edit3,
  Gem,
  GraduationCap,
  Loader2,
  MapPin,
  MessageCircle,
  User,
  Sparkles,
  Network,
  BookOpen,
  Crown,
  ShieldCheck,
  Star,
  BrainCircuit,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { supabase } from "../../../lib/supabaseClient";

import PostCard from "../../posts/components/PostCard";
import type { Post } from "../../posts/types/post";
import { getPosts } from "../../posts/api/getPosts";

import {
  getUserGamification,
} from "../../gamification/api/gamification";

import type {
  UserGamification,
  GamificationBadge,
} from "../../gamification/types/gamification";

// =====================================================
// Types
// =====================================================

interface ProfileData {
  id: string;
  user_id: string;

  full_name: string | null;
  username: string | null;
  bio: string | null;

  age: number | null;

  avatar_url: string | null;

  faculty_id: string | null;
  specialty_id: string | null;
}

interface FacultyData {
  id: string;
  name: string;
}

interface SpecialtyData {
  id: string;
  name: string;
}

interface ProfileProps {
  userId?: string;
}

// =====================================================
// Component
// =====================================================

export default function Profile({
  userId: propUserId,
}: ProfileProps) {
  const { userId: routeUserId } = useParams();

  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [faculty, setFaculty] =
    useState<FacultyData | null>(null);

  const [specialty, setSpecialty] =
    useState<SpecialtyData | null>(null);

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [gamification, setGamification] =
    useState<UserGamification | null>(null);

  const [badges, setBadges] =
    useState<GamificationBadge[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ===================================================
  // Load Profile - Original Logic Preserved
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        setCurrentUserId(user?.id ?? null);

        const targetId =
          propUserId ??
          routeUserId ??
          user?.id;

        if (!targetId) {
          setError("لم يتم العثور على المستخدم.");
          setLoading(false);
          return;
        }

        // Profile

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(`
            id,
            user_id,
            full_name,
            username,
            bio,
            age,
            avatar_url,
            faculty_id,
            specialty_id
          `)
          .eq("user_id", targetId)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData) {
          setError("هذا الملف الشخصي غير موجود.");
          setLoading(false);
          return;
        }

        if (!mounted) return;

        setProfile(profileData as ProfileData);

        // Faculty

        if (profileData.faculty_id) {
          const {
            data: facultyData,
            error: facultyError,
          } = await supabase
            .from("faculties")
            .select("id, name")
            .eq("id", profileData.faculty_id)
            .maybeSingle();

          if (facultyError) {
            console.error(
              "PROFILE FACULTY ERROR:",
              facultyError
            );
          }

          if (mounted) {
            setFaculty(facultyData as FacultyData | null);
          }
        } else {
          setFaculty(null);
        }

        // Specialty

        if (profileData.specialty_id) {
          const {
            data: specialtyData,
            error: specialtyError,
          } = await supabase
            .from("specialties")
            .select("id, name")
            .eq("id", profileData.specialty_id)
            .maybeSingle();

          if (specialtyError) {
            console.error(
              "PROFILE SPECIALTY ERROR:",
              specialtyError
            );
          }

          if (mounted) {
            setSpecialty(
              specialtyData as SpecialtyData | null
            );
          }
        } else {
          setSpecialty(null);
        }

        // Posts

        try {
          const allPosts = await getPosts("all");

          const userPosts = allPosts.filter(
            (post) => post.author?.id === targetId
          );

          if (mounted) {
            setPosts(userPosts);
          }
        } catch (postsError) {
          console.error(
            "PROFILE POSTS ERROR:",
            postsError
          );

          if (mounted) {
            setPosts([]);
          }
        }

        // Gamification

        try {
          const userGamification =
            await getUserGamification(targetId);

          if (mounted) {
            setGamification(userGamification);
          }
        } catch (gamificationError) {
          console.error(
            "PROFILE GAMIFICATION ERROR:",
            gamificationError
          );

          if (mounted) {
            setGamification(null);
          }
        }

        // User Badges

        try {
          const {
            data: userBadgesData,
            error: userBadgesError,
          } = await supabase
            .from("user_badges")
            .select("badge_id")
            .eq("user_id", targetId);

          if (userBadgesError) throw userBadgesError;

          const badgeIds = (userBadgesData ?? [])
            .map((item) => item.badge_id)
            .filter(
              (id): id is string => Boolean(id)
            );

          if (badgeIds.length === 0) {
            if (mounted) setBadges([]);
          } else {
            const {
              data: badgesData,
              error: badgesError,
            } = await supabase
              .from("gamification_badges")
              .select(`
                id,
                name,
                description,
                icon,
                rarity,
                requirement_type,
                requirement_value,
                gem_reward,
                created_at
              `)
              .in("id", badgeIds);

            if (badgesError) throw badgesError;

            if (mounted) {
              setBadges(
                (badgesData ?? []) as GamificationBadge[]
              );
            }
          }
        } catch (badgesError) {
          console.error(
            "PROFILE BADGES ERROR:",
            badgesError
          );

          if (mounted) setBadges([]);
        }
      } catch (err) {
        console.error("PROFILE LOAD ERROR:", err);

        if (mounted) {
          setError(
            "حدث خطأ أثناء تحميل الملف الشخصي."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [propUserId, routeUserId]);

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center overflow-hidden bg-[#080f2b]"
      >
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 scale-150 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/20 bg-white/10 shadow-[0_0_40px_rgba(59,130,246,.2)] backdrop-blur-xl">
            <Loader2
              className="animate-spin text-cyan-300"
              size={34}
            />
          </div>

          <p className="mt-5 text-sm font-bold text-blue-100">
            جارٍ تجهيز هويتك الأكاديمية...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // Error
  // ===================================================

  if (error || !profile) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center bg-[#080f2b] px-4 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-blue-200">
          <User size={40} />
        </div>

        <h1 className="mt-6 text-xl font-black text-white">
          {error ?? "الملف الشخصي غير موجود"}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-violet-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1"
        >
          <ArrowLeft size={18} />
          العودة
        </button>
      </div>
    );
  }

  // ===================================================
  // Owner
  // ===================================================

  const isOwner =
    currentUserId === profile.user_id;

  // ===================================================
  // Display Helpers
  // ===================================================

  const displayName =
    profile.full_name ??
    profile.username ??
    "مستخدم";

  const gems = gamification?.gems ?? 0;

  // ===================================================
  // Render
  // ===================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#f4f7ff] text-slate-900"
    >
      <style>{`
        @keyframes profile-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes profile-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes profile-glow {
          0%, 100% { opacity: .45; }
          50% { opacity: 1; }
        }

        @keyframes profile-enter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-orbit {
          animation: profile-orbit 35s linear infinite;
          transform-origin: center;
        }

        .profile-float {
          animation: profile-float 5s ease-in-out infinite;
        }

        .profile-glow {
          animation: profile-glow 4s ease-in-out infinite;
        }

        .profile-enter {
          animation: profile-enter .7s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-orbit,
          .profile-float,
          .profile-glow,
          .profile-enter {
            animation: none !important;
          }
        }
      `}</style>

      {/* =================================================
          PROFILE HERO
      ================================================= */}

      <section className="relative isolate overflow-hidden bg-[#080f2d] text-white">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(37,99,235,.35),transparent_40%),radial-gradient(ellipse_at_90%_80%,rgba(124,58,237,.3),transparent_42%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(148,163,184,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.3)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-cyan-300/10" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-cyan-300/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:px-8">

          {/* Top Navigation */}

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur transition hover:bg-white/15"
            >
              <ArrowLeft size={17} />
              العودة
            </button>

            <div className="flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[10px] font-bold tracking-wider text-cyan-200 sm:text-xs">
              <Sparkles size={14} />
              ACADEMIC IDENTITY
            </div>

            {isOwner ? (
              <Link
                to="/profile/edit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-blue-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:shadow-cyan-500/20"
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">
                  تعديل الملف
                </span>
                <span className="sm:hidden">
                  تعديل
                </span>
              </Link>
            ) : (
              <div className="w-10" />
            )}
          </div>

          {/* Profile Main */}

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_auto]">

            <div className="profile-enter relative z-10">

              <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-bold text-violet-200">
                <BrainCircuit size={15} />
                هويتك داخل مجتمع المعرفة
              </div>

              <div className="mt-7 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-right">

                {/* Avatar */}

                <div className="relative shrink-0">

                  <div className="absolute -inset-3 rounded-[2.5rem] border border-cyan-300/20" />
                  <div className="profile-orbit absolute -inset-3 rounded-[2.5rem] border border-dashed border-violet-300/40" />

                  <div className="relative h-32 w-32 overflow-hidden rounded-[2rem] border-4 border-white/20 bg-gradient-to-br from-blue-500 to-violet-600 shadow-[0_0_45px_rgba(59,130,246,.35)] sm:h-36 sm:w-36">

                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                        <User size={54} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="absolute -bottom-3 -left-3 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-[#0c1535] bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg">
                    <GraduationCap size={22} />
                  </div>
                </div>

                {/* Identity */}

                <div className="min-w-0 flex-1 pt-1">

                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    {displayName}
                  </h1>

                  {profile.username && (
                    <p className="mt-2 text-sm font-semibold text-cyan-200">
                      @{profile.username}
                    </p>
                  )}

                  {profile.bio ? (
                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:mx-0 sm:text-base">
                      {profile.bio}
                    </p>
                  ) : (
                    <p className="mt-5 text-sm text-slate-400">
                      المعرفة رحلة، وكل يوم فرصة جديدة للتطور.
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">

                    {faculty && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-blue-300/20 bg-blue-400/10 px-3 py-2 text-xs font-semibold text-blue-100">
                        <GraduationCap size={15} />
                        {faculty.name}
                      </div>
                    )}

                    {specialty && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-100">
                        <MapPin size={15} />
                        {specialty.name}
                      </div>
                    )}

                    {profile.age !== null && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100">
                        <Calendar size={15} />
                        {profile.age} سنة
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Identity Visual */}

            <div className="profile-enter relative mx-auto hidden h-64 w-64 items-center justify-center lg:flex">

              <div className="absolute inset-0 rounded-full border border-cyan-300/15" />
              <div className="profile-orbit absolute inset-5 rounded-full border border-dashed border-blue-300/30" />
              <div className="absolute inset-12 rounded-full border border-violet-300/20" />

              <div className="absolute inset-12 rounded-full bg-blue-500/15 blur-3xl" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/20 bg-gradient-to-br from-blue-500 to-violet-600 shadow-[0_0_55px_rgba(99,102,241,.4)]">
                <GraduationCap size={50} className="text-white" />
              </div>

              <div className="profile-float absolute right-3 top-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200 shadow-xl backdrop-blur">
                <Gem size={23} />
              </div>

              <div className="profile-float absolute bottom-7 left-1 text-violet-200" style={{ animationDelay: "-2s" }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur">
                  <Award size={23} />
                </div>
              </div>

              <div className="profile-float absolute bottom-0 right-14 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-blue-200 shadow-xl backdrop-blur" style={{ animationDelay: "-1s" }}>
                <Star size={20} />
              </div>
            </div>
          </div>

          {/* Hero Bottom */}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <ShieldCheck size={16} className="text-cyan-300" />
              هويتك الأكاديمية في UniShare
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.9)]" />
              المعرفة تصنع الفرق
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="relative mx-auto max-w-7xl space-y-9 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Posts */}

          <div className="profile-enter group relative overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-100/60 blur-2xl transition group-hover:bg-blue-200/70" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  المنشورات
                </p>
                <p className="mt-3 text-4xl font-black tabular-nums text-slate-900">
                  {posts.length}
                </p>
                <p className="mt-2 text-xs text-blue-600">
                  مساهماتك في المجتمع
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                <MessageCircle size={27} />
              </div>
            </div>
          </div>

          {/* Gems */}

          <div className="profile-enter group relative overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/5">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-amber-100/60 blur-2xl transition group-hover:bg-amber-200/70" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  الجواهر
                </p>
                <p className="mt-3 text-4xl font-black tabular-nums text-slate-900">
                  {gems}
                </p>
                <p className="mt-2 text-xs text-amber-600">
                  رصيدك من الإنجازات
                </p>
              </div>

              <div className="profile-glow flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20">
                <Gem size={27} />
              </div>
            </div>
          </div>

          {/* Badges */}

          <div className="profile-enter group relative overflow-hidden rounded-[1.75rem] border border-violet-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/5">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-violet-100/60 blur-2xl transition group-hover:bg-violet-200/70" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  الشارات
                </p>
                <p className="mt-3 text-4xl font-black tabular-nums text-slate-900">
                  {badges.length}
                </p>
                <p className="mt-2 text-xs text-violet-600">
                  إنجازاتك المكتسبة
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20">
                <Award size={27} />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            ACHIEVEMENTS
        ================================================= */}

        <section className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">

          {/* Gems Card */}

          <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#101a40] p-7 text-white shadow-xl shadow-blue-950/10">

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(245,158,11,.25),transparent_45%),radial-gradient(ellipse_at_90%_90%,rgba(124,58,237,.2),transparent_45%)]" />

            <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full border border-amber-200/10" />
            <div className="pointer-events-none absolute -left-5 -top-5 h-32 w-32 rounded-full border border-amber-200/10" />

            <div className="relative">

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold tracking-widest text-amber-200">
                    YOUR GEM WALLET
                  </div>

                  <h2 className="mt-2 text-2xl font-black">
                    محفظة الجواهر
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-amber-300">
                  <Gem size={25} />
                </div>
              </div>

              <div className="mt-9 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-[0_0_35px_rgba(245,158,11,.25)]">
                  <Gem size={34} />
                </div>

                <div>
                  <div className="text-4xl font-black tabular-nums">
                    {gems}
                  </div>

                  <p className="mt-1 text-xs font-semibold text-amber-100/70">
                    جوهرة
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-100">
                  <Sparkles size={17} />
                  كل مساهمة لها قيمة
                </div>

                <p className="mt-2 text-xs leading-7 text-slate-300">
                  جواهرك تعكس مساهماتك وإنجازاتك
                  داخل مجتمع UniShare.
                </p>
              </div>
            </div>
          </div>

          {/* Badges Card */}

          <div className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-white p-6 shadow-sm sm:p-7">

            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-violet-100/60 blur-3xl" />

            <div className="relative">

              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold tracking-widest text-violet-600">
                    YOUR ACHIEVEMENTS
                  </div>

                  <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                    قاعة الإنجازات
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    الشارات التي حصل عليها صاحب الحساب
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20">
                  <Crown size={24} />
                </div>
              </div>

              {badges.length === 0 ? (
                <div className="mt-7 rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-7 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-400 shadow-sm">
                    <Award size={29} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-800">
                    رحلتك نحو الإنجاز تبدأ هنا
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    لم يحصل صاحب هذا الحساب على شارات بعد.
                    واصل التعلم والمشاركة!
                  </p>
                </div>
              ) : (
                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="group flex items-center gap-3 rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-50/80 to-white p-4 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20 transition group-hover:rotate-6">
                        <Award size={24} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-800">
                          {badge.name}
                        </p>

                        {badge.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {badge.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-violet-600">
                <Star size={15} />
                {badges.length} إنجاز مكتسب
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            POSTS SECTION
        ================================================= */}

        <section>

          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <Network size={14} />
                KNOWLEDGE CONTRIBUTIONS
              </div>

              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                بصمتك في المجتمع
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                الأفكار والمعرفة التي شاركها صاحب هذا الحساب.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-sm">
              <MessageCircle size={17} />
              {posts.length} منشور
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">

              <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-xl shadow-blue-500/20">
                <BookOpen size={36} />
              </div>

              <h3 className="relative mt-6 text-xl font-black text-slate-900">
                لم تبدأ قصة المشاركة بعد
              </h3>

              <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                لا توجد منشورات لهذا الحساب حتى الآن.
                كل فكرة عظيمة تبدأ بمشاركة صغيرة.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className="group relative h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/[0.06]"
                >
                  <div
                    className={`h-1 w-full ${
                      index % 4 === 0
                        ? "bg-gradient-to-l from-blue-500 to-cyan-400"
                        : index % 4 === 1
                        ? "bg-gradient-to-l from-violet-500 to-fuchsia-400"
                        : index % 4 === 2
                        ? "bg-gradient-to-l from-cyan-500 to-teal-400"
                        : "bg-gradient-to-l from-indigo-500 to-blue-400"
                    }`}
                  />

                  <div className="relative h-full">
                    <PostCard post={post} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* =================================================
            PROFILE FOOTER
        ================================================= */}

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#111b45] via-[#1b2e68] to-[#263c83] p-7 text-white shadow-xl shadow-blue-900/10 sm:p-9">

          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -left-5 -top-5 h-32 w-32 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -bottom-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-right">

            <div>
              <div className="flex items-center justify-center gap-2 text-cyan-200 sm:justify-start">
                <Sparkles size={17} />
                <span className="text-xs font-bold tracking-widest">
                  UNISHARE IDENTITY
                </span>
              </div>

              <h3 className="mt-3 text-xl font-black sm:text-2xl">
                رحلتك الأكاديمية مستمرة.
              </h3>

              <p className="mt-2 text-sm leading-7 text-blue-100/80">
                تعلّم أكثر، شارك أكثر، واترك أثراً.
              </p>
            </div>

            {isOwner && (
              <Link
                to="/profile/edit"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:shadow-white/10"
              >
                <Edit3 size={17} />
                طوّر هويتك
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
