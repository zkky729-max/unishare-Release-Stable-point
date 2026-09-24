import { supabase } from "../../../lib/supabaseClient";

export interface SentMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface SendMessageResponse {
  success: boolean;
  data?: SentMessage;
  message?: string;
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<SentMessage> {
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

  const normalizedContent =
    content.trim();

  if (!normalizedContent) {
    throw new Error(
      "لا يمكن إرسال رسالة فارغة"
    );
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/messages/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: normalizedContent,
      }),
    }
  );

  const rawBody = await response.text();

  let result: SendMessageResponse | null =
    null;

  try {
    if (rawBody) {
      result =
        JSON.parse(
          rawBody
        ) as SendMessageResponse;
    }
  } catch {
    throw new Error(
      `الخادم أعاد استجابة غير صالحة (HTTP ${response.status})`
    );
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
        `فشل إرسال الرسالة (HTTP ${response.status})`
    );
  }

  if (!result?.success) {
    throw new Error(
      result?.message ||
        "فشل إرسال الرسالة"
    );
  }

  if (!result.data) {
    throw new Error(
      "الخادم لم يُرجع الرسالة المرسلة"
    );
  }

  return result.data;
}