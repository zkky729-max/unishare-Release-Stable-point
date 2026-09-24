// =====================================================
// CONVERSATION
// =====================================================

export interface Conversation {
  id: string;

  created_at: string;

  updated_at: string;

  // ===================================================
  // OTHER USER
  // ===================================================

  other_user_id?: string;

  other_user_full_name?: string | null;

  other_user_username?: string | null;

  other_user_avatar_url?: string | null;

  // ===================================================
  // LAST MESSAGE
  // ===================================================

  last_message_content?: string | null;

  last_message_created_at?: string | null;

  // ===================================================
  // UNREAD MESSAGES
  // ===================================================

  unread_count?: number;
}

// =====================================================
// CONVERSATIONS RESPONSE
// =====================================================

export interface ConversationsResponse {
  success: boolean;

  data: Conversation[];

  message?: string;
}

// =====================================================
// USER SEARCH RESULT
// =====================================================

export interface UserSearchResult {
  userId: string;

  fullName: string | null;

  username: string | null;

  avatarUrl: string | null;
}

// =====================================================
// SEARCH USERS RESPONSE
// =====================================================

export interface SearchUsersResponse {
  success: boolean;

  data: UserSearchResult[];

  message?: string;
}

// =====================================================
// CREATE CONVERSATION RESPONSE
// =====================================================

export interface CreateConversationResponse {
  success: boolean;

  data: {
    conversationId: string;
  };

  message?: string;
}