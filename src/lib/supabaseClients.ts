import { createClient, SupabaseClient } from "@supabase/supabase-js";

import * as dotenv from "dotenv";
import path from "path";

// This explicitly points to the .env file in your root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// DEBUG: This will show you exactly what keys were loaded
console.log(
  "Loaded Keys:",
  Object.keys(process.env).filter((k) => k.startsWith("SUPABASE")),
);

const SUPABASE_URL = process.env.SUPABASE_URL!;
const ANON_KEY = process.env.ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  throw new Error("Missing required SUPABASE_* env vars");
}

/**
 * Admin client (service_role). Server-side only.
 * Bypasses RLS — use carefully.
 */
export const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
}) as SupabaseClient;

/**
 * User-scoped client using Authorization header (Bearer JWT).
 * RLS applies (auth.uid()).
 */
export function createUserClientFromAuthHeader(authHeader?: string) {
  if (!authHeader) return null;

  return createClient(SUPABASE_URL, ANON_KEY, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
    auth: { persistSession: false },
  }) as SupabaseClient;
}
