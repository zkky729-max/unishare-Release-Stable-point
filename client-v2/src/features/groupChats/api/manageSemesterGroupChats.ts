
import { supabase } from "@/lib/supabaseClient";

const API_BASE_URL = `${
  import.meta.env.VITE_API_URL
}/api/group-chats`;

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }

  return session.access_token;
}

async function parseResponse<T>(
  response: Response
): Promise<T> {
  let result: ApiResponse<T> | null = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.message ??
        result?.error ??
        `فشل تنفيذ الطلب (${response.status})`
    );
  }

  if (result.data === undefined) {
    throw new Error("لم يتم استلام بيانات صحيحة من الخادم.");
  }

  return result.data;
}

// =====================================================
// CREATE ACADEMIC SEMESTER GROUP
// =====================================================

export async function createSemesterGroupChat(input: {
  name: string;
  description?: string;
  semesterId: string;
}): Promise<string> {
  const name = input.name.trim();
  const semesterId = input.semesterId.trim();
  const description = input.description?.trim() || null;

  if (name.length < 2 || name.length > 100) {
    throw new Error(
      "اسم المجموعة يجب أن يكون بين حرفين و100 حرف."
    );
  }

  if (!semesterId) {
    throw new Error("معرف السداسي غير موجود.");
  }

  const token = await getAccessToken();

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      groupType: "academic",
      semesterId,
      isPrivate: false,
    }),
  });

  const data = await parseResponse<{
    groupId: string;
  }>(response);

  if (!data.groupId) {
    throw new Error("تم إرسال الطلب لكن لم يتم استلام معرف المجموعة.");
  }

  return data.groupId;
}

// =====================================================
// JOIN GROUP USING INVITATION TOKEN
// =====================================================

export async function joinGroupChatByToken(
  invitationToken: string
): Promise<string> {
  const tokenValue = invitationToken.trim();

  if (!/^[a-f0-9]{64}$/i.test(tokenValue)) {
    throw new Error(
      "رمز الدعوة غير صالح. تأكد من نسخ الرمز المكوّن من 64 خانة."
    );
  }

  const accessToken = await getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/invitations/accept-link`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: tokenValue,
      }),
    }
  );

  const data = await parseResponse<{
    groupId: string;
  }>(response);

  if (!data.groupId) {
    throw new Error("تعذر تحديد المجموعة بعد قبول الدعوة.");
  }

  return data.groupId;
}
