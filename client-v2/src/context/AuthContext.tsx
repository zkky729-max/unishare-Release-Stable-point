import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabaseClient";
import type { UserRole } from "../types/roles";

// =====================================================
// Profile
// =====================================================

export interface Profile {
  id: string;
  user_id: string;

  full_name: string | null;
  username: string | null;

  avatar_url: string | null;
  avatar_id: string | null;
  avatar_type: string | null;

  bio: string | null;
  age: number | null;

  faculty_id: string | null;
  specialty_id: string | null;
  level_id: string | null;
  semester_id: string | null;
  module_id: string | null;

  role: UserRole;

  created_at: string;
}

// =====================================================
// Auth Context Type
// =====================================================

interface AuthContextType {
  user: User | null;
  profile: Profile | null;

  loading: boolean;

  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

// =====================================================
// Context
// =====================================================

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

// =====================================================
// Provider Props
// =====================================================

interface Props {
  children: ReactNode;
}

// =====================================================
// Auth Provider
// =====================================================

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ===================================================
  // Load Profile
  // ===================================================

  async function loadProfile(
    userId: string
  ): Promise<Profile | null> {
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "Profile loading error:",
        error.message
      );

      setProfile(null);

      return null;
    }

    const nextProfile =
      data as Profile | null;

    console.log(
      "AUTH PROFILE:",
      {
        userId,
        profileUserId:
          nextProfile?.user_id,
        role:
          nextProfile?.role,
        username:
          nextProfile?.username,
      }
    );

    setProfile(nextProfile);

    return nextProfile;
  }

  // ===================================================
  // Reload Profile
  // ===================================================

  async function reloadProfile() {
    if (!user) {
      setProfile(null);
      return;
    }

    await loadProfile(user.id);
  }

  // ===================================================
  // Load authenticated user
  // ===================================================

  async function loadAuthenticatedUser() {
    try {
      const {
        data: {
          user: authenticatedUser,
        },
        error,
      } =
        await supabase.auth.getUser();

      if (error) {
        console.error(
          "Auth user error:",
          error.message
        );

        setUser(null);
        setProfile(null);

        return;
      }

      if (!authenticatedUser) {
        setUser(null);
        setProfile(null);

        return;
      }

      setUser(authenticatedUser);

      await loadProfile(
        authenticatedUser.id
      );
    } catch (error) {
      console.error(
        "Authenticated user loading error:",
        error
      );

      setUser(null);
      setProfile(null);
    }
  }

  // ===================================================
  // Auth Initialization
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        await loadAuthenticatedUser();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void initializeAuth();

    // =================================================
    // Auth State Listener
    // =================================================

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!mounted) {
            return;
          }

          console.log(
            "AUTH EVENT:",
            event,
            session?.user?.id ?? null
          );

          if (
            event === "SIGNED_OUT" ||
            !session?.user
          ) {
            setUser(null);
            setProfile(null);
            setLoading(false);

            return;
          }

          const currentUser =
            session.user;

          setUser(currentUser);

          /*
           * لا ننفذ await مباشرة داخل
           * onAuthStateChange.
           *
           * نترك callback سريعًا ثم نحمل
           * profile بشكل منفصل.
           */
          setTimeout(() => {
            if (!mounted) {
              return;
            }

            void (async () => {
              try {
                setLoading(true);

                const {
                  data: {
                    user: verifiedUser,
                  },
                  error,
                } =
                  await supabase.auth.getUser();

                if (
                  error ||
                  !verifiedUser
                ) {
                  if (!mounted) {
                    return;
                  }

                  setUser(null);
                  setProfile(null);

                  return;
                }

                if (
                  verifiedUser.id !==
                  currentUser.id
                ) {
                  console.error(
                    "AUTH USER MISMATCH:",
                    {
                      sessionUser:
                        currentUser.id,
                      verifiedUser:
                        verifiedUser.id,
                    }
                  );

                  if (!mounted) {
                    return;
                  }

                  setUser(null);
                  setProfile(null);

                  return;
                }

                if (!mounted) {
                  return;
                }

                setUser(
                  verifiedUser
                );

                await loadProfile(
                  verifiedUser.id
                );
              } catch (error) {
                console.error(
                  "Profile loading after auth event error:",
                  error
                );

                if (mounted) {
                  setProfile(null);
                }
              } finally {
                if (mounted) {
                  setLoading(false);
                }
              }
            })();
          }, 0);
        }
      );

    // =================================================
    // Cleanup
    // =================================================

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ===================================================
  // Profile Realtime Synchronization
  // ===================================================

  useEffect(() => {
    const userId = user?.id;

    if (!userId) {
      return;
    }

    let mounted = true;

    const channel = supabase
      .channel(
        `profile-sync-${userId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          if (!mounted) {
            return;
          }

          console.log(
            "PROFILE REALTIME UPDATE:",
            {
              event: payload.eventType,
              userId,
            }
          );

          /*
           * نعيد تحميل Profile من قاعدة البيانات
           * بدل الاعتماد على payload مباشرة.
           *
           * هذا يضمن أن AuthContext يحصل
           * على أحدث نسخة كاملة من Profile.
           */
          await loadProfile(userId);
        }
      )
      .subscribe((status) => {
        console.log(
          "PROFILE REALTIME STATUS:",
          status,
          userId
        );
      });

    return () => {
      mounted = false;

      void supabase.removeChannel(
        channel
      );
    };
  }, [user?.id]);

  // ===================================================
  // Sign Out
  // ===================================================

  async function signOut() {
    const {
      error,
    } = await supabase.auth.signOut();

    if (error) {
      console.error(
        "Sign out error:",
        error.message
      );

      throw new Error(
        error.message
      );
    }

    setUser(null);
    setProfile(null);
    setLoading(false);
  }

  // ===================================================
  // Provider
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        reloadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// useAuth
// =====================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be inside AuthProvider"
    );
  }

  return context;
}