// =====================================================
// Audience Types
// =====================================================

export type AudienceType =
  | "public"
  | "university"
  | "faculty"
  | "specialty"
  | "level"
  | "semester"
  | "module";

// =====================================================
// Academic Post Types
// =====================================================

export type AcademicPostType =
  | "lesson"
  | "summary"
  | "exam"
  | "research_discussion";

// =====================================================
// Create Post Input
// =====================================================

export interface CreatePostInput {
  // ===================================================
  // Content
  // ===================================================

  content: string;

  // ===================================================
  // Media
  // ===================================================

  image?: File | null;

  images?: File[];

  pdf?: File | null;

  // ===================================================
  // Audience
  // ===================================================

  audienceType: AudienceType;

  // ===================================================
  // Academic Type
  // ===================================================

  academicType?: AcademicPostType | null;

  // ===================================================
  // Academic Information
  // ===================================================

  subjectName?: string | null;

  teacherName?: string | null;

  academicYear?: string | null;

  // ===================================================
  // Academic Hierarchy
  // ===================================================

  universityId?: string | null;

  facultyId?: string | null;

  specialtyId?: string | null;

  levelId?: string | null;

  semesterId?: string | null;

  moduleId?: string | null;
}

// =====================================================
// Post Author
// =====================================================

export interface PostAuthor {
  id: string;

  name: string;

  avatar?: string;

  role?: string;
}

// =====================================================
// Post
// =====================================================

export interface Post {
  // ===================================================
  // Basic
  // ===================================================

  id: string;

  content: string;

  // ===================================================
  // Author
  // ===================================================

  author: PostAuthor;

  // ===================================================
  // Media
  // ===================================================

  /**
   * Legacy single image.
   * Kept for compatibility with old posts.
   */
  image?: string;

  /**
   * New multiple images system.
   */
  images_urls?: string[];

  /**
   * PDF URL.
   */
  pdf?: string;

  /**
   * Alternative PDF field.
   */
  pdf_url?: string;

  /**
   * Original PDF filename.
   */
  pdf_name?: string | null;

  // ===================================================
  // Audience
  // ===================================================

  audienceType?: AudienceType;

  // ===================================================
  // Academic Information
  // ===================================================

  academicType?: AcademicPostType | null;

  subjectName?: string | null;

  teacherName?: string | null;

  academicYear?: string | null;

  // ===================================================
  // Academic Hierarchy
  // ===================================================

  universityId?: string | null;

  facultyId?: string | null;

  facultyName?: string | null;

  specialtyId?: string | null;

  levelId?: string | null;

  semesterId?: string | null;

  semesterName?: string | null;

  moduleId?: string | null;

  moduleName?: string | null;

  // ===================================================
  // Statistics
  // ===================================================

  likes: number;

  likedByMe: boolean;

  comments: number;

  shares: number;

  // ===================================================
  // Meta
  // ===================================================

  createdAt: string;

  isOwner: boolean;
}