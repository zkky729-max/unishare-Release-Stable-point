import { supabaseAdmin } from "../lib/supabaseAdmin.js";

/* ==========================================================================
   USER ROLES
============================================================================ */

export const ALLOWED_ROLES = [
  "student",
  "elite_student",
  "professor",
  "admin",
] as const;

export type AdminUserRole =
  (typeof ALLOWED_ROLES)[number];

/* ==========================================================================
   TYPES
============================================================================ */

export interface AdminUser {
  id: string;
  user_id: string;

  email: string | null;

  full_name: string | null;
  username: string | null;
  avatar_url: string | null;

  role: string | null;

  faculty_id: string | null;
  specialty_id: string | null;
  level_id: string | null;
  semester_id: string | null;
  module_id: string | null;
  university_id: string | null;

  faculty: {
    name: string;
  } | null;

  specialty: {
    name: string;
  } | null;

  created_at: string | null;
}

export interface AdminStats {
  totalUsers: number;
  students: number;
  eliteStudents: number;
  professors: number;
  admins: number;

  universities: number;
  faculties: number;
  specialties: number;
  levels: number;
  semesters: number;
  modules: number;
  subjects: number;
  posts: number;
}

/* ==========================================================================
   HELPERS
============================================================================ */

function isValidUuid(
  value: string
): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

/* ==========================================================================
   GET ALL USERS
============================================================================ */

export async function getAdminUsers(): Promise<
  AdminUser[]
