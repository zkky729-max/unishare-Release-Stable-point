
import { supabase } from "../../../lib/supabaseClient";

import type { University } from "../types/university";

/**
 * الحقول المشتركة لجلب بيانات الجامعات
 */
const UNIVERSITY_SELECT = `
  id,
  name,
  slug,
  short_name,
  country_id,
  city,
  logo_url,
  created_at,
  description,
  cover_image_url,
  founded_year,
  website_url,
  official_email,
  phone,
  address,
  institution_type
`;

/**
 * جلب جميع الجامعات
 */
export async function getUniversities(): Promise<University[]> {
  const { data, error } = await supabase
    .from("universities")
    .select(UNIVERSITY_SELECT)
    .order("name", {
      ascending: true,
    });

  if (error) {
    console.error("Failed to fetch universities:", error);
    throw error;
  }

  return (data ?? []) as University[];
}

/**
 * جلب الجامعات حسب الدولة
 */
export async function getUniversitiesByCountry(
  countryId: string
): Promise<University[]> {
  const { data, error } = await supabase
    .from("universities")
    .select(UNIVERSITY_SELECT)
    .eq("country_id", countryId)
    .order("name", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to fetch universities by country:",
      error
    );

    throw error;
  }

  return (data ?? []) as University[];
}

/**
 * جلب جامعة بواسطة ID
 */
export async function getUniversityById(
  id: string
): Promise<University> {
  const { data, error } = await supabase
    .from("universities")
    .select(UNIVERSITY_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Failed to fetch university by id:",
      error
    );

    throw error;
  }

  return data as University;
}

/**
 * جلب جامعة بواسطة Slug
 *
 * المسار الأساسي للصفحات العامة:
 * /universities/:slug
 */
export async function getUniversityBySlug(
  slug: string
): Promise<University> {
  const { data, error } = await supabase
    .from("universities")
    .select(UNIVERSITY_SELECT)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(
      "Failed to fetch university by slug:",
      error
    );

    throw error;
  }

  return data as University;
}
