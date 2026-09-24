export interface Module {
  id: string;
  name: string;
  specialty_id: string | null;
  semester_id: string;
  year_id: string | null;
  created_at?: string;
}