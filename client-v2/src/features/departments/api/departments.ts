import { supabase } from "../../../lib/supabaseClient";

import type { Department } from "../types";

// =====================================================
// Get departments by faculty
// =====================================================

export async function getDepartmentsByFaculty(
  facultyId: string,
): Promise<Department[]> {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("faculty_id", facultyId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }

  return (data ?? []) as Department[];
}

// =====================================================
// Get single department
// =====================================================

export async function getDepartment(
  departmentId: string,
): Promise<Department | null> {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("id", departmentId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch department:", error);
    throw error;
  }

  return data as Department | null;
}
