
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface GroupChatMessage {
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
// GET GROUP CHAT MESSAGES
// =====================================================

export async function getGroupChatMessages(
  groupId: string,
  limit = 50
): Promise<GroupChatMessage[]> {
  if (!groupId?.trim()) {
    throw new Error("Group ID is required");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("Limit must be between 1 and 100");
  }

  const token = await getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(
      groupId
    )}/messages?limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  let result: ApiResponse<GroupChatMessage[]> | null = null;

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

  if (!result?.success || !Array.isArray(result.data)) {
    throw new Error(
      result?.message ??
        result?.error ??
        "Failed to load group chat messages"
    );
  }

  return result.data;
}
