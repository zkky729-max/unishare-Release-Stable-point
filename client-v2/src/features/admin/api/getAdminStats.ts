import { supabase } from "../../../lib/supabaseClient";

export interface AdminStats {
  totalUsers: number;
  students: number;
  eliteStudents: number;
  professors: number;
  admins: number;

  universities: number;
  faculties: number;
  specialties: number;
  levels: number;
  semesters: number;
  modules: number;
  subjects: number;
  posts: number;
}

const API_BASE_URL =
  "https://unishare-api-ivory.vercel.app/api/admin";

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error(
      "Authentication required"
    );
  }

  return session.access_token;
}

export async function getAdminStats(): Promise<AdminStats> {
  const token =
    await getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/stats`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "application/json",
      },
    }
  );

  let result: {
    success?: boolean;
    data?: AdminStats;
    message?: string;
    error?: string;
  } | null = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(
      result?.message ??
        result?.error ??
        `Request failed (${response.status})`
    );
  }

  if (
    !result?.success ||
    !result.data
  ) {
    throw new Error(
      result?.message ??
        "Failed to fetch admin statistics"
    );
  }

  return result.data;
}