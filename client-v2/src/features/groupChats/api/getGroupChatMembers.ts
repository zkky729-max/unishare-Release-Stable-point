
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface GroupChatMember {
  id: string;
  group_id: string;
  profile_id: string;
  member_role: "owner" | "moderator" | "member";
  joined_at: string;
  last_read_at: string | null;
  is_muted: boolean;
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
// GET GROUP CHAT MEMBERS
// =====================================================

export async function getGroupChatMembers(
  groupId: string
): Promise<GroupChatMember[]> {
  if (!groupId?.trim()) {
    throw new Error("Group ID is required");
  }

  const token = await getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(groupId)}/members`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  let result: ApiResponse<GroupChatMember[]> | null = null;

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
        "Failed to load group chat members"
    );
  }

  return result.data;
}
