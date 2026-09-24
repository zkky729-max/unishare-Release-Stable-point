import { supabase } from "../../../lib/supabaseClient";

import type {
  AudienceType,
  AcademicPostType,
} from "../types/post";

// =====================================================
// Types
// =====================================================

interface CreatePostData {
  content: string;

  images?: File[];

  pdf?: File | null;

  audienceType: AudienceType;

  academicType?: AcademicPostType | null;

  universityId?: string | null;

  facultyId?: string | null;

  specialtyId?: string | null;

  levelId?: string | null;

  semesterId?: string | null;

  moduleId?: string | null;

  // ===================================================
  // Academic Information
  // ===================================================

  subjectId?: string | null;

  subjectName?: string | null;

  lessonTitle?: string | null;

  teacherName?: string | null;

  academicYear?: string | null;
}

// =====================================================
// Create Post
// =====================================================

export async function createPost({
  content,
  images = [],
  pdf = null,

  audienceType,
  academicType = null,

  universityId = null,
  facultyId = null,
  specialtyId = null,
  levelId = null,
  semesterId = null,
  moduleId = null,

  subjectId = null,
  subjectName = null,
  lessonTitle = null,

  teacherName = null,
  academicYear = null,
}: CreatePostData) {
  // ===================================================
  // 1. Validate Content
  // ===================================================

  const cleanContent =
    content.trim();

  if (!cleanContent) {
    throw new Error(
      "محتوى المنشور مطلوب."
    );
  }

  // ===================================================
  // 2. Current User
  // ===================================================

  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(
      "AUTH ERROR:",
      userError
    );

    throw userError;
  }

  if (!user) {
    throw new Error(
      "يجب تسجيل الدخول أولًا."
    );
  }

  // ===================================================
  // 3. Validate Semester
  // ===================================================

  if (
    audienceType === "semester" &&
    !semesterId
  ) {
    throw new Error(
      "معرف السداسي مطلوب لهذا المنشور."
    );
  }

  // ===================================================
  // 4. Validate Lesson Information
  // ===================================================

  const isLessonPost =
    academicType === "lesson";

  const cleanLessonTitle =
    lessonTitle?.trim() || "";

  if (isLessonPost) {
    if (!subjectId) {
      throw new Error(
        "يجب اختيار المقياس الذي ينتمي إليه الدرس."
      );
    }

    if (!cleanLessonTitle) {
      throw new Error(
        "عنوان الدرس مطلوب."
      );
    }
  }

  // ===================================================
  // 5. Get Current Profile
  // ===================================================

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(`
      faculty_id,
      specialty_id
    `)
    .eq(
      "user_id",
      user.id
    )
    .maybeSingle();

  if (profileError) {
    console.error(
      "PROFILE ERROR:",
      profileError
    );

    throw profileError;
  }

  if (!profile) {
    throw new Error(
      "لم يتم العثور على الملف الشخصي."
    );
  }

  // ===================================================
  // 6. Resolve Semester Context
  // ===================================================

  let semesterContext: {
    id: string;
    level_id: string;
    specialty_id: string;
  } | null = null;

  if (
    audienceType === "semester" &&
    semesterId
  ) {
    const {
      data,
      error,
    } = await supabase
      .from("semesters")
      .select(`
        id,
        level_id,
        levels!inner (
          specialty_id
        )
      `)
      .eq(
        "id",
        semesterId
      )
      .maybeSingle();

    if (error) {
      console.error(
        "SEMESTER VALIDATION ERROR:",
        error
      );

      throw error;
    }

    if (!data) {
      throw new Error(
        "السداسي غير موجود."
      );
    }

    const levelData =
      Array.isArray(data.levels)
        ? data.levels[0]
        : data.levels;

    const semesterSpecialtyId =
      levelData?.specialty_id ??
      null;

    if (!semesterSpecialtyId) {
      throw new Error(
        "تعذر تحديد تخصص هذا السداسي."
      );
    }

    semesterContext = {
      id: data.id,

      level_id:
        data.level_id,

      specialty_id:
        semesterSpecialtyId,
    };
  }

  // ===================================================
  // 7. Academic Context
  // ===================================================

  const isSemesterPost =
    audienceType === "semester";

  const finalFacultyId =
    isSemesterPost
      ? profile.faculty_id ?? null
      : facultyId;

  const finalSpecialtyId =
    isSemesterPost
      ? semesterContext?.specialty_id ??
        null
      : specialtyId;

  const finalLevelId =
    isSemesterPost
      ? semesterContext?.level_id ??
        null
      : levelId;

  const finalSemesterId =
    isSemesterPost
      ? semesterContext?.id ?? null
      : semesterId;

  // ===================================================
  // 8. Validate Subject
  // ===================================================

  let resolvedSubjectName =
    subjectName?.trim() || null;

  if (
    isLessonPost &&
    subjectId
  ) {
    const {
      data: subject,
      error: subjectError,
    } = await supabase
      .from("subjects")
      .select(`
        id,
        name,
        module_id,
        modules!inner (
          id,
          semester_id
        )
      `)
      .eq(
        "id",
        subjectId
      )
      .maybeSingle();

    if (subjectError) {
      console.error(
        "SUBJECT VALIDATION ERROR:",
        subjectError
      );

      throw subjectError;
    }

    if (!subject) {
      throw new Error(
        "المقياس المحدد غير موجود."
      );
    }

    const moduleData =
      Array.isArray(subject.modules)
        ? subject.modules[0]
        : subject.modules;

    const subjectSemesterId =
      moduleData?.semester_id ??
      null;

    if (
      finalSemesterId &&
      subjectSemesterId !==
        finalSemesterId
    ) {
      throw new Error(
        "المقياس المحدد لا ينتمي إلى السداسي المختار."
      );
    }

    resolvedSubjectName =
      subject.name?.trim() || null;
  }

  // ===================================================
  // 9. Resolve University
  // ===================================================

  let resolvedUniversityId =
    universityId;

  if (
    !resolvedUniversityId &&
    finalFacultyId
  ) {
    const {
      data: faculty,
      error: facultyError,
    } = await supabase
      .from("faculties")
      .select(
        "university_id"
      )
      .eq(
        "id",
        finalFacultyId
      )
      .maybeSingle();

    if (facultyError) {
      console.error(
        "FACULTY ERROR:",
        facultyError
      );

      throw facultyError;
    }

    resolvedUniversityId =
      faculty?.university_id ??
      null;
  }

  // ===================================================
  // 10. Upload Images
  // ===================================================

  const imageUrls: string[] = [];

  for (const image of images) {
    const safeName =
      image.name
        .replace(
          /\s+/g,
          "-"
        )
        .replace(
          /[^a-zA-Z0-9._-]/g,
          ""
        );

    const imageName =
      `${user.id}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("posts")
      .upload(
        imageName,
        image,
        {
          upsert: false,
        }
      );

    if (uploadError) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        uploadError
      );

      throw uploadError;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("posts")
      .getPublicUrl(
        imageName
      );

    imageUrls.push(
      publicUrlData.publicUrl
    );
  }

  // ===================================================
  // 11. Upload PDF
  // ===================================================

  let pdfUrl: string | null =
    null;

  let pdfName: string | null =
    null;

  if (pdf) {
    const safePdfName =
      pdf.name
        .replace(
          /\s+/g,
          "-"
        )
        .replace(
          /[^a-zA-Z0-9._-]/g,
          ""
        );

    const storagePdfName =
      `${user.id}/${Date.now()}-${crypto.randomUUID()}-${safePdfName}`;

    const {
      error: pdfUploadError,
    } = await supabase.storage
      .from("posts")
      .upload(
        storagePdfName,
        pdf,
        {
          upsert: false,
        }
      );

    if (pdfUploadError) {
      console.error(
        "PDF UPLOAD ERROR:",
        pdfUploadError
      );

      throw pdfUploadError;
    }

    const {
      data: publicPdfData,
    } = supabase.storage
      .from("posts")
      .getPublicUrl(
        storagePdfName
      );

    pdfUrl =
      publicPdfData.publicUrl;

    pdfName =
      pdf.name;
  }

  // ===================================================
  // 12. Clean Academic Information
  // ===================================================

  const cleanTeacherName =
    teacherName?.trim() || null;

  const cleanAcademicYear =
    academicYear?.trim() || null;

  // ===================================================
  // 13. Build Payload
  // ===================================================

  const postPayload = {
    // Owner
    user_id:
      user.id,

    // Content
    content:
      cleanContent,

    // Media
    images_urls:
      imageUrls,

    pdf_url:
      pdfUrl,

    pdf_name:
      pdfName,

    // Audience
    audience_type:
      audienceType,

    academic_type:
      academicType,

    // Academic information
    subject_name:
      resolvedSubjectName,

    teacher_name:
      cleanTeacherName,

    academic_year:
      cleanAcademicYear,

    // Academic context
    university_id:
      resolvedUniversityId,

    faculty_id:
      finalFacultyId,

    specialty_id:
      finalSpecialtyId,

    level_id:
      finalLevelId,

    semester_id:
      finalSemesterId,

    module_id:
      isSemesterPost
        ? null
        : moduleId,
  };

  // ===================================================
  // 14. Debug
  // ===================================================

  console.log(
    "CREATE POST PAYLOAD:",
    postPayload
  );

  // ===================================================
  // 15. Insert Post
  // ===================================================

  const {
    data,
    error,
  } = await supabase
    .from("posts")
    .insert(
      postPayload
    )
    .select("*")
    .single();

  // ===================================================
  // 16. Handle Post Error
  // ===================================================

  if (error) {
    console.error(
      "CREATE POST ERROR:",
      error
    );

    console.error(
      "FAILED POST DATA:",
      postPayload
    );

    if (
      error.code === "42501"
    ) {
      throw new Error(
        "ليس لديك صلاحية نشر هذا المنشور في هذا السداسي."
      );
    }

    throw error;
  }

  // ===================================================
  // 17. Create Lesson
  // ===================================================

  console.log(
    "LESSON CREATE DEBUG:",
    {
      userId: user.id,
      subjectId,
      lessonTitle: cleanLessonTitle,
    }
  );

  if (
    isLessonPost &&
    subjectId
  ) {
    const {
      data: lesson,
      error: lessonError,
    } = await supabase
      .from("lessons")
      .insert({
        subject_id:
          subjectId,

        title:
          cleanLessonTitle,

        description:
          null,

        content:
          cleanContent,

        // Owner of the lesson
        created_by:
          user.id,
      })
      .select(`
        id,
        subject_id,
        title,
        description,
        content,
        created_by,
        created_at,
        updated_at
      `)
      .single();

    if (lessonError) {
      console.error(
        "CREATE LESSON ERROR:",
        lessonError
      );

      throw lessonError;
    }

    console.log(
      "LESSON CREATED:",
      lesson
    );
  }

  // ===================================================
  // 18. Success
  // ===================================================

  console.log(
    "POST CREATED:",
    data
  );

  return data;
}