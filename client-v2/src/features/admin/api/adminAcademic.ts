import { supabase } from "../../../lib/supabaseClient";

// =====================================================
// TYPES
// =====================================================

export interface AdminUniversity {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  city: string | null;
  country_id: string | null;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  created_at: string | null;
}

export interface AdminFaculty {
  id: string;
  name: string;
  university_id: string | null;
  slug: string | null;
  description: string | null;
  logo_url: string | null;
  created_at: string | null;
}

export interface AdminDepartment {
  id: string;
  name: string;
  faculty_id: string | null;
  slug: string | null;
  description: string | null;
  created_at: string | null;
}

export interface AdminSpecialty {
  id: string;
  name: string;
  faculty_id: string | null;
  department_id: string | null;
  slug: string | null;
  created_at: string | null;
}

export interface AdminLevel {
  id: string;
  name: string;
  specialty_id: string | null;
  description: string | null;
  education_type_id: string | null;
  year_id: string | null;
  created_at: string | null;
}

export interface AdminSemester {
  id: string;
  name: string;
  level_id: string | null;
  semester_number: number | null;
  created_at: string | null;
}

export interface AdminModule {
  id: string;
  name: string;
  specialty_id: string | null;
  semester_id: string | null;
  year_id: string | null;
  created_at: string | null;
}

export interface AdminSubject {
  id: string;
  name: string;
  module_id: string | null;
  description: string | null;
  created_at: string | null;
}

export interface AdminLesson {
  id: string;
  subject_id: string;
  title: string;
  description: string | null;
  content: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// =====================================================
// API BASE
// =====================================================

const API_BASE_URL = `${
  import.meta.env.VITE_API_URL
}/api/admin`;

// =====================================================
// ACCESS TOKEN
// =====================================================

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error("Authentication required");
  }

  return session.access_token;
}

// =====================================================
// ADMIN REQUEST
// =====================================================

async function adminRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  let result: {
    success?: boolean;
    data?: T;
    message?: string;
    error?: string;
  } | null = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(
      result?.message ??
        result?.error ??
        `Request failed (${response.status})`
    );
  }

  if (!result?.success) {
    throw new Error(result?.message ?? "Admin request failed");
  }

  return result.data as T;
}

// =====================================================
// UNIVERSITIES
// =====================================================

export async function getAdminUniversities(): Promise<
  AdminUniversity[]
> {
  return adminRequest<AdminUniversity[]>("/universities");
}

export async function createAdminUniversity(
  payload: {
    name: string;
    slug: string;
    country_id?: string | null;
    city?: string | null;
    description?: string | null;
    logo_url?: string | null;
  }
): Promise<AdminUniversity> {
  if (!payload.name?.trim()) {
    throw new Error("University name is required");
  }

  if (!payload.slug?.trim()) {
    throw new Error("University slug is required");
  }

  return adminRequest<AdminUniversity>("/universities", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      slug: payload.slug.trim(),
      country_id: payload.country_id?.trim() || null,
      city: payload.city?.trim() || null,
      description: payload.description?.trim() || null,
      logo_url: payload.logo_url?.trim() || null,
    }),
  });
}

export async function updateAdminUniversity(
  id: string,
  payload: {
    name: string;
    slug: string;
    country_id?: string | null;
    city?: string | null;
    description?: string | null;
    logo_url?: string | null;
  }
): Promise<AdminUniversity> {
  if (!id?.trim()) {
    throw new Error("University ID is required");
  }

  if (!payload.name?.trim()) {
    throw new Error("University name is required");
  }

  if (!payload.slug?.trim()) {
    throw new Error("University slug is required");
  }

  return adminRequest<AdminUniversity>(
    `/universities/${id.trim()}`,
    {
      method: "PUT",
      body: JSON.stringify({
        name: payload.name.trim(),
        slug: payload.slug.trim(),
        country_id: payload.country_id?.trim() || null,
        city: payload.city?.trim() || null,
        description: payload.description?.trim() || null,
        logo_url: payload.logo_url?.trim() || null,
      }),
    }
  );
}

export async function deleteAdminUniversity(
  id: string
): Promise<void> {
  if (!id?.trim()) {
    throw new Error("University ID is required");
  }

  await adminRequest<null>(
    `/universities/${id.trim()}`,
    {
      method: "DELETE",
    }
  );
}

// =====================================================
// FACULTIES
// =====================================================

export async function getAdminFaculties(): Promise<
  AdminFaculty[]
> {
  return adminRequest<AdminFaculty[]>("/faculties");
}

export async function createAdminFaculty(
  payload: {
    name: string;
    university_id?: string | null;
    slug?: string | null;
    description?: string | null;
    logo_url?: string | null;
  }
): Promise<AdminFaculty> {
  if (!payload.name?.trim()) {
    throw new Error("Faculty name is required");
  }

  return adminRequest<AdminFaculty>("/faculties", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      university_id: payload.university_id?.trim() || null,
      slug: payload.slug?.trim() || null,
      description: payload.description?.trim() || null,
      logo_url: payload.logo_url?.trim() || null,
    }),
  });
}

