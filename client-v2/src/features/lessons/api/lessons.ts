import { supabase } from "@/lib/supabaseClient";

export interface Lesson {
  id: string;
  subject_id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// =====================================================
// GET LESSONS BY SUBJECT
// =====================================================

export async function getLessonsBySubject(
  subjectId: string
): Promise<Lesson[]> {
  if (!subjectId) {
    throw new Error("Subject ID is required.");
  }

  /*
   * =====================================================
   * PUBLIC LESSON LIST
   * =====================================================
   *
   * نستخدم RPC بدل القراءة المباشرة من جدول lessons
   * لأن الزائر لا يملك صلاحية قراءة محتوى الدرس.
   *
   * الـ RPC يرجع:
   * - id
   * - subject_id
   * - title
   * - description
   * - created_by
   * - created_at
   * - updated_at
   *
   * ولا يرجع content.
   */

  const { data, error } =
    await supabase.rpc(
      "get_public_lessons_by_subject",
      {
        p_subject_id: subjectId,
      }
    );

  if (error) {
    console.error(
      "GET PUBLIC LESSONS ERROR:",
      error
    );

    throw error;
  }

  return (data ?? []) as Lesson[];
}

// =====================================================
// GET SINGLE LESSON
// =====================================================

export async function getLessonById(
  lessonId: string
): Promise<Lesson | null> {
  if (!lessonId) {
    throw new Error("Lesson ID is required.");
  }

  const { data, error } = await supabase
    .from("lessons")
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
    .eq("id", lessonId)
    .maybeSingle();

  if (error) {
    console.error(
      "GET LESSON ERROR:",
      error
    );

    throw error;
  }

  return data as Lesson | null;
}

// =====================================================
// ADD LESSON
// =====================================================

export async function addLesson(
  subjectId: string,
  title: string,
  description?: string,
  content?: string
): Promise<Lesson> {
  const cleanTitle = title.trim();

  if (!subjectId) {
    throw new Error("Subject ID is required.");
  }

  if (!cleanTitle) {
    throw new Error("Lesson title is required.");
  }

  // ===================================================
  // Current User
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
      "يجب تسجيل الدخول لإضافة درس."
    );
  }

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      subject_id: subjectId,
      title: cleanTitle,
      description:
        description?.trim() || null,
      content:
        content?.trim() || null,
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

  if (error) {
    console.error(
      "ADD LESSON ERROR:",
      error
    );

    throw error;
  }

  return data as Lesson;
}

// =====================================================
// UPDATE LESSON
// =====================================================

export async function updateLesson(
  lessonId: string,
  title: string,
  description?: string,
  content?: string
): Promise<Lesson> {
  const cleanTitle = title.trim();

  if (!lessonId) {
    throw new Error("Lesson ID is required.");
  }

  if (!cleanTitle) {
    throw new Error("Lesson title is required.");
  }

  const { data, error } = await supabase
    .from("lessons")
    .update({
      title: cleanTitle,
      description:
        description?.trim() || null,
      content:
        content?.trim() || null,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", lessonId)
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

  if (error) {
    console.error(
      "UPDATE LESSON ERROR:",
      error
    );

    throw error;
  }

  return data as Lesson;
}

// =====================================================
// DELETE LESSON
// =====================================================

export async function deleteLesson(
  lessonId: string
): Promise<void> {
  if (!lessonId) {
    throw new Error("Lesson ID is required.");
  }

  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", lessonId);

  if (error) {
    console.error(
      "DELETE LESSON ERROR:",
      error
    );

    throw error;
  }
}