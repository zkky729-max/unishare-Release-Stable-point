import { supabase } from "../../../lib/supabaseClient";

import type { Post } from "../types/post";
import type { FeedFilter } from "../types/feed";

// =====================================================
// Options
// =====================================================

interface GetPostsOptions {
  semesterId?: string;
  universityId?: string;
  limit?: number;
}

// =====================================================
// Database Row Types
// =====================================================

interface PostRow {
  id: string;
  user_id: string;

  content: string | null;

  pdf_url: string | null;
  pdf_name: string | null;

  images_urls: string[] | null;

  created_at: string;

  visibility_type: string | null;
  audience_type: string | null;

  university_id: string | null;
  faculty_id: string | null;
  specialty_id: string | null;
  level_id: string | null;
  semester_id: string | null;
  module_id: string | null;

  // ===================================================
  // Academic Information
  // ===================================================

  teacher_name: string | null;
  academic_type: string | null;
  subject_name: string | null;
  academic_year: string | null;
}

// =====================================================
// Semester Row
// =====================================================

interface SemesterRow {
  id: string;
  name: string | null;
  semester_number: number | null;
}

// =====================================================
// Module Row
// =====================================================

interface ModuleRow {
  id: string;
  name: string | null;
}

// =====================================================
// Faculty Row
// =====================================================

interface FacultyRow {
  id: string;
  name: string | null;
}

// =====================================================
// Public Profile Row
// =====================================================

interface ProfileRow {
  user_id: string;

  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

// =====================================================
// Like Row
// =====================================================

interface LikeRow {
  post_id: string;
  user_id: string;
}

// =====================================================
// Comment Row
// =====================================================

interface CommentRow {
  post_id: string;
}

// =====================================================
// Get Posts
// =====================================================

export async function getPosts(
  filter: FeedFilter = "all",
  options?: GetPostsOptions
): Promise<Post[]> {
  // ===================================================
  // 1. Current User
  // ===================================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ===================================================
  // 2. Current Profile
  // ===================================================

  let currentProfile: {
    faculty_id: string | null;
    specialty_id: string | null;
  } | null = null;

  if (user) {
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(`
        faculty_id,
        specialty_id
      `)
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "GET POSTS PROFILE ERROR:",
        profileError
      );
    }

