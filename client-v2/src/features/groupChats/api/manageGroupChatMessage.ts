
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export type GroupChatMessageAction = "edit" | "delete";

// =====================================================
// MANAGE GROUP CHAT MESSAGE
// =====================================================

export async function manageGroupChatMessage(
  messageId: string,
  action: GroupChatMessageAction,
  newContent?: string | null
): Promise<boolean> {
  if (!messageId?.trim()) {
    throw new Error("معرّف الرسالة غير صالح");
  }

  if (action !== "edit" && action !== "delete") {
    throw new Error("عملية غير صالحة");
  }

  if (
    action === "edit" &&
    (!newContent || !newContent.trim())
  ) {
    throw new Error("محتوى الرسالة لا يمكن أن يكون فارغاً");
  }

  const { data, error } = await supabase.rpc(
    "manage_group_chat_message",
    {
      p_message_id: messageId,
      p_action: action,
      p_new_content:
        action === "edit" ? newContent!.trim() : null,
    }
  );

  if (error) {
    console.error(
      "Manage group chat message error:",
      error
    );

    throw new Error(
      error.message || "تعذر تنفيذ العملية على الرسالة"
    );
  }

  if (data !== true) {
    throw new Error("لم يتم تنفيذ العملية بنجاح");
  }

  return true;
}
