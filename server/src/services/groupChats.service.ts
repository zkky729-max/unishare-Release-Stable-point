
import { createSupabaseRequestClient } from "../lib/supabaseRequest.js";

// =====================================================
// TYPES
// =====================================================

export type GroupChatType =
  | "academic"
  | "private"
  | "educational";

export type GroupChatMemberRole =
  | "owner"
  | "moderator"
  | "member";

export type GroupChatInvitationType =
  | "direct"
  | "request"
  | "link";

export type GroupChatMessageAction =
  | "edit"
  | "delete";

// =====================================================
// HELPERS
// =====================================================

function normalizeRequiredString(
  value: string,
  fieldName: string
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

async function getCurrentProfileId(
  accessToken: string
): Promise<string> {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "تعذر التحقق من المستخدم الحالي"
    );
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile?.id) {
    throw new Error(
      "تعذر العثور على ملف المستخدم"
    );
  }

  return profile.id;
}

// =====================================================
// GET MY GROUP CHATS
// =====================================================

export async function getMyGroupChats(
  accessToken: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const profileId =
    await getCurrentProfileId(accessToken);

  const {
    data: memberships,
    error: membershipsError,
  } = await supabase
    .from("group_chat_members")
    .select("group_id")
    .eq("profile_id", profileId);

  if (membershipsError) {
    throw membershipsError;
  }

  const groupIds = [
    ...new Set(
      (memberships ?? []).map(
        (membership) => membership.group_id
      )
    ),
  ];

  if (groupIds.length === 0) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("group_chats")
    .select(`
      id,
      name,
      description,
      group_type,
      semester_id,
      created_by,
      avatar_url,
      is_private,
      is_active,
      created_at,
      updated_at
    `)
    .in("id", groupIds)
    .eq("is_active", true)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

// =====================================================
// GET SEMESTER GROUP CHATS
// =====================================================

export async function getSemesterGroupChats(
  accessToken: string,
  semesterId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedSemesterId =
    normalizeRequiredString(
      semesterId,
      "semesterId"
    );

  const {
    data,
    error,
  } = await supabase
    .from("group_chats")
    .select(`
      id,
      name,
      description,
      group_type,
      semester_id,
      created_by,
      avatar_url,
      is_private,
      is_active,
      created_at,
      updated_at
    `)
    .eq("semester_id", normalizedSemesterId)
    .eq("group_type", "academic")
    .eq("is_active", true)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

// =====================================================
// GET GROUP CHAT DETAILS
// =====================================================

export async function getGroupChatDetails(
  accessToken: string,
  groupId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const {
    data,
    error,
  } = await supabase
    .from("group_chats")
    .select(`
      id,
      name,
      description,
      group_type,
      semester_id,
      created_by,
      avatar_url,
      is_private,
      is_active,
      created_at,
      updated_at
    `)
    .eq("id", normalizedGroupId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// CREATE GROUP CHAT
// =====================================================

export async function createGroupChat(
  accessToken: string,
  input: {
    name: string;
    description?: string | null;
    groupType: GroupChatType;
    semesterId?: string | null;
    isPrivate?: boolean;
  }
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const name =
    normalizeRequiredString(
      input.name,
      "Group name"
    );

  if (name.length < 2 || name.length > 100) {
    throw new Error(
      "اسم المجموعة يجب أن يكون بين حرفين و100 حرف"
    );
  }

  if (
    ![
      "academic",
      "private",
      "educational",
    ].includes(input.groupType)
  ) {
    throw new Error(
      "نوع المجموعة غير صالح"
    );
  }

  const semesterId =
    input.semesterId?.trim() || null;

  if (
    input.groupType === "academic" &&
    !semesterId
  ) {
    throw new Error(
      "يجب تحديد السداسي للمجموعة الأكاديمية"
    );
  }

  if (
    input.groupType !== "academic" &&
    semesterId
  ) {
    throw new Error(
      "لا يمكن ربط هذا النوع من المجموعات بسداسي"
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "create_group_chat",
    {
      p_name: name,
      p_description:
        input.description?.trim() || null,
      p_group_type: input.groupType,
      p_semester_id: semesterId,
      p_is_private:
        input.isPrivate ?? true,
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "تعذر إنشاء المجموعة"
    );
  }

  return data as string;
}

// =====================================================
// GET GROUP MEMBERS
// =====================================================

export async function getGroupChatMembers(
  accessToken: string,
  groupId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const {
    data,
    error,
  } = await supabase
    .from("group_chat_members")
    .select(`
      id,
      group_id,
      profile_id,
      member_role,
      joined_at,
      last_read_at,
      is_muted
    `)
    .eq("group_id", normalizedGroupId)
    .order("joined_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

// =====================================================
// GET GROUP CHAT MESSAGES
// =====================================================

export async function getGroupChatMessages(
  accessToken: string,
  groupId: string,
  limit = 50
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const safeLimit = Math.min(
    Math.max(Math.floor(limit), 1),
    100
  );

  const {
    data,
    error,
  } = await supabase
    .from("group_chat_messages")
    .select(`
      id,
      group_id,
      sender_id,
      content,
      reply_to,
      attachment_url,
      attachment_name,
      attachment_type,
      is_pinned,
      edited_at,
      deleted_at,
      created_at
    `)
    .eq("group_id", normalizedGroupId)
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    })
    .limit(safeLimit);

  if (error) {
    throw error;
  }

  return (data ?? []).reverse();
}

// =====================================================
// SEND GROUP CHAT MESSAGE
// =====================================================

export async function sendGroupChatMessage(
  accessToken: string,
  groupId: string,
  input: {
    content?: string;
    replyTo?: string | null;
    attachmentUrl?: string | null;
    attachmentName?: string | null;
    attachmentType?: string | null;
  }
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const content =
    input.content?.trim() ?? "";

  const attachmentUrl =
    input.attachmentUrl?.trim() || null;

  if (!content && !attachmentUrl) {
    throw new Error(
      "يجب كتابة رسالة أو إرفاق ملف"
    );
  }

  const senderId =
    await getCurrentProfileId(accessToken);

  const {
    data,
    error,
  } = await supabase
    .from("group_chat_messages")
    .insert({
      group_id: normalizedGroupId,
      sender_id: senderId,
      content,
      reply_to:
        input.replyTo?.trim() || null,
      attachment_url: attachmentUrl,
      attachment_name:
        input.attachmentName?.trim() || null,
      attachment_type:
        input.attachmentType?.trim() || null,
    })
    .select(`
      id,
      group_id,
      sender_id,
      content,
      reply_to,
      attachment_url,
      attachment_name,
      attachment_type,
      is_pinned,
      edited_at,
      deleted_at,
      created_at
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// MANAGE GROUP CHAT MESSAGE
// =====================================================

export async function manageGroupChatMessage(
  accessToken: string,
  messageId: string,
  action: GroupChatMessageAction,
  newContent?: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedMessageId =
    normalizeRequiredString(
      messageId,
      "messageId"
    );

  if (
    action !== "edit" &&
    action !== "delete"
  ) {
    throw new Error(
      "عملية الرسالة غير صالحة"
    );
  }

  let normalizedContent: string | null = null;

  if (action === "edit") {
    normalizedContent =
      newContent?.trim() ?? "";

    if (!normalizedContent) {
      throw new Error(
        "محتوى الرسالة مطلوب"
      );
    }
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "manage_group_chat_message",
    {
      p_message_id: normalizedMessageId,
      p_action: action,
      p_new_content: normalizedContent,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// CREATE DIRECT INVITATION
// =====================================================

export async function createDirectGroupInvitation(
  accessToken: string,
  groupId: string,
  invitedProfileId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const normalizedProfileId =
    normalizeRequiredString(
      invitedProfileId,
      "invitedProfileId"
    );

  const currentProfileId =
    await getCurrentProfileId(accessToken);

  if (
    normalizedProfileId === currentProfileId
  ) {
    throw new Error(
      "لا يمكنك دعوة نفسك"
    );
  }

  const {
    data: existingMembership,
    error: membershipError,
  } = await supabase
    .from("group_chat_members")
    .select("id")
    .eq("group_id", normalizedGroupId)
    .eq("profile_id", normalizedProfileId)
    .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  if (existingMembership) {
    throw new Error(
      "هذا المستخدم عضو بالفعل في المجموعة"
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "create_group_chat_invitation",
    {
      p_group_id: normalizedGroupId,
      p_invitation_type: "direct",
      p_invited_profile_id:
        normalizedProfileId,
      p_max_uses: null,
      p_expires_at: null,
    }
  );

  if (error) {
    throw error;
  }

  return data as string;
}

// =====================================================
// CREATE GROUP CHAT INVITATION LINK
// =====================================================

export async function createGroupChatLinkInvitation(
  accessToken: string,
  groupId: string,
  options?: {
    maxUses?: number | null;
    expiresAt?: string | null;
  }
): Promise<{
  invitationId: string;
  token: string;
}> {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const maxUses =
    options?.maxUses ?? null;

  const expiresAt =
    options?.expiresAt?.trim() || null;

  if (
    maxUses !== null &&
    (!Number.isInteger(maxUses) || maxUses <= 0)
  ) {
    throw new Error(
      "عدد مرات استخدام الرابط يجب أن يكون عددًا صحيحًا أكبر من صفر"
    );
  }

  if (expiresAt !== null) {
    const expirationDate = new Date(expiresAt);

    if (
      Number.isNaN(expirationDate.getTime()) ||
      expirationDate.getTime() <= Date.now()
    ) {
      throw new Error(
        "تاريخ انتهاء الرابط غير صالح أو منتهي"
      );
    }
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "create_group_chat_link_invitation",
    {
      p_group_id: normalizedGroupId,
      p_max_uses: maxUses,
      p_expires_at: expiresAt,
    }
  );

  if (error) {
    throw error;
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("invitation_id" in data) ||
    !("token" in data)
  ) {
    throw new Error(
      "لم يتم استلام بيانات رابط الدعوة بشكل صحيح"
    );
  }

  const result = data as {
    invitation_id: string;
    token: string;
  };

  if (
    typeof result.invitation_id !== "string" ||
    typeof result.token !== "string" ||
    !result.invitation_id ||
    !/^[a-f0-9]{64}$/i.test(result.token)
  ) {
    throw new Error(
      "بيانات رابط الدعوة غير صالحة"
    );
  }

  return {
    invitationId: result.invitation_id,
    token: result.token,
  };
}

// =====================================================
// GET MY GROUP INVITATIONS
// =====================================================

export async function getMyGroupInvitations(
  accessToken: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const profileId =
    await getCurrentProfileId(accessToken);

  const {
    data,
    error,
  } = await supabase
    .from("group_chat_invitations")
    .select(`
      id,
      group_id,
      invited_profile_id,
      invited_by,
      invitation_type,
      status,
      expires_at,
      created_at
    `)
    .eq("invited_profile_id", profileId)
    .eq("invitation_type", "direct")
    .eq("status", "pending")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

// =====================================================
// ACCEPT GROUP INVITATION
// =====================================================

export async function acceptGroupChatInvitation(
  accessToken: string,
  invitationId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedInvitationId =
    normalizeRequiredString(
      invitationId,
      "invitationId"
    );

  const {
    data,
    error,
  } = await supabase.rpc(
    "accept_group_chat_invitation",
    {
      p_invitation_id:
        normalizedInvitationId,
      p_token: null,
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "انتهت صلاحية الدعوة أو تعذر قبولها"
    );
  }

  return data as string;
}

// =====================================================
// ACCEPT GROUP INVITATION BY LINK TOKEN
// =====================================================

export async function acceptGroupChatInvitationByToken(
  accessToken: string,
  token: string
): Promise<string> {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedToken =
    normalizeRequiredString(
      token,
      "Invitation token"
    );

  if (!/^[a-f0-9]{64}$/i.test(normalizedToken)) {
    throw new Error(
      "رابط الدعوة غير صالح"
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "accept_group_chat_invitation",
    {
      p_invitation_id: null,
      p_token: normalizedToken,
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "انتهت صلاحية رابط الدعوة أو تم بلوغ الحد الأقصى للاستخدام"
    );
  }

  return data as string;
}

// =====================================================
// REJECT GROUP INVITATION
// =====================================================

export async function rejectGroupChatInvitation(
  accessToken: string,
  invitationId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedInvitationId =
    normalizeRequiredString(
      invitationId,
      "invitationId"
    );

  const {
    data,
    error,
  } = await supabase.rpc(
    "reject_group_chat_invitation",
    {
      p_invitation_id:
        normalizedInvitationId,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// LEAVE GROUP CHAT
// =====================================================

export async function leaveGroupChat(
  accessToken: string,
  groupId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const {
    data,
    error,
  } = await supabase.rpc(
    "manage_group_chat_membership",
    {
      p_group_id: normalizedGroupId,
      p_target_profile_id: null,
      p_action: "leave",
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// REMOVE GROUP MEMBER
// =====================================================

export async function removeGroupChatMember(
  accessToken: string,
  groupId: string,
  targetProfileId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const normalizedProfileId =
    normalizeRequiredString(
      targetProfileId,
      "targetProfileId"
    );

  const {
    data,
    error,
  } = await supabase.rpc(
    "manage_group_chat_membership",
    {
      p_group_id: normalizedGroupId,
      p_target_profile_id:
        normalizedProfileId,
      p_action: "remove",
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// UPDATE MEMBER ROLE
// =====================================================

export async function updateGroupChatMemberRole(
  accessToken: string,
  groupId: string,
  targetProfileId: string,
  newRole: "moderator" | "member"
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const normalizedProfileId =
    normalizeRequiredString(
      targetProfileId,
      "targetProfileId"
    );

  const {
    data,
    error,
  } = await supabase.rpc(
    "update_group_chat_member_role",
    {
      p_group_id: normalizedGroupId,
      p_target_profile_id:
        normalizedProfileId,
      p_new_role: newRole,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// TRANSFER GROUP OWNERSHIP
// =====================================================

export async function transferGroupChatOwnership(
  accessToken: string,
  groupId: string,
  newOwnerProfileId: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const normalizedProfileId =
    normalizeRequiredString(
      newOwnerProfileId,
      "newOwnerProfileId"
    );

  const {
    data,
    error,
  } = await supabase.rpc(
    "transfer_group_chat_ownership",
    {
      p_group_id: normalizedGroupId,
      p_new_owner_profile_id:
        normalizedProfileId,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// UPDATE GROUP CHAT
// =====================================================

export async function updateGroupChat(
  accessToken: string,
  groupId: string,
  input: {
    name: string;
    description?: string | null;
    avatarUrl?: string | null;
    isPrivate: boolean;
  }
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const name =
    normalizeRequiredString(
      input.name,
      "Group name"
    );

  if (name.length < 2 || name.length > 100) {
    throw new Error(
      "اسم المجموعة يجب أن يكون بين حرفين و100 حرف"
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "update_group_chat",
    {
      p_group_id: normalizedGroupId,
      p_name: name,
      p_description:
        input.description?.trim() || null,
      p_avatar_url:
        input.avatarUrl?.trim() || null,
      p_is_private: input.isPrivate,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// MANAGE GROUP CHAT PIN
// =====================================================

export async function manageGroupChatPin(
  accessToken: string,
  groupId: string,
  messageId: string,
  action: "pin" | "unpin"
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedGroupId =
    normalizeRequiredString(
      groupId,
      "groupId"
    );

  const normalizedMessageId =
    normalizeRequiredString(
      messageId,
      "messageId"
    );

  const {
    data,
    error,
  } = await supabase.rpc(
    "manage_group_chat_pin",
    {
      p_group_id: normalizedGroupId,
      p_message_id: normalizedMessageId,
      p_action: action,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// TOGGLE MESSAGE REACTION
// =====================================================

export async function toggleGroupChatReaction(
  accessToken: string,
  messageId: string,
  reaction: string
) {
  const supabase =
    createSupabaseRequestClient(accessToken);

  const normalizedMessageId =
    normalizeRequiredString(
      messageId,
      "messageId"
    );

  const normalizedReaction =
    normalizeRequiredString(
      reaction,
      "reaction"
    );

  if (normalizedReaction.length > 32) {
    throw new Error(
      "التفاعل لا يمكن أن يتجاوز 32 حرفًا"
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "toggle_group_chat_reaction",
    {
      p_message_id: normalizedMessageId,
      p_reaction: normalizedReaction,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}
