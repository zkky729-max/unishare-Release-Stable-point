import { supabase } from "../../../lib/supabaseClient";

import type {
  SearchUsersResponse,
  UserSearchResult,
} from "../types/message";

// =====================================================
// SEARCH USERS
// =====================================================

export async function searchUsers(
  query: string
): Promise<UserSearchResult[]> {
  const normalizedQuery = query.trim();

  // لا نرسل طلبات بحث قصيرة
  if (normalizedQuery.length < 2) {
    return [];
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    throw new Error("المستخدم غير مسجل الدخول");
  }

  const params = new URLSearchParams();

  params.set("q", normalizedQuery);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/messages/users/search?${params.toString()}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${session.access_token}`,

        "Content-Type": "application/json",
      },
    }
  );

  const result =
    (await response.json()) as SearchUsersResponse;

  if (!response.ok) {
    throw new Error(
      result.message || "فشل البحث عن المستخدمين"
    );
  }

  return result.data ?? [];
}
