import { supabase } from "../../../lib/supabaseClient";

export interface Friend {
  friendshipId: string;
  userId: string;
  status: "accepted";
  createdAt: string;
  updatedAt: string;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  facultyId: string | null;
  specialtyId: string | null;
  universityId: string | null;
}

interface FriendsResponse {
  success: boolean;
  data?: Friend[];
  message?: string;
}

export async function getFriends(): Promise<Friend[]> {
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
    "https://unishare-api-ivory.vercel.app/api/friends",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result =
    (await response.json()) as FriendsResponse;

  if (!response.ok) {
    throw new Error(
      result.message || "فشل تحميل قائمة الأصدقاء"
    );
  }

  return result.data ?? [];
}