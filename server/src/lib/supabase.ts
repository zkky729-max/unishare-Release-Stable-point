import dotenv from "dotenv";

dotenv.config();

import { createClient } from "@supabase/supabase-js";

// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

const url = process.env.SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env"
  );
}

// =====================================================
// SUPABASE ADMIN CLIENT
// =====================================================

export const supabaseAdmin =
  createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );