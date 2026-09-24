import { supabase } from "../../../lib/supabaseClient";

export interface FriendRequest {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "pending";
  createdAt: string;
  updatedAt: string;

  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export interface FriendRequestsResponse {
  success: boolean;
  data?: {
    incoming: FriendRequest[];
    outgoing: FriendRequest[];
  };
  message?: string;
}

export async function getFriendRequests(): Promise<{
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
}> {
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

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/friends/requests`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result =
    (await response.json()) as FriendRequestsResponse;

  if (!response.ok) {
    throw new Error(
      result.message || "فشل تحميل طلبات الصداقة"
    );
  }

  return {
    incoming: result.data?.incoming ?? [],
    outgoing: result.data?.outgoing ?? [],
  };
}
