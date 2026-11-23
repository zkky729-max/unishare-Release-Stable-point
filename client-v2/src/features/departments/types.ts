export interface Department {
  id: string;
  faculty_id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
  specialties_count?: number;
}