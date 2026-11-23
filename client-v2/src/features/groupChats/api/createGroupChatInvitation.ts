
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface GroupChatLinkInvitation {
  invitationId: string;
  token: string;
}

interface CreateGroupChatLinkInvitationOptions {
  maxUses?: number | null;
  expiresAt?: string | null;
}

// =====================================================
// CREATE GROUP CHAT LINK INVITATION
// =====================================================

export async function createGroupChatLinkInvitation(
  groupId: string,
  options: CreateGroupChatLinkInvitationOptions = {}
): Promise<GroupChatLinkInvitation> {
  if (!groupId?.trim()) {
    throw new Error("Group ID is required");
  }

  const maxUses = options.maxUses ?? null;
  const expiresAt = options.expiresAt ?? null;

  if (
    maxUses !== null &&
    (!Number.isInteger(maxUses) || maxUses < 1)
  ) {
    throw new Error("Invalid maximum uses");
  }

  const { data, error } = await supabase.rpc(
    "create_group_chat_link_invitation",
    {
      p_group_id: groupId,
      p_max_uses: maxUses,
      p_expires_at: expiresAt,
    }
  );

  if (error) {
    console.error(
      "Create group chat link invitation error:",
      error
    );

    throw new Error(
      error.message || "فشل إنشاء رابط الدعوة"
    );
  }

  const result = data as {
    invitation_id?: unknown;
    token?: unknown;
  } | null;

  if (
    !result ||
    typeof result.invitation_id !== "string" ||
    typeof result.token !== "string" ||
    !/^[a-f0-9]{64}$/i.test(result.token)
  ) {
    throw new Error(
      "بيانات الدعوة المستلمة من الخادم غير صالحة"
    );
  }

  return {
    invitationId: result.invitation_id,
    token: result.token,
  };
}
