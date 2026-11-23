
import { supabase } from "../../../lib/supabaseClient";

import type { Department } from "../../departments/types";

// =====================================================
// Get departments by faculty with specialties count
// =====================================================

export async function getDepartmentsByFaculty(
  facultyId: string,
): Promise<Department[]> {
  const { data, error } = await supabase
    .from("departments")
    .select(`
      *,
      specialties(count)
    `)
    .eq("faculty_id", facultyId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }

  return (data ?? []).map((department: any) => ({
    ...department,
    specialties_count:
      department.specialties?.[0]?.count ?? 0,
  })) as Department[];
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
