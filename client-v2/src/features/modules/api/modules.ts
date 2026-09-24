import { supabase } from "@/lib/supabaseClient";
import type { Module } from "../types";

export async function getModulesBySemester(
  semesterId: string
): Promise<Module[]> {
  console.log(
    "getModulesBySemester() semesterId:",
    semesterId
  );

  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("semester_id", semesterId)
    .order("name", { ascending: true });

  if (error) {
    console.error("GET MODULES ERROR:", error);
    throw error;
  }

  console.log(
    "getModulesBySemester() result:",
    data
  );

  return (data ?? []) as Module[];
}

export async function addModule(
  name: string,
  semesterId: string,
  specialtyId?: string,
  yearId?: string
): Promise<Module> {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("Module name is required.");
  }

  if (!semesterId) {
    throw new Error("Semester ID is required.");
  }

  console.log("ADDING MODULE:", {
    name: cleanName,
    semesterId,
    specialtyId,
    yearId,
  });

  const { data, error } = await supabase
    .from("modules")
    .insert({
      name: cleanName,
      semester_id: semesterId,
      specialty_id: specialtyId || null,
      year_id: yearId || null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("ADD MODULE ERROR:", error);
    throw error;
  }

  console.log("MODULE CREATED:", data);

  return data as Module;
}