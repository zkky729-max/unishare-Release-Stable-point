import { supabase } from "../../../lib/supabaseClient";

// =====================================================
// Get specialties by faculty
// =====================================================

export async function getSpecialtiesByFaculty(
  facultyId: string,
) {
  const { data, error } = await supabase
    .from("specialties")
    .select("*")
    .eq("faculty_id", facultyId)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// Get specialties by department
// =====================================================

export async function getSpecialtiesByDepartment(
  departmentId: string,
) {
  const { data, error } = await supabase
    .from("specialties")
    .select("*")
    .eq("department_id", departmentId)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// Add specialty
// =====================================================

export async function addSpecialty(
  name: string,
  description: string,
  facultyId: string,
) {
  const { data, error } = await supabase
    .from("specialties")
    .insert([
      {
        name,
        description,
        faculty_id: facultyId,
      },
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

// =====================================================
// Delete specialty
// =====================================================

export async function deleteSpecialty(
  id: string,
) {
  const { error } = await supabase
    .from("specialties")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
