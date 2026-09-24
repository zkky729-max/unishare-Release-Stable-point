import { supabase } from "../../../lib/supabaseClient";

import type {
  CreateConversationResponse,
} from "../types/message";

// =====================================================
// CREATE / OPEN DIRECT CONVERSATION
// =====================================================

export async function createConversation(
  otherUserId: string
): Promise<string> {
  const normalizedUserId =
    otherUserId.trim();

  if (!normalizedUserId) {
    throw new Error(
      "معرف المستخدم غير موجود"
    );
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    throw new Error(
      "المستخدم غير مسجل الدخول"
    );
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/messages/conversations`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${session.access_token}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        otherUserId: normalizedUserId,
      }),
    }
  );

  const result =
    (await response.json()) as CreateConversationResponse;

  if (!response.ok) {
    throw new Error(
      result.message ||
        "فشل إنشاء المحادثة"
    );
  }

  const conversationId =
    result.data?.conversationId;

  if (!conversationId) {
    throw new Error(
      "لم يتم الحصول على معرف المحادثة"
    );
  }

  return conversationId;
}
