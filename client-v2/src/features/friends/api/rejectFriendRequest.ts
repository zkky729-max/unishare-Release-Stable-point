import { supabase } from "../../../lib/supabaseClient";

interface RejectFriendRequestResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export async function rejectFriendRequest(
  friendshipId: string
): Promise<unknown> {
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

  if (!friendshipId) {
    throw new Error("معرّف طلب الصداقة مطلوب");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/friends/requests/${friendshipId}/reject`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result =
    (await response.json()) as RejectFriendRequestResponse;

  if (!response.ok) {
    throw new Error(
      result.message || "فشل رفض طلب الصداقة"
    );
  }

  return result.data ?? null;
}
