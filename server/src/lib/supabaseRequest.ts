import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(
  name: string
): string {
  const value =
    process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

const supabaseUrl =
  getRequiredEnv(
    "SUPABASE_URL"
  );

const supabaseAnonKey =
  getRequiredEnv(
    "SUPABASE_ANON_KEY"
  );

export function createSupabaseRequestClient(
  accessToken: string
) {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
}