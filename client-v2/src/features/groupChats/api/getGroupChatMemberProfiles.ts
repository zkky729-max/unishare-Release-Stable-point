
import { supabase } from "@/lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface GroupChatMemberProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

// =====================================================
// GET GROUP CHAT MEMBER PROFILES
// =====================================================

export async function getGroupChatMemberProfiles(
  profileIds: string[]
): Promise<GroupChatMemberProfile[]> {
  const uniqueIds = [
    ...new Set(
      profileIds.filter((id) => id?.trim())
    ),
  ];

  if (uniqueIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url")
    .in("id", uniqueIds);

  if (error) {
    console.error(
      "Get group chat member profiles error:",
      error
    );

    throw new Error(
      "فشل تحميل بيانات أعضاء المجموعة"
    );
  }

  return data ?? [];
}
