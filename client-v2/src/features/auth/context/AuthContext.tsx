import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../../../lib/supabaseClient";
import type { UserRole } from "../../../types/roles";

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

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;

  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // تحميل Profile
  // =====================================================

  async function loadProfile(userId: string) {
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

    setProfile(nextProfile);

    return nextProfile;
  }

  // =====================================================
  // إعادة تحميل Profile
  // =====================================================

  async function reloadProfile() {
    if (!user) {
      setProfile(null);
      return;
    }

    await loadProfile(user.id);
  }

  // =====================================================
  // تهيئة المصادقة
  // =====================================================

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        /*
         * نتحقق من المستخدم الحقيقي عبر Supabase Auth.
         *
         * لا نعتمد على getSession() وحده
         * لاتخاذ قرار الحماية.
         */
        const {
          data: {
            user: authenticatedUser,
          },
          error,
        } =
          await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        // لا يوجد مستخدم مسجل الدخول
        if (
          error ||
          !authenticatedUser
        ) {
          setUser(null);
          setProfile(null);
          return;
        }

        // يوجد مستخدم مسجل الدخول
        setUser(authenticatedUser);

        await loadProfile(
          authenticatedUser.id
        );
      } catch (error) {
        console.error(
          "Auth initialization error:",
          error
        );

        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void initializeAuth();

    // ===================================================
    // مراقبة تغييرات Auth
    // ===================================================

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

          const currentUser =
            session?.user ?? null;

          // =============================================
          // تسجيل الخروج
          // =============================================

          if (
            event === "SIGNED_OUT" ||
            !currentUser
          ) {
            setUser(null);
            setProfile(null);
            setLoading(false);

            return;
          }

          // =============================================
          // يوجد مستخدم
          // =============================================

          setUser(currentUser);

          /*
           * نؤجل تحميل Profile إلى دورة لاحقة
           * حتى لا ننفذ استدعاء Supabase آخر
           * مباشرة داخل onAuthStateChange.
           */
          setTimeout(() => {
            if (!mounted) {
              return;
            }

            void (async () => {
              try {
                setLoading(true);

                await loadProfile(
                  currentUser.id
                );
              } catch (error) {
                console.error(
                  "Profile loading after auth change error:",
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

    // ===================================================
    // Cleanup
    // ===================================================

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // تسجيل الخروج
  // =====================================================

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

  // =====================================================
  // Provider
  // =====================================================

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

// =======================================================
// useAuth
// =======================================================

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