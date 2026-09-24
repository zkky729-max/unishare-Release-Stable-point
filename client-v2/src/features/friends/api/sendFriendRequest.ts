import { supabase } from "../../../lib/supabaseClient";

interface FriendRequestResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export async function sendFriendRequest(
  targetUserId: string
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

  if (!targetUserId) {
    throw new Error("معرّف المستخدم مطلوب");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/friends/requests`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetUserId,
      }),
    }
  );

  const result =
    (await response.json()) as FriendRequestResponse;

  if (!response.ok) {
    throw new Error(
      result.message || "فشل إرسال طلب الصداقة"
    );
  }

  return result.data ?? null;
}