import { supabase } from "../../../lib/supabaseClient";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface MessagesResponse {
  success: boolean;
  data: Message[];
  message?: string;
}

export async function getMessages(
  conversationId: string
): Promise<Message[]> {
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
    `https://unishare-api-ivory.vercel.app/api/messages/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result =
    (await response.json()) as MessagesResponse;

  if (!response.ok) {
    throw new Error(
      result.message ||
        "فشل تحميل الرسائل"
    );
  }

  if (!result.success) {
    throw new Error(
      result.message ||
        "فشل تحميل الرسائل"
    );
  }

  return result.data ?? [];
}