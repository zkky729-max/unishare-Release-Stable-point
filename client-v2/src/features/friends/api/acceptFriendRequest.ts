import { supabase } from "../../../lib/supabaseClient";

interface AcceptFriendRequestResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export async function acceptFriendRequest(
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
    `https://unishare-api-ivory.vercel.app/api/friends/requests/${friendshipId}/accept`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result =
    (await response.json()) as AcceptFriendRequestResponse;

  if (!response.ok) {
    throw new Error(
      result.message || "فشل قبول طلب الصداقة"
    );
  }

  return result.data ?? null;
}