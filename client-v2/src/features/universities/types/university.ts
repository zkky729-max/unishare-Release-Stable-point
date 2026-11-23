
export interface University {
  id: string;
  name: string;
  slug: string;
  short_name: string | null;
  country_id: string | null;
  city: string | null;
  logo_url: string | null;
  created_at?: string;

  // Additional university information
  description: string | null;
  cover_image_url: string | null;
  founded_year: number | null;
  website_url: string | null;
  official_email: string | null;
  phone: string | null;
  address: string | null;
  institution_type: string | null;
}
