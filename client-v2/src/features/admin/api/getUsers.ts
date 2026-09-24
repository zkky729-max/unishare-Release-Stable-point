import { supabase } from "../../../lib/supabaseClient";

import type { AdminUser } from "../types/admin";

const API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/api/admin`;

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

export async function getUsers(): Promise<
  AdminUser[]
> {
  const token =
    await getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/users`,
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
    data?: any[];
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

  if (!result?.success) {
    throw new Error(
      result?.message ??
        "Failed to fetch users"
    );
  }

  return (result.data ?? []).map(
    (user): AdminUser => ({
      id: user.id,

      user_id:
        user.user_id,

      full_name:
        user.full_name,

      email:
        user.email ?? null,

      username:
        user.username ?? null,

      avatar_url:
        user.avatar_url ?? null,

      role:
        user.role as AdminUser["role"],

      faculty:
        user.faculty ?? null,

      specialty:
        user.specialty ?? null,

      created_at:
        user.created_at,
    })
  );
}