export async function deleteAdminFaculty(
  id: string
): Promise<void> {
  if (!id?.trim()) {
    throw new Error("Faculty ID is required");
  }

  await adminRequest<null>(
    `/faculties/${id.trim()}`,
    {
      method: "DELETE",
    }
  );
}

// =====================================================
// DEPARTMENTS
// =====================================================

export async function getAdminDepartmentsByFaculty(
  facultyId: string
): Promise<AdminDepartment[]> {
  if (!facultyId?.trim()) {
    throw new Error("Faculty ID is required");
  }

  return adminRequest<AdminDepartment[]>(
    `/departments/faculty/${facultyId.trim()}`
  );
}

export async function createAdminDepartment(
  payload: {
    name: string;
    faculty_id: string;
    slug?: string | null;
    description?: string | null;
  }
): Promise<AdminDepartment> {
  if (!payload.name?.trim()) {
    throw new Error("Department name is required");
  }

  if (!payload.faculty_id?.trim()) {
    throw new Error("Faculty ID is required");
  }

  return adminRequest<AdminDepartment>("/departments", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      faculty_id: payload.faculty_id.trim(),
      slug: payload.slug?.trim() || null,
      description: payload.description?.trim() || null,
    }),
  });
}

export async function updateAdminDepartment(
  id: string,
  payload: {
    name: string;
    faculty_id: string;
    slug?: string | null;
    description?: string | null;
  }
): Promise<AdminDepartment> {
  if (!id?.trim()) {
    throw new Error("Department ID is required");
  }

  if (!payload.name?.trim()) {
    throw new Error("Department name is required");
  }

  if (!payload.faculty_id?.trim()) {
    throw new Error("Faculty ID is required");
  }

  return adminRequest<AdminDepartment>(
    `/departments/${id.trim()}`,
    {
      method: "PUT",
      body: JSON.stringify({
        name: payload.name.trim(),
        faculty_id: payload.faculty_id.trim(),
        slug: payload.slug?.trim() || null,
        description: payload.description?.trim() || null,
      }),
    }
  );
}

export async function deleteAdminDepartment(
  id: string
): Promise<void> {
  if (!id?.trim()) {
    throw new Error("Department ID is required");
  }

  await adminRequest<null>(
    `/departments/${id.trim()}`,
    {
      method: "DELETE",
    }
  );
}

// =====================================================
// SPECIALTIES
// =====================================================

export async function getAdminSpecialtiesByFaculty(
  facultyId: string
): Promise<AdminSpecialty[]> {
  if (!facultyId?.trim()) {
    throw new Error("Faculty ID is required");
  }

  return adminRequest<AdminSpecialty[]>(
    `/specialties/faculty/${facultyId.trim()}`
  );
}

export async function createAdminSpecialty(
  payload: {
    name: string;
    faculty_id: string;
    department_id?: string | null;
    slug?: string | null;
  }
): Promise<AdminSpecialty> {
  if (!payload.name?.trim()) {
    throw new Error("Specialty name is required");
  }

  if (!payload.faculty_id?.trim()) {
    throw new Error("Faculty ID is required");
  }

  return adminRequest<AdminSpecialty>("/specialties", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      faculty_id: payload.faculty_id.trim(),
      department_id: payload.department_id?.trim() || null,
      slug: payload.slug?.trim() || null,
    }),
  });
}

export async function deleteAdminSpecialty(
  id: string
): Promise<void> {
  if (!id?.trim()) {
    throw new Error("Specialty ID is required");
  }

  await adminRequest<null>(
    `/specialties/${id.trim()}`,
    {
      method: "DELETE",
    }
  );
}

// =====================================================
// LEVELS
// =====================================================

export async function getAdminLevelsBySpecialty(
  specialtyId: string
): Promise<AdminLevel[]> {
  if (!specialtyId?.trim()) {
    throw new Error("Specialty ID is required");
  }

  return adminRequest<AdminLevel[]>(
    `/levels/specialty/${specialtyId.trim()}`
  );
}

export async function createAdminLevel(
  payload: {
    name: string;
    specialty_id: string;
    description?: string | null;
    education_type_id?: string | null;
    year_id?: string | null;
  }
): Promise<AdminLevel> {
  if (!payload.name?.trim()) {
    throw new Error("Level name is required");
  }

  if (!payload.specialty_id?.trim()) {
    throw new Error("Specialty ID is required");
  }

  return adminRequest<AdminLevel>("/levels", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      specialty_id: payload.specialty_id.trim(),
      description: payload.description?.trim() || null,
      education_type_id:
        payload.education_type_id?.trim() || null,
      year_id: payload.year_id?.trim() || null,
    }),
  });
}

