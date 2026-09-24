import { createSupabaseRequestClient } from "../lib/supabaseRequest.js";

// =====================================================
// GET USER CONVERSATIONS
// =====================================================

export async function getUserConversations(
  accessToken: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_user_conversations"
  );

  if (error) {
    throw error;
  }

  return data ?? [];
}

// =====================================================
// CREATE / OPEN DIRECT CONVERSATION
// =====================================================

export async function createOrOpenDirectConversation(
  accessToken: string,
  otherUserId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedUserId =
    otherUserId.trim();

  if (!normalizedUserId) {
    throw new Error(
      "Other user is required"
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_or_create_direct_conversation",
    {
      p_other_user_id:
        normalizedUserId,
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "Conversation was not created"
    );
  }

  return data as string;
}

// =====================================================
// SEARCH USERS
// =====================================================
//
// البحث يتم بواسطة:
// - username
// - full_name
//
// لا يتم استخدام البريد الإلكتروني.
// لا يتم إرجاع البريد الإلكتروني.
// المستخدم الحالي يتم استبعاده.
// =====================================================

export async function searchUsers(
  accessToken: string,
  query: string,
  currentUserId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedQuery =
    query.trim();

  // ---------------------------------------------------
  // الحد الأدنى للبحث
  // ---------------------------------------------------

  if (
    normalizedQuery.length < 2
  ) {
    return [];
  }

  // ---------------------------------------------------
  // Search pattern
  // ---------------------------------------------------

  const pattern =
    `%${normalizedQuery}%`;

  // ---------------------------------------------------
  // Query profiles
  // ---------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("profiles")
    .select(
      `
        user_id,
        full_name,
        username,
        avatar_url
      `
    )
    .neq(
      "user_id",
      currentUserId
    )
    .or(
      `username.ilike.${pattern},full_name.ilike.${pattern}`
    )
    .order(
      "full_name",
      {
        ascending: true,
        nullsFirst: false,
      }
    )
    .limit(10);

  if (error) {
    throw error;
  }

  // ---------------------------------------------------
  // Normalize response
  // ---------------------------------------------------

  return (data ?? []).map(
    (user) => ({
      userId:
        user.user_id,

      fullName:
        user.full_name,

      username:
        user.username,

      avatarUrl:
        user.avatar_url,
    })
  );
}

// =====================================================
// GET CONVERSATION MESSAGES
// =====================================================

export async function getConversationMessages(
  accessToken: string,
  conversationId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedConversationId =
    conversationId.trim();

  if (!normalizedConversationId) {
    throw new Error(
      "conversationId is required"
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("messages")
    .select(
      `
        id,
        conversation_id,
        sender_id,
        content,
        created_at,
        updated_at,
        deleted_at
      `
    )
    .eq(
      "conversation_id",
      normalizedConversationId
    )
    .is(
      "deleted_at",
      null
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}

// =====================================================
// SEND MESSAGE
// =====================================================

export async function sendMessage(
  accessToken: string,
  conversationId: string,
  senderUserId: string,
  content: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  // ---------------------------------------------------
  // Normalize content
  // ---------------------------------------------------

  const normalizedContent =
    content.trim();

  // ---------------------------------------------------
  // Validate content
  // ---------------------------------------------------

  if (!normalizedContent) {
    throw new Error(
      "Message content is required"
    );
  }

  // ---------------------------------------------------
  // Validate conversation ID
  // ---------------------------------------------------

  const normalizedConversationId =
    conversationId.trim();

  if (!normalizedConversationId) {
    throw new Error(
      "conversationId is required"
    );
  }

  // ---------------------------------------------------
  // Get current user's profile
  //
  // senderUserId:
  // auth.users.id
  //
  // messages.sender_id:
  // profiles.id
  // ---------------------------------------------------

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("id")
    .eq(
      "user_id",
      senderUserId
    )
    .single();

  if (profileError) {
    console.error(
      "Get sender profile error:",
      profileError
    );

    throw new Error(
      "تعذر العثور على ملف المستخدم"
    );
  }

  if (!profile?.id) {
    throw new Error(
      "معرف ملف المستخدم غير موجود"
    );
  }

  // ---------------------------------------------------
  // Insert message
  //
  // IMPORTANT:
  // sender_id must be profiles.id
  // ---------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("messages")
    .insert({
      conversation_id:
        normalizedConversationId,

      sender_id:
        profile.id,

      content:
        normalizedContent,
    })
    .select(
      `
        id,
        conversation_id,
        sender_id,
        content,
        created_at,
        updated_at,
        deleted_at
      `
    )
    .single();

  if (error) {
    console.error(
      "Insert message error:",
      error
    );

    throw error;
  }

  return data;
}