
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TOGGLE GROUP CHAT REACTION
// =====================================================

export async function toggleGroupChatReaction(
  messageId: string,
  reaction: string
): Promise<boolean> {
  if (!messageId?.trim()) {
    throw new Error("Message ID is required");
  }

  const normalizedReaction = reaction?.trim();

  if (
    !normalizedReaction ||
    normalizedReaction.length > 32
  ) {
    throw new Error("Invalid reaction");
  }

  const { data, error } = await supabase.rpc(
    "toggle_group_chat_reaction",
    {
      p_message_id: messageId,
      p_reaction: normalizedReaction,
    }
  );

  if (error) {
    console.error(
      "Toggle group chat reaction error:",
      error
    );

    throw new Error(
      error.message || "فشل تحديث التفاعل"
    );
  }

  return data === true;
}
