import {
  createSupabaseRequestClient,
} from "../lib/supabaseRequest.js";

// =====================================================
// TYPES
// =====================================================

type FriendshipStatus =
  | "pending"
  | "accepted"
  | "rejected";

interface FriendshipRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

// =====================================================
// SEND FRIEND REQUEST
// =====================================================

export async function sendFriendRequest(
  accessToken: string,
  currentUserId: string,
  targetUserId: string
) {
  const supabase =
    createSupabaseRequestClient(
      accessToken
    );

  const normalizedTargetUserId =
    targetUserId.trim();

  if (!normalizedTargetUserId) {
    throw new Error(
      "targetUserId is required"
    );
  }

  // ---------------------------------------------------
  // منع إضافة النفس
  // ---------------------------------------------------

  if (
    normalizedTargetUserId ===
    currentUserId
  ) {
    throw new Error(
      "لا يمكنك إرسال طلب صداقة لنفسك"
    );
  }

  // ---------------------------------------------------
  // التأكد من وجود المستخدم
  // ---------------------------------------------------

  const {
    data: targetProfile,
    error: targetProfileError,
  } = await supabase
    .from("profiles")
    .select("user_id")
    .eq(
      "user_id",
      normalizedTargetUserId
    )
    .maybeSingle();

  if (targetProfileError) {
    throw targetProfileError;
  }

  if (!targetProfile?.user_id) {
    throw new Error(
      "المستخدم غير موجود"
    );
  }

  // ---------------------------------------------------
  // البحث عن علاقة موجودة مسبقًا
  //
  // نبحث في الاتجاهين لأن unique index
  // يعتمد على least/greatest.
  // ---------------------------------------------------

  const {
    data: existingRelations,
    error: existingError,
  } = await supabase
    .from("friendships")
    .select(
      `
        id,
        requester_id,
        addressee_id,
        status,
        created_at,
        updated_at
      `
    )
    .or(
      `and(requester_id.eq.${currentUserId},addressee_id.eq.${normalizedTargetUserId}),and(requester_id.eq.${normalizedTargetUserId},addressee_id.eq.${currentUserId})`
    )
    .limit(1);

  if (existingError) {
    throw existingError;
  }

  const existing =
    existingRelations?.[0] as
      | FriendshipRow
      | undefined;

  if (existing) {
    if (
      existing.status ===
      "accepted"
    ) {
      throw new Error(
        "أنتم أصدقاء بالفعل"
      );
    }

    if (
      existing.status ===
      "pending"
    ) {
      if (
        existing.requester_id ===
        currentUserId
      ) {
        throw new Error(
          "تم إرسال طلب الصداقة مسبقًا"
        );
      }

      throw new Error(
        "لديك طلب صداقة وارد من هذا المستخدم"
      );
    }

    if (
      existing.status ===
      "rejected"
    ) {
      throw new Error(
        "تم رفض طلب الصداقة سابقًا"
      );
    }
  }

  // ---------------------------------------------------
  // إنشاء الطلب
  // ---------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("friendships")
    .insert({
      requester_id:
        currentUserId,

      addressee_id:
        normalizedTargetUserId,

      status:
        "pending",
    })
    .select(
      `
        id,
        requester_id,
        addressee_id,
        status,
        created_at,
        updated_at
      `
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// GET FRIEND REQUESTS
// =====================================================

export async function getFriendRequests(
  accessToken: string,
  currentUserId: string
) {
  const supabase =
    createSupabaseRequestClient(
      accessToken
    );

  // ---------------------------------------------------
  // الطلبات الواردة
  // ---------------------------------------------------

  const {
    data: incoming,
    error: incomingError,
  } =
    await supabase
      .from("friendships")
      .select(
        `
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          updated_at
        `
      )
      .eq(
        "addressee_id",
        currentUserId
      )
      .eq(
        "status",
        "pending"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (incomingError) {
    throw incomingError;
  }

  // ---------------------------------------------------
  // الطلبات الصادرة
  // ---------------------------------------------------

  const {
    data: outgoing,
    error: outgoingError,
  } =
    await supabase
      .from("friendships")
      .select(
        `
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          updated_at
        `
      )
      .eq(
        "requester_id",
        currentUserId
      )
      .eq(
        "status",
        "pending"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (outgoingError) {
    throw outgoingError;
  }

  return {
    incoming: incoming ?? [],
    outgoing: outgoing ?? [],
  };
}

// =====================================================
// ACCEPT FRIEND REQUEST
// =====================================================

export async function acceptFriendRequest(
  accessToken: string,
  currentUserId: string,
  friendshipId: string
) {
  const supabase =
    createSupabaseRequestClient(
      accessToken
    );

  const normalizedFriendshipId =
    friendshipId.trim();

  if (!normalizedFriendshipId) {
    throw new Error(
      "friendshipId is required"
    );
  }

  // ---------------------------------------------------
  // التحقق من أن الطلب موجه للمستخدم الحالي
  // ---------------------------------------------------

  const {
    data: friendship,
    error: friendshipError,
  } =
    await supabase
      .from("friendships")
      .select(
        `
          id,
          requester_id,
          addressee_id,
          status
        `
      )
      .eq(
        "id",
        normalizedFriendshipId
      )
      .eq(
        "addressee_id",
        currentUserId
      )
      .eq(
        "status",
        "pending"
      )
      .maybeSingle();

  if (friendshipError) {
    throw friendshipError;
  }

  if (!friendship) {
    throw new Error(
      "طلب الصداقة غير موجود أو لم يعد متاحًا"
    );
  }

  // ---------------------------------------------------
  // قبول الطلب
  // ---------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("friendships")
    .update({
      status:
        "accepted",
    })
    .eq(
      "id",
      normalizedFriendshipId
    )
    .eq(
      "addressee_id",
      currentUserId
    )
    .eq(
      "status",
      "pending"
    )
    .select(
      `
        id,
        requester_id,
        addressee_id,
        status,
        created_at,
        updated_at
      `
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// REJECT FRIEND REQUEST
// =====================================================

export async function rejectFriendRequest(
  accessToken: string,
  currentUserId: string,
  friendshipId: string
) {
  const supabase =
    createSupabaseRequestClient(
      accessToken
    );

  const normalizedFriendshipId =
    friendshipId.trim();

  if (!normalizedFriendshipId) {
    throw new Error(
      "friendshipId is required"
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("friendships")
    .update({
      status:
        "rejected",
    })
    .eq(
      "id",
      normalizedFriendshipId
    )
    .eq(
      "addressee_id",
      currentUserId
    )
    .eq(
      "status",
      "pending"
    )
    .select(
      `
        id,
        requester_id,
        addressee_id,
        status,
        created_at,
        updated_at
      `
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// CANCEL FRIEND REQUEST
// =====================================================

export async function cancelFriendRequest(
  accessToken: string,
  currentUserId: string,
  friendshipId: string
) {
  const supabase =
    createSupabaseRequestClient(
      accessToken
    );

  const normalizedFriendshipId =
    friendshipId.trim();

  if (!normalizedFriendshipId) {
    throw new Error(
      "friendshipId is required"
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("friendships")
    .delete()
    .eq(
      "id",
      normalizedFriendshipId
    )
    .eq(
      "requester_id",
      currentUserId
    )
    .eq(
      "status",
      "pending"
    )
    .select(
      "id"
    )
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "طلب الصداقة غير موجود أو لا يمكنك إلغاؤه"
    );
  }

  return {
    success: true,
  };
}

// =====================================================
// GET FRIENDS
// =====================================================

export async function getFriends(
  accessToken: string,
  currentUserId: string
) {
  const supabase =
    createSupabaseRequestClient(
      accessToken
    );

  // ---------------------------------------------------
  // العلاقات المقبولة التي يكون المستخدم طرفًا فيها
  // ---------------------------------------------------

  const {
    data: friendships,
    error: friendshipsError,
  } =
    await supabase
      .from("friendships")
      .select(
        `
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          updated_at
        `
      )
      .eq(
        "status",
        "accepted"
      )
      .or(
        `requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`
      )
      .order(
        "updated_at",
        {
          ascending: false,
        }
      );

  if (friendshipsError) {
    throw friendshipsError;
  }

  if (
    !friendships ||
    friendships.length === 0
  ) {
    return [];
  }

  // ---------------------------------------------------
  // استخراج IDs الأصدقاء
  // ---------------------------------------------------

  const friendUserIds =
    friendships.map(
      (friendship) =>
        friendship.requester_id ===
        currentUserId
          ? friendship.addressee_id
          : friendship.requester_id
    );

  // ---------------------------------------------------
  // جلب بيانات Profiles
  // ---------------------------------------------------

  const {
    data: profiles,
    error: profilesError,
  } =
    await supabase
      .from("profiles")
      .select(
        `
          user_id,
          full_name,
          username,
          avatar_url,
          bio,
          faculty_id,
          specialty_id,
          university_id
        `
      )
      .in(
        "user_id",
        friendUserIds
      );

  if (profilesError) {
    throw profilesError;
  }

  // ---------------------------------------------------
  // دمج العلاقة مع بيانات المستخدم
  // ---------------------------------------------------

  const profileMap =
    new Map(
      (profiles ?? []).map(
        (profile) => [
          profile.user_id,
          profile,
        ]
      )
    );

  return friendships.map(
    (friendship) => {
      const friendUserId =
        friendship.requester_id ===
        currentUserId
          ? friendship.addressee_id
          : friendship.requester_id;

      const profile =
        profileMap.get(
          friendUserId
        );

      return {
        friendshipId:
          friendship.id,

        userId:
          friendUserId,

        status:
          friendship.status,

        createdAt:
          friendship.created_at,

        updatedAt:
          friendship.updated_at,

        fullName:
          profile?.full_name ??
          null,

        username:
          profile?.username ??
          null,

        avatarUrl:
          profile?.avatar_url ??
          null,

        bio:
          profile?.bio ??
          null,

        facultyId:
          profile?.faculty_id ??
          null,

        specialtyId:
          profile?.specialty_id ??
          null,

        universityId:
          profile?.university_id ??
          null,
      };
    }
  );
}

// =====================================================
// SEARCH USERS
// =====================================================
//
// البحث العام عن المستخدمين داخل UniShare.
//
// البحث بواسطة:
// - username
// - full_name
//
// لا يتم إرجاع البريد الإلكتروني.
// المستخدم الحالي يتم استبعاده.
// الحد الأدنى للبحث: حرفان.
// الحد الأقصى للنتائج: 20.
// =====================================================

export async function searchUsers(
  accessToken: string,
  query: string,
  currentUserId: string
) {
  const supabase =
    createSupabaseRequestClient(
      accessToken
    );

  // ---------------------------------------------------
  // Normalize query
  // ---------------------------------------------------

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
  // Search profiles
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
        avatar_url,
        bio,
        faculty_id,
        specialty_id,
        university_id
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
    .limit(20);

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

      bio:
        user.bio,

      facultyId:
        user.faculty_id,

      specialtyId:
        user.specialty_id,

      universityId:
        user.university_id,
    })
  );
}