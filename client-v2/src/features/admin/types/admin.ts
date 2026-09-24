export type UserRole =
  | "student"
  | "elite_student"
  | "professor"
  | "admin";

export type UserRoleFilter =
  | "all"
  | UserRole;

export type UserSort =
  | "name"
  | "role"
  | "newest"
  | "oldest";

export interface AdminUser {
  id?: string;

  user_id: string;

  full_name: string | null;

  email?: string | null;

  username?: string | null;

  avatar_url?: string | null;

  bio?: string | null;

  age?: number | null;

  role: UserRole;

  faculty?: {
    name: string;
  } | null;

  specialty?: {
    name: string;
  } | null;

  created_at: string;
}