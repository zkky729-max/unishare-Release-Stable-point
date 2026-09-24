import { supabase } from "../../../lib/supabaseClient";

import type {
  UserRole,
} from "../types/admin";

export interface UpdateUserRoleData {
  userId: string;
  newRole: UserRole;
}

export async function updateUserRole({
  userId,
  newRole,
}: UpdateUserRoleData): Promise<void> {
  const {
    data: {
      session,
    },
    error: sessionError,
  } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error(
      "Failed to get current session:",
      sessionError
    );

    throw sessionError;
  }

  if (!session?.access_token) {
    throw new Error(
      "Authentication required"
    );
  }

  const response =
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          role: newRole,
        }),
      }
    );

  let result: {
    success?: boolean;
    message?: string;
    data?: unknown;
  } | null = null;

  try {
    result =
      await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message =
      result?.message ??
      `Failed to update user role (${response.status})`;

    console.error(
      "Failed to update user role:",
      message
    );

    throw new Error(
      message
    );
  }

  if (!result?.success) {
    throw new Error(
      result?.message ??
        "Failed to update user role"
    );
  }
}