    currentProfile = profile ?? null;
  }

  // ===================================================
  // 3. Posts Query
  // ===================================================

  let query = supabase
    .from("posts")
    .select(`
      id,
      user_id,
      content,

      pdf_url,
      pdf_name,
      images_urls,

      created_at,

      visibility_type,
      audience_type,

      university_id,
      faculty_id,
      specialty_id,
      level_id,
      semester_id,
      module_id,

      teacher_name,
      academic_type,
      subject_name,
      academic_year
    `)
    .order("created_at", {
      ascending: false,
    });

  // ===================================================
  // 4. Semester Filter
  // ===================================================

  if (options?.semesterId) {
    query = query.eq(
      "semester_id",
      options.semesterId
    );
  }

  // ===================================================
  // 5. University Filter
  // ===================================================

  if (options?.universityId) {
    query = query.eq(
      "university_id",
      options.universityId
    );
  }

  // ===================================================
  // 6. Limit
  // ===================================================

  if (
    options?.limit &&
    options.limit > 0
  ) {
    query = query.limit(
      options.limit
    );
  }

  // ===================================================
  // 7. Fetch Posts
  // ===================================================

  const {
    data: rawData,
    error,
  } = await query;

  if (error) {
    console.error(
      "GET POSTS ERROR:",
      error
    );

    throw error;
  }

  if (
    !rawData ||
    rawData.length === 0
  ) {
    return [];
  }

  // ===================================================
  // 8. Normalize
  // ===================================================

  const rawPosts =
    rawData as unknown as PostRow[];

  // ===================================================
  // 9. Feed Filters
  // ===================================================

  let posts = rawPosts;

  // ===================================================
  // Faculty
  // ===================================================

  if (filter === "faculty") {
    posts = rawPosts.filter(
      (post) => {
        // Public
        if (
          post.audience_type ===
          "public"
        ) {
          return true;
        }

        // Faculty
        if (
          post.audience_type ===
          "faculty"
        ) {
          return (
            !!currentProfile?.faculty_id &&
            post.faculty_id ===
              currentProfile.faculty_id
          );
        }

        return false;
      }
    );
  }

  // ===================================================
  // Specialty
  // ===================================================

  if (filter === "specialty") {
    posts = rawPosts.filter(
      (post) => {
        // Public
        if (
          post.audience_type ===
          "public"
        ) {
          return true;
        }

        // Faculty
        if (
          post.audience_type ===
          "faculty"
        ) {
          return (
            !!currentProfile?.faculty_id &&
            post.faculty_id ===
              currentProfile.faculty_id
          );
        }

        // Specialty
        if (
          post.audience_type ===
          "specialty"
        ) {
          return (
            !!currentProfile?.specialty_id &&
            post.specialty_id ===
              currentProfile.specialty_id
          );
        }

        return false;
      }
    );
  }

  // ===================================================
  // 10. Nothing After Filter
  // ===================================================

  if (posts.length === 0) {
    return [];
  }

  // ===================================================
  // 11. Collect IDs
  // ===================================================

  const userIds = [
    ...new Set(
      posts.map(
        (post) =>
          post.user_id
      )
    ),
  ];

  const postIds = posts.map(
    (post) =>
      post.id
  );

  const facultyIds = [
    ...new Set(
      posts
        .map(
          (post) =>
            post.faculty_id
        )
        .filter(
          (
            id
          ): id is string =>
            Boolean(id)
        )
    ),
  ];

  const semesterIds = [
    ...new Set(
      posts
        .map(
          (post) =>
            post.semester_id
        )
        .filter(
          (
            id
          ): id is string =>
            Boolean(id)
        )
    ),
  ];

  const moduleIds = [
    ...new Set(
      posts
        .map(
          (post) =>
            post.module_id
        )
        .filter(
          (
            id
          ): id is string =>
            Boolean(id)
        )
    ),
  ];

  // ===================================================
  // 12. Public Profiles
  // ===================================================

  let profiles: ProfileRow[] = [];

  if (userIds.length > 0) {
    const {
      data,
      error: profilesError,
    } = await supabase
      .from("public_profiles")
      .select(`
        user_id,
        full_name,
        username,
        avatar_url
      `)
      .in(
        "user_id",
        userIds
      );

    if (profilesError) {
      console.error(
        "GET POST PROFILES ERROR:",
        profilesError
      );
    } else {
      profiles =
        (data ?? []) as ProfileRow[];
    }
  }

  // ===================================================
  // 13. Faculties
  // ===================================================

  let faculties: FacultyRow[] = [];

  if (facultyIds.length > 0) {
    const {
      data,
      error: facultiesError,
    } = await supabase
      .from("faculties")
      .select(`
        id,
        name
      `)
      .in(
        "id",
        facultyIds
      );

    if (facultiesError) {
      console.error(
        "GET POST FACULTIES ERROR:",
        facultiesError
      );
    } else {
      faculties =
        (data ?? []) as FacultyRow[];
    }
  }

  // ===================================================
  // 14. Semesters
  // ===================================================

  let semesters: SemesterRow[] = [];

  if (semesterIds.length > 0) {
    const {
      data,
      error: semestersError,
    } = await supabase
      .from("semesters")
      .select(`
        id,
        name,
        semester_number
      `)
      .in(
        "id",
        semesterIds
      );

    if (semestersError) {
      console.error(
        "GET POST SEMESTERS ERROR:",
        semestersError
      );
    } else {
      semesters =
        (data ?? []) as SemesterRow[];
    }
  }

  // ===================================================
  // 15. Modules
  // ===================================================

  let modules: ModuleRow[] = [];

  if (moduleIds.length > 0) {
    const {
      data,
      error: modulesError,
    } = await supabase
      .from("modules")
      .select(`
        id,
        name
      `)
      .in(
        "id",
        moduleIds
      );

    if (modulesError) {
      console.error(
        "GET POST MODULES ERROR:",
        modulesError
      );
    } else {
      modules =
        (data ?? []) as ModuleRow[];
    }
  }

  // ===================================================
  // 16. Likes
  // ===================================================

  let likes: LikeRow[] = [];

  if (postIds.length > 0) {
    const {
      data,
      error: likesError,
    } = await supabase
      .from("post_likes")
      .select(`
        post_id,
        user_id
      `)
      .in(
        "post_id",
        postIds
      );

    if (likesError) {
      console.error(
        "GET POST LIKES ERROR:",
        likesError
      );
    } else {
      likes =
        (data ?? []) as LikeRow[];
    }
  }

  // ===================================================
  // 17. Comments
  // ===================================================

  let comments: CommentRow[] = [];

  if (postIds.length > 0) {
    const {
      data,
      error: commentsError,
    } = await supabase
      .from("comments")
      .select(`
        post_id
      `)
      .in(
        "post_id",
        postIds
      );

    if (commentsError) {
      console.error(
        "GET POST COMMENTS ERROR:",
        commentsError
      );
    } else {
      comments =
        (data ?? []) as CommentRow[];
    }
  }

  // ===================================================
  // 18. Profiles Map
  // ===================================================

  const profilesMap =
    new Map<
      string,
      ProfileRow
    >();

  for (const profile of profiles) {
    profilesMap.set(
      profile.user_id,
      profile
    );
  }

  // ===================================================
  // 19. Faculties Map
  // ===================================================

  const facultiesMap =
    new Map<
      string,
      FacultyRow
    >();

  for (const faculty of faculties) {
    facultiesMap.set(
      faculty.id,
      faculty
    );
  }

  // ===================================================
  // 20. Semesters Map
  // ===================================================

  const semestersMap =
    new Map<
      string,
      SemesterRow
    >();

  for (const semester of semesters) {
    semestersMap.set(
      semester.id,
      semester
    );
  }

  // ===================================================
  // 21. Modules Map
  // ===================================================

  const modulesMap =
    new Map<
      string,
      ModuleRow
    >();

  for (const module of modules) {
    modulesMap.set(
      module.id,
      module
    );
  }

  // ===================================================
  // 22. Likes Count
  // ===================================================

  const likesCount =
    new Map<
      string,
      number
    >();

  for (const like of likes) {
    likesCount.set(
      like.post_id,
      (
        likesCount.get(
          like.post_id
        ) ?? 0
      ) + 1
    );
  }

  // ===================================================
  // 23. Comments Count
  // ===================================================

  const commentsCount =
    new Map<
      string,
      number
    >();

  for (const comment of comments) {
    commentsCount.set(
      comment.post_id,
      (
        commentsCount.get(
          comment.post_id
        ) ?? 0
      ) + 1
    );
  }

  // ===================================================
  // 24. Convert Database → App Post
  // ===================================================

  return posts.map(
    (post): Post => {
      // -----------------------------------------------
      // Profile
      // -----------------------------------------------

      const profile =
        profilesMap.get(
          post.user_id
        );

      // -----------------------------------------------
      // Faculty
      // -----------------------------------------------

      const faculty =
        post.faculty_id
          ? facultiesMap.get(
              post.faculty_id
            )
          : undefined;

      const facultyName =
        faculty?.name ??
        null;

      // -----------------------------------------------
      // Semester
      // -----------------------------------------------

      const semester =
        post.semester_id
          ? semestersMap.get(
              post.semester_id
            )
          : undefined;

      let semesterName:
        | string
        | null = null;

      if (semester) {
        if (semester.name) {
          semesterName =
            semester.name;
        } else if (
          semester.semester_number !==
          null
        ) {
          semesterName =
            `السداسي ${semester.semester_number}`;
        }
      }

      // -----------------------------------------------
      // Module
      // -----------------------------------------------

      const module =
        post.module_id
          ? modulesMap.get(
              post.module_id
            )
          : undefined;

      const moduleName =
        module?.name ??
        null;

      // -----------------------------------------------
      // Academic Type
      // -----------------------------------------------

      const academicType =
        post.academic_type as
          | Post["academicType"]
          | null;

      // -----------------------------------------------
      // Return
      // -----------------------------------------------

      return {
        // =============================================
        // Basic
        // =============================================

        id:
          post.id,

        content:
          post.content ?? "",

        // =============================================
        // Author
        // =============================================

        author: {
          id:
            post.user_id,

          name:
            profile?.full_name ??
            profile?.username ??
            "مستخدم",

          avatar:
            profile?.avatar_url ??
            undefined,
        },

        // =============================================
        // Media
        // =============================================

        image:
          post.images_urls?.[0] ??
          undefined,

        images_urls:
          post.images_urls ??
          [],

        pdf:
          post.pdf_url ??
          undefined,

        pdf_url:
          post.pdf_url ??
          undefined,

        pdf_name:
          post.pdf_name ??
          null,

        // =============================================
        // Audience
        // =============================================

        audienceType:
          (post.audience_type as
            | Post["audienceType"]
            | undefined) ??
          "public",

        // =============================================
        // Academic Information
        // =============================================

        academicType,

        subjectName:
          post.subject_name ??
          null,

        teacherName:
          post.teacher_name ??
          null,

        academicYear:
          post.academic_year ??
          null,

        // =============================================
        // Academic Hierarchy
        // =============================================

        universityId:
          post.university_id ??
          null,

        facultyId:
          post.faculty_id ??
          null,

        facultyName,

        specialtyId:
          post.specialty_id ??
          null,

        levelId:
          post.level_id ??
          null,

        semesterId:
          post.semester_id ??
          null,

        semesterName,

        moduleId:
          post.module_id ??
          null,

        moduleName,

        // =============================================
        // Engagement
        // =============================================

        likes:
          likesCount.get(
            post.id
          ) ?? 0,

        likedByMe:
          user
            ? likes.some(
                (like) =>
                  like.post_id ===
                    post.id &&
                  like.user_id ===
                    user.id
              )
            : false,

        comments:
          commentsCount.get(
            post.id
          ) ?? 0,

        shares: 0,

        // =============================================
        // Owner
        // =============================================

        isOwner:
          user?.id ===
          post.user_id,

        // =============================================
        // Date
        // =============================================

        createdAt:
          new Date(
            post.created_at
          ).toLocaleString(
            "ar-DZ"
          ),
      };
    }
  );
}