// =====================================================
// SEMESTERS
// =====================================================

export async function getAdminSemestersByLevel(
  levelId: string
): Promise<AdminSemester[]> {
  if (!levelId?.trim()) {
    throw new Error("Level ID is required");
  }

  return adminRequest<AdminSemester[]>(
    `/semesters/level/${levelId.trim()}`
  );
}

export async function createAdminSemester(
  payload: {
    name: string;
    level_id: string;
    semester_number?: number | null;
  }
): Promise<AdminSemester> {
  if (!payload.name?.trim()) {
    throw new Error("Semester name is required");
  }

  if (!payload.level_id?.trim()) {
    throw new Error("Level ID is required");
  }

  return adminRequest<AdminSemester>("/semesters", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      level_id: payload.level_id.trim(),
      semester_number: payload.semester_number ?? null,
    }),
  });
}

// =====================================================
// MODULES
// =====================================================

export async function getAdminModules(): Promise<
  AdminModule[]
> {
  return adminRequest<AdminModule[]>("/modules");
}

export async function getAdminModulesBySemester(
  semesterId: string
): Promise<AdminModule[]> {
  if (!semesterId?.trim()) {
    throw new Error("Semester ID is required");
  }

  return adminRequest<AdminModule[]>(
    `/modules/semester/${semesterId.trim()}`
  );
}

export async function createAdminModule(
  payload: {
    name: string;
    semester_id: string;
    specialty_id?: string | null;
    year_id?: string | null;
  }
): Promise<AdminModule> {
  if (!payload.name?.trim()) {
    throw new Error("Module name is required");
  }

  if (!payload.semester_id?.trim()) {
    throw new Error("Semester ID is required");
  }

  return adminRequest<AdminModule>("/modules", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      semester_id: payload.semester_id.trim(),
      specialty_id: payload.specialty_id?.trim() || null,
      year_id: payload.year_id?.trim() || null,
    }),
  });
}

// =====================================================
// SUBJECTS
// =====================================================

export async function getAdminSubjects(): Promise<
  AdminSubject[]
> {
  return adminRequest<AdminSubject[]>("/subjects");
}

export async function getAdminSubjectsByModule(
  moduleId: string
): Promise<AdminSubject[]> {
  if (!moduleId?.trim()) {
    throw new Error("Module ID is required");
  }

  return adminRequest<AdminSubject[]>(
    `/subjects/module/${moduleId.trim()}`
  );
}

export async function createAdminSubject(
  payload: {
    name: string;
    module_id: string;
    description?: string | null;
  }
): Promise<AdminSubject> {
  if (!payload.name?.trim()) {
    throw new Error("Subject name is required");
  }

  if (!payload.module_id?.trim()) {
    throw new Error("Module ID is required");
  }

  return adminRequest<AdminSubject>("/subjects", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      module_id: payload.module_id.trim(),
      description: payload.description?.trim() || null,
    }),
  });
}

// =====================================================
// LESSONS
// =====================================================

export async function getAdminLessonsBySubject(
  subjectId: string
): Promise<AdminLesson[]> {
  if (!subjectId?.trim()) {
    throw new Error("Subject ID is required");
  }

  return adminRequest<AdminLesson[]>(
    `/lessons/subject/${subjectId.trim()}`
  );
}

export async function createAdminLesson(
  payload: {
    subject_id: string;
    title: string;
    description?: string | null;
    content?: string | null;
  }
): Promise<AdminLesson> {
  if (!payload.subject_id?.trim()) {
    throw new Error("Subject ID is required");
  }

  if (!payload.title?.trim()) {
    throw new Error("Lesson title is required");
  }

  return adminRequest<AdminLesson>("/lessons", {
    method: "POST",
    body: JSON.stringify({
      subject_id: payload.subject_id.trim(),
      title: payload.title.trim(),
      description: payload.description?.trim() || null,
      content: payload.content?.trim() || null,
    }),
  });
}

export async function updateAdminLesson(
  id: string,
  payload: {
    title: string;
    description?: string | null;
    content?: string | null;
  }
): Promise<AdminLesson> {
  if (!id?.trim()) {
    throw new Error("Lesson ID is required");
  }

  if (!payload.title?.trim()) {
    throw new Error("Lesson title is required");
  }

  return adminRequest<AdminLesson>(
    `/lessons/${id.trim()}`,
    {
      method: "PUT",
      body: JSON.stringify({
        title: payload.title.trim(),
        description: payload.description?.trim() || null,
        content: payload.content?.trim() || null,
      }),
    }
  );
}

export async function deleteAdminLesson(
  id: string
): Promise<void> {
  if (!id?.trim()) {
    throw new Error("Lesson ID is required");
  }

  await adminRequest<null>(
    `/lessons/${id.trim()}`,
    {
      method: "DELETE",
    }
  );
}