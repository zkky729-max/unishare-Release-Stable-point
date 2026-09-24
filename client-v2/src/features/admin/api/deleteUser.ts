import { supabase } from "../../../lib/supabaseClient";

/**
 * حذف مستخدم إداريًا.
 *
 * العملية تمر عبر Backend حتى يتم:
 * 1. التحقق من JWT.
 * 2. التحقق من أن المستخدم Admin.
 * 3. حذف Profile.
 * 4. حذف مستخدم Supabase Auth باستخدام Service Role.
 */
export async function deleteUser(
  userId: string
): Promise<void> {
  if (!userId) {
    throw new Error("معرف المستخدم غير موجود");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(
      "Failed to get current session:",
      sessionError
    );

    throw sessionError;
  }

  if (!session?.access_token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization:
          `Bearer ${session.access_token}`,
      },
    }
  );

  let result: {
    success?: boolean;
    message?: string;
  } | null = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message =
      result?.message ??
      `Failed to delete user (${response.status})`;

    console.error(
      "Failed to delete user:",
      message
    );

    throw new Error(message);
  }

  if (!result?.success) {
    throw new Error(
      result?.message ??
        "Failed to delete user"
    );
  }
}