
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface SendGroupChatMessageInput {
  content: string;
  reply_to?: string | null;
  attachment_url?: string | null;
  attachment_name?: string | null;
  attachment_type?: string | null;
}

export interface SentGroupChatMessage {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  reply_to: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  is_pinned: boolean;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// =====================================================
// API BASE
// =====================================================

const API_BASE_URL = `${
  import.meta.env.VITE_API_URL
}/api/group-chats`;

// =====================================================
// ACCESS TOKEN
// =====================================================

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error("Authentication required");
  }

  return session.access_token;
}

// =====================================================
// SEND GROUP CHAT MESSAGE
// =====================================================

export async function sendGroupChatMessage(
  groupId: string,
  input: SendGroupChatMessageInput
): Promise<SentGroupChatMessage> {
  if (!groupId?.trim()) {
    throw new Error("Group ID is required");
  }

  if (!input.content?.trim() && !input.attachment_url?.trim()) {
    throw new Error("Message content or attachment is required");
  }

  const token = await getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(groupId)}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: input.content,
        reply_to: input.reply_to ?? null,
        attachment_url: input.attachment_url ?? null,
        attachment_name: input.attachment_name ?? null,
        attachment_type: input.attachment_type ?? null,
      }),
    }
  );

  let result: ApiResponse<SentGroupChatMessage> | null = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(
      result?.message ??
        result?.error ??
        `Request failed (${response.status})`
    );
  }

  if (!result?.success || !result.data) {
    throw new Error(
      result?.message ??
        result?.error ??
        "Failed to send group chat message"
    );
  }

  return result.data;
}
