
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface GroupChatDetails {
  id: string;
  name: string;
  description: string | null;
  group_type: string;
  semester_id: string | null;
  created_by: string;
  avatar_url: string | null;
  is_private: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
// GET GROUP CHAT DETAILS
// =====================================================

export async function getGroupChatDetails(
  groupId: string
): Promise<GroupChatDetails> {
  if (!groupId?.trim()) {
    throw new Error("Group ID is required");
  }

  const token = await getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(groupId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  let result: ApiResponse<GroupChatDetails> | null = null;

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
        "Failed to load group chat details"
    );
  }

  return result.data;
}
