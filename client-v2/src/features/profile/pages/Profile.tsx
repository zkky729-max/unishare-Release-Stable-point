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
  const { userId: routeUserId } =
    useParams();

  const navigate = useNavigate();

  // ===================================================
  // Current User
  // ===================================================

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  // ===================================================
  // Profile
  // ===================================================

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [faculty, setFaculty] =
    useState<FacultyData | null>(null);

  const [specialty, setSpecialty] =
    useState<SpecialtyData | null>(null);

  // ===================================================
  // Posts
  // ===================================================

  const [posts, setPosts] =
    useState<Post[]>([]);

  // ===================================================
  // Gamification
  // ===================================================

  const [gamification, setGamification] =
    useState<UserGamification | null>(
      null
    );

  const [badges, setBadges] =
    useState<GamificationBadge[]>([]);

  // ===================================================
  // Loading
  // ===================================================

  const [loading, setLoading] =
    useState(true);

  // ===================================================
  // Error
  // ===================================================

  const [error, setError] =
    useState<string | null>(null);

  // ===================================================
  // Load Profile
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        // =============================================
        // Current User
        // =============================================

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (!mounted) return;

        setCurrentUserId(
          user?.id ?? null
        );

        const targetId =
          propUserId ??
          routeUserId ??
          user?.id;

        if (!targetId) {
          setError(
            "لم يتم العثور على المستخدم."
          );

          setLoading(false);
          return;
        }

        // =============================================
        // Profile
        // =============================================

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
          .eq(
            "user_id",
            targetId
          )
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profileData) {
          setError(
            "هذا الملف الشخصي غير موجود."
          );

          setLoading(false);
          return;
        }

        if (!mounted) return;

        setProfile(
          profileData as ProfileData
        );

        // =============================================
        // Faculty
        // =============================================

        if (
          profileData.faculty_id
        ) {
          const {
            data: facultyData,
            error: facultyError,
          } =
            await supabase
              .from("faculties")
              .select(`
                id,
                name
              `)
              .eq(
                "id",
                profileData.faculty_id
              )
              .maybeSingle();

          if (facultyError) {
            console.error(
              "PROFILE FACULTY ERROR:",
              facultyError
            );
          }

          if (mounted) {
            setFaculty(
              facultyData as FacultyData | null
            );
          }
        } else {
          setFaculty(null);
        }

        // =============================================
        // Specialty
        // =============================================

        if (
          profileData.specialty_id
        ) {
          const {
            data: specialtyData,
            error: specialtyError,
          } =
            await supabase
              .from("specialties")
              .select(`
                id,
                name
              `)
              .eq(
                "id",
                profileData.specialty_id
              )
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

        // =============================================
        // Posts
        // =============================================
        //
        // IMPORTANT:
        // We use getPosts() so every post has the
        // complete Post structure expected by PostCard.
        //
        // Then we keep only posts belonging to this
        // profile.
        // =============================================

        try {
          const allPosts =
            await getPosts("all");

          const userPosts =
            allPosts.filter(
              (post) =>
                post.author?.id ===
                targetId
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

        // =============================================
        // Gamification
        // =============================================

        try {
          const userGamification =
            await getUserGamification(
              targetId
            );

          if (mounted) {
            setGamification(
              userGamification
            );
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

        // =============================================
        // User Badges
        // =============================================

        try {
          const {
            data: userBadgesData,
            error: userBadgesError,
          } =
            await supabase
              .from("user_badges")
              .select(`
                badge_id
              `)
              .eq(
                "user_id",
                targetId
              );

          if (userBadgesError) {
            throw userBadgesError;
          }

          const badgeIds =
            (
              userBadgesData ?? []
            )
              .map(
                (item) =>
                  item.badge_id
              )
              .filter(
                (
                  id
                ): id is string =>
                  Boolean(id)
              );

          if (
            badgeIds.length ===
            0
          ) {
            if (mounted) {
              setBadges([]);
            }
          } else {
            const {
              data: badgesData,
              error: badgesError,
            } =
              await supabase
                .from(
                  "gamification_badges"
                )
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
                .in(
                  "id",
                  badgeIds
                );

            if (badgesError) {
              throw badgesError;
            }

            if (mounted) {
              setBadges(
                (badgesData ??
                  []) as GamificationBadge[]
              );
            }
          }
        } catch (badgesError) {
          console.error(
            "PROFILE BADGES ERROR:",
            badgesError
          );

          if (mounted) {
            setBadges([]);
          }
        }
      } catch (err) {
        console.error(
          "PROFILE LOAD ERROR:",
          err
        );

        if (mounted) {
          setError(
            "حدث خطأ أثناء تحميل الملف الشخصي."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [
    propUserId,
    routeUserId,
  ]);

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2
          className="w-8 h-8 animate-spin text-blue-600"
        />
      </div>
    );
  }

  // ===================================================
  // Error
  // ===================================================

  if (
    error ||
    !profile
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />

          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {error ??
              "الملف الشخصي غير موجود"}
          </h1>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // Owner
  // ===================================================

  const isOwner =
    currentUserId ===
    profile.user_id;

  // ===================================================
  // Render
  // ===================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50"
    >
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() =>
                navigate(-1)
              }
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة
            </button>

            {isOwner && (
              <Link
                to="/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Edit3 className="w-4 h-4" />
                تعديل الملف
              </Link>
            )}
          </div>

          {/* ================================================= */}
          {/* Profile Info */}
          {/* ================================================= */}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}

            <div className="shrink-0">
              {profile.avatar_url ? (
                <img
                  src={
                    profile.avatar_url
                  }
                  alt={
                    profile.full_name ??
                    "صورة المستخدم"
                  }
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>

            {/* Main Info */}

            <div className="flex-1 text-center md:text-right">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.full_name ??
                  profile.username ??
                  "مستخدم"}
              </h1>

              {profile.username && (
                <p className="text-slate-500 mt-1">
                  @{profile.username}
                </p>
              )}

              {profile.bio && (
                <p className="text-slate-600 mt-3 max-w-2xl leading-7">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                {faculty && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm">
                    <GraduationCap className="w-4 h-4" />
                    {faculty.name}
                  </div>
                )}

                {specialty && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm">
                    <MapPin className="w-4 h-4" />
                    {specialty.name}
                  </div>
                )}

                {profile.age !== null && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">
                    <Calendar className="w-4 h-4" />
                    {profile.age} سنة
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* Main */}
      {/* ================================================= */}

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* ================================================= */}
        {/* Stats */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {posts.length}
            </div>

            <div className="text-sm text-slate-500 mt-1">
              المنشورات
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {gamification?.gems ??
                0}
            </div>

            <div className="flex items-center justify-center gap-1 text-sm text-slate-500 mt-1">
              <Gem className="w-4 h-4" />
              الجواهر
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {badges.length}
            </div>

            <div className="flex items-center justify-center gap-1 text-sm text-slate-500 mt-1">
              <Award className="w-4 h-4" />
              الشارات
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* Gamification */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gems */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Gem className="w-5 h-5 text-amber-500" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  جواهري
                </h2>

                <p className="text-sm text-slate-500">
                  رصيد صاحب الحساب
                </p>
              </div>
            </div>

            <div className="text-4xl font-bold text-slate-900">
              {gamification?.gems ??
                0}
            </div>
          </div>

          {/* Badges */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  الشارات
                </h2>

                <p className="text-sm text-slate-500">
                  الإنجازات التي حصل عليها
                  صاحب الحساب
                </p>
              </div>
            </div>

            {badges.length ===
            0 ? (
              <p className="text-sm text-slate-500">
                لا توجد شارات بعد.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {badges.map(
                  (badge) => (
                    <div
                      key={
                        badge.id
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <Award className="w-4 h-4 text-purple-600" />

                      <span className="text-sm font-medium text-slate-700">
                        {
                          badge.name
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* Posts */}
        {/* ================================================= */}

        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                المنشورات
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                منشورات صاحب الحساب
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MessageCircle className="w-4 h-4" />
              {posts.length}
            </div>
          </div>

          {posts.length ===
          0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />

              <h3 className="font-semibold text-slate-800">
                لا توجد منشورات بعد
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                لم ينشر صاحب هذا الحساب
                أي منشور بعد.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map(
                (post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                  />
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}