import { adminSupabase } from "../lib/supabaseClients";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export const authService = {
  async registerUser(credentials: SignUpWithPasswordCredentials) {
    if (!("email" in credentials)) {
      throw new Error("Email is required for registration.");
    }

    const { email, password, options } = credentials;

    const { data, error } = await adminSupabase.auth.signUp({
      email,
      password,
      options: {
        data: options?.data,

        emailRedirectTo: "http://localhost:3000/",
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async loginUser(credentials: { email: string; password: string }) {
    const { data, error } = await adminSupabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async logoutuser(token: string) {
    const { error } = await adminSupabase.auth.signOut();

    if (error) throw new Error(error.message);
    return { messag: "Logged out successfully" };
  },
};
