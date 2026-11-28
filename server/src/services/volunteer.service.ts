
import { supabaseAdmin } from "../lib/supabase.js";
// =====================================================
// TYPES
// =====================================================

export interface CreateVolunteerApplicationInput {
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  education?: string;
  specialty?: string;
  participationType: "team" | "project";
  selectedTeams: string[];
  projectInterest?: string;
  skills: string;
  experience?: string;
  portfolio?: string;
  motivation: string;
  availability?: string;
}

// =====================================================
// CREATE VOLUNTEER APPLICATION
// =====================================================

export async function createVolunteerApplication(
  input: CreateVolunteerApplicationInput
) {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("volunteer_applications")
    .insert({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone || null,
      location: input.location,
      education: input.education || null,
      specialty: input.specialty || null,
      participation_type: input.participationType,
      selected_teams: input.selectedTeams,
      project_interest: input.projectInterest || null,
      skills: input.skills,
      experience: input.experience || null,
      portfolio: input.portfolio || null,
      motivation: input.motivation,
      availability: input.availability || null,
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error(
      "Create volunteer application error:",
      error
    );

    throw error;
  }

  if (!data) {
    throw new Error(
      "Volunteer application was not created"
    );
  }

  return data;
}
