
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface GroupChatReaction {
  id: string;
  message_id: string;
  profile_id: string;
  reaction: string;
  created_at: string;
}

// =====================================================
// GET GROUP CHAT REACTIONS
// =====================================================

export async function getGroupChatReactions(
  messageIds: string[]
): Promise<GroupChatReaction[]> {
  const uniqueIds = [
    ...new Set(
      messageIds.filter((id) => id?.trim())
    ),
  ];

  if (uniqueIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("group_chat_reactions")
    .select(
      "id, message_id, profile_id, reaction, created_at"
    )
    .in("message_id", uniqueIds)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(
      "Get group chat reactions error:",
      error
    );

    throw new Error(
      "فشل تحميل تفاعلات الرسائل"
    );
  }

  return data ?? [];
}