> {
  const {
    data: profiles,
    error: profilesError,
  } = await supabaseAdmin
    .from("profiles")
    .select(`
      id,
      user_id,
      full_name,
      username,
      avatar_url,
      role,
      faculty_id,
      specialty_id,
      level_id,
      semester_id,
      module_id,
      university_id,
      created_at,

      faculty:faculties(
        name
      ),

      specialty:specialties(
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (profilesError) {
    throw new Error(
      `Failed to fetch profiles: ${profilesError.message}`
    );
  }

  if (
    !profiles ||
    profiles.length === 0
  ) {
    return [];
  }

  /* ------------------------------------------------------------------------
     GET AUTH USERS FOR EMAIL
  ------------------------------------------------------------------------ */

  const usersById = new Map<
    string,
    {
      email: string | null;
    }
  >();

  let page = 1;
  const perPage = 1000;

  while (true) {
    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

    if (authError) {
      throw new Error(
        `Failed to fetch auth users: ${authError.message}`
      );
    }

    for (
      const user of authData.users
    ) {
      usersById.set(user.id, {
        email:
          user.email ?? null,
      });
    }

    if (
      authData.users.length <
      perPage
    ) {
      break;
    }

    page += 1;
  }

  /* ------------------------------------------------------------------------
     RETURN ADMIN USERS
  ------------------------------------------------------------------------ */

  return profiles.map(
    (profile) => ({
      id: profile.id,

      user_id:
        profile.user_id,

      email: profile.user_id
        ? usersById.get(
            profile.user_id
          )?.email ?? null
        : null,

      full_name:
        profile.full_name,

      username:
        profile.username,

      avatar_url:
        profile.avatar_url,

      role:
        profile.role,

      faculty_id:
        profile.faculty_id,

      specialty_id:
        profile.specialty_id,

      level_id:
        profile.level_id,

      semester_id:
        profile.semester_id,

      module_id:
        profile.module_id,

      university_id:
        profile.university_id,

      faculty:
        Array.isArray(
          profile.faculty
        )
          ? profile.faculty[0] ??
            null
          : profile.faculty ??
            null,

      specialty:
        Array.isArray(
          profile.specialty
        )
          ? profile.specialty[0] ??
            null
          : profile.specialty ??
            null,

      created_at:
        profile.created_at,
    })
  );
}

/* ==========================================================================
   GET USER BY ID
============================================================================ */

export async function getAdminUserById(
  userId: string
): Promise<AdminUser | null> {
  if (
    !isValidUuid(userId)
  ) {
    throw new Error(
      "Invalid user ID"
    );
  }

  const {
    data: profile,
    error: profileError,
  } =
    await supabaseAdmin
      .from("profiles")
      .select(`
        id,
        user_id,
        full_name,
        username,
        avatar_url,
        role,
        faculty_id,
        specialty_id,
        level_id,
        semester_id,
        module_id,
        university_id,
        created_at,

        faculty:faculties(
          name
        ),

        specialty:specialties(
          name
        )
      `)
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();

  if (profileError) {
    throw new Error(
      `Failed to fetch user profile: ${profileError.message}`
    );
  }

  if (!profile) {
    return null;
  }

  const {
    data: authData,
    error: authError,
  } =
    await supabaseAdmin.auth.admin.getUserById(
      userId
    );

  if (authError) {
    throw new Error(
      `Failed to fetch auth user: ${authError.message}`
    );
  }

  return {
    id: profile.id,

    user_id:
      profile.user_id,

    email:
      authData.user?.email ??
      null,

    full_name:
      profile.full_name,

    username:
      profile.username,

    avatar_url:
      profile.avatar_url,

    role:
      profile.role,

    faculty_id:
      profile.faculty_id,

    specialty_id:
      profile.specialty_id,

    level_id:
      profile.level_id,

    semester_id:
      profile.semester_id,

    module_id:
      profile.module_id,

    university_id:
      profile.university_id,

    faculty:
      Array.isArray(
        profile.faculty
      )
        ? profile.faculty[0] ??
          null
        : profile.faculty ??
          null,

    specialty:
      Array.isArray(
        profile.specialty
      )
        ? profile.specialty[0] ??
          null
        : profile.specialty ??
          null,

    created_at:
      profile.created_at,
  };
}

/* ==========================================================================
   GET ADMIN STATS
============================================================================ */

export async function getAdminStats(): Promise<
  AdminStats
> {
  const [
    profilesResult,
    universitiesResult,
    facultiesResult,
    specialtiesResult,
    levelsResult,
    semestersResult,
    modulesResult,
    subjectsResult,
    postsResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("role"),

    supabaseAdmin
      .from("universities")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("faculties")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("specialties")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("levels")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("semesters")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("modules")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("subjects")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabaseAdmin
      .from("posts")
      .select("id", {
        count: "exact",
        head: true,
      }),
  ]);

  const results = [
    profilesResult,
    universitiesResult,
    facultiesResult,
    specialtiesResult,
    levelsResult,
    semestersResult,
    modulesResult,
    subjectsResult,
    postsResult,
  ];

  for (const result of results) {
    if (result.error) {
      throw new Error(
        `Failed to fetch admin statistics: ${result.error.message}`
      );
    }
  }

  const users =
    profilesResult.data ?? [];

  return {
    totalUsers:
      users.length,

    students:
      users.filter(
        (user) =>
          user.role ===
          "student"
      ).length,

    eliteStudents:
      users.filter(
        (user) =>
          user.role ===
          "elite_student"
      ).length,

    professors:
      users.filter(
        (user) =>
          user.role ===
          "professor"
      ).length,

    admins:
      users.filter(
        (user) =>
          user.role ===
          "admin"
      ).length,

    universities:
      universitiesResult.count ??
      0,

    faculties:
      facultiesResult.count ??
      0,

    specialties:
      specialtiesResult.count ??
      0,

    levels:
      levelsResult.count ??
      0,

    semesters:
      semestersResult.count ??
      0,

    modules:
      modulesResult.count ??
      0,

    subjects:
      subjectsResult.count ??
      0,

    posts:
      postsResult.count ??
      0,
  };
}

/* ==========================================================================
   UPDATE USER ROLE
============================================================================ */

export async function updateAdminUserRole(
  userId: string,
  role: string
): Promise<AdminUser> {
  if (
    !isValidUuid(userId)
  ) {
    throw new Error(
      "Invalid user ID"
    );
  }

  if (
    !ALLOWED_ROLES.includes(
      role as AdminUserRole
    )
  ) {
    throw new Error(
      `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(
        ", "
      )}`
    );
  }

  /* ------------------------------------------------------------------------
     VERIFY AUTH USER
  ------------------------------------------------------------------------ */

  const {
    data: authData,
    error: authError,
  } =
    await supabaseAdmin.auth.admin.getUserById(
      userId
    );

  if (
    authError ||
    !authData.user
  ) {
    throw new Error(
      "User not found"
    );
  }

  /* ------------------------------------------------------------------------
     VERIFY PROFILE
  ------------------------------------------------------------------------ */

  const {
    data: existingProfile,
    error: profileLookupError,
  } =
    await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();

  if (profileLookupError) {
    throw new Error(
      `Failed to verify profile: ${profileLookupError.message}`
    );
  }

  if (!existingProfile) {
    throw new Error(
      "User profile not found"
    );
  }

  /* ------------------------------------------------------------------------
     UPDATE ROLE USING SERVICE ROLE
  ------------------------------------------------------------------------ */

  const {
    error: updateError,
  } = await supabaseAdmin
    .from("profiles")
    .update({
      role,
    })
    .eq(
      "user_id",
      userId
    );

  if (updateError) {
    throw new Error(
      `Failed to update user role: ${updateError.message}`
    );
  }

  /* ------------------------------------------------------------------------
     LOAD UPDATED USER
  ------------------------------------------------------------------------ */

  const updatedUser =
    await getAdminUserById(
      userId
    );

  if (!updatedUser) {
    throw new Error(
      "User was updated but could not be loaded afterward"
    );
  }

  return updatedUser;
}

/* ==========================================================================
   DELETE USER
============================================================================ */

export async function deleteAdminUser(
  userId: string
): Promise<void> {
  if (
    !isValidUuid(userId)
  ) {
    throw new Error(
      "Invalid user ID"
    );
  }

  /* ------------------------------------------------------------------------
     VERIFY AUTH USER
  ------------------------------------------------------------------------ */

  const {
    data: authData,
    error: authLookupError,
  } =
    await supabaseAdmin.auth.admin.getUserById(
      userId
    );

  if (
    authLookupError ||
    !authData.user
  ) {
    throw new Error(
      "User not found"
    );
  }

  /* ------------------------------------------------------------------------
     DELETE PROFILE
  ------------------------------------------------------------------------ */

  const {
    error: profileDeleteError,
  } =
    await supabaseAdmin
      .from("profiles")
      .delete()
      .eq(
        "user_id",
        userId
      );

  if (profileDeleteError) {
    throw new Error(
      `Failed to delete user profile: ${profileDeleteError.message}`
    );
  }

  /* ------------------------------------------------------------------------
     DELETE AUTH USER
  ------------------------------------------------------------------------ */

  const {
    error: authDeleteError,
  } =
    await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

  if (authDeleteError) {
    throw new Error(
      `Profile deleted but Auth user deletion failed: ${authDeleteError.message}`
    );
  }
}