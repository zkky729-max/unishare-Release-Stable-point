import { supabase } from "../../../lib/supabaseClient";

import type {
  Conversation,
  ConversationsResponse,
} from "../types/message";

export async function getConversations(): Promise<Conversation[]> {
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
    "https://unishare-api-ivory.vercel.app/api/messages/conversations",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result =
    (await response.json()) as ConversationsResponse;

  if (!response.ok) {
    throw new Error(
      result.message || "فشل تحميل المحادثات"
    );
  }

  return result.data ?? [];
}