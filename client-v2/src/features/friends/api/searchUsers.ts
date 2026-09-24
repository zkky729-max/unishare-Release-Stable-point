import { supabase } from "../../../lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface UserSearchResult {
  userId: string;

  fullName: string | null;

  username: string | null;

  avatarUrl: string | null;

  bio: string | null;

  facultyId: string | null;

  specialtyId: string | null;

  universityId: string | null;
}

interface SearchUsersResponse {
  success: boolean;

  data?: UserSearchResult[];

  message?: string;
}

// =====================================================
// SEARCH USERS
// =====================================================
//
// البحث العام عن المستخدمين داخل UniShare.
//
// البحث بواسطة:
// - username
// - full_name
//
// المستخدم الحالي لا يظهر في النتائج.
// البريد الإلكتروني لا يتم طلبه أو إرجاعه.
//
// الحد الأدنى للبحث: حرفان.
// =====================================================

export async function searchUsers(
  query: string
): Promise<UserSearchResult[]> {
  // ---------------------------------------------------
  // Normalize query
  // ---------------------------------------------------

  const normalizedQuery =
    query.trim();

  // ---------------------------------------------------
  // الحد الأدنى للبحث
  // ---------------------------------------------------

  if (
    normalizedQuery.length < 2
  ) {
    return [];
  }

  // ---------------------------------------------------
  // الحصول على Session الحالية
  // ---------------------------------------------------

  const {
    data: {
      session,
    },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(
      sessionError.message
    );
  }

  if (!session) {
    throw new Error(
      "المستخدم غير مسجل الدخول"
    );
  }

  // ---------------------------------------------------
  // استدعاء Backend
  // ---------------------------------------------------

  const params =
    new URLSearchParams();

  params.set(
    "q",
    normalizedQuery
  );

  const response =
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/friends/users/search?${params.toString()}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${session.access_token}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  // ---------------------------------------------------
  // قراءة Response
  // ---------------------------------------------------

  const result =
    (await response.json()) as SearchUsersResponse;

  // ---------------------------------------------------
  // معالجة الخطأ
  // ---------------------------------------------------

  if (!response.ok) {
    throw new Error(
      result.message ||
        "فشل البحث عن المستخدمين"
    );
  }

  // ---------------------------------------------------
  // إرجاع النتائج
  // ---------------------------------------------------

  return result.data ?? [];
}
