import { supabase } from "../../../lib/supabaseClient";

export async function getSubjectsBySpecialty(
  specialtyId: string
) {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("specialty_id", specialtyId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getSubjectsByModule(
  moduleId: string
) {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("module_id", moduleId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function addSubject(
  name: string,
  description: string,
  specialtyId: string,
  moduleId: string
) {
  const { data, error } = await supabase
    .from("subjects")
    .insert({
      name: name.trim(),
      description: description.trim() || null,
      specialty_id: specialtyId,
      module_id: moduleId,
    })
    .select()
    .single();

  if (error) {
    console.error("ADD SUBJECT ERROR:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    throw new Error(
      `${error.message}${error.details ? ` | ${error.details}` : ""}`
    );
  }

  return data;
}

export async function deleteSubject(
  id: string
) {
  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}