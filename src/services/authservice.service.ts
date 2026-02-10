import {
  createUserClientFromAuthHeader,
  supabase,
} from "../lib/supabaseClients";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export const authService = {
  async registerUser(credentials: SignUpWithPasswordCredentials) {
    if ("email" in credentials) {
      if (!credentials.email || !credentials.password) {
        throw new Error("Email is required for registration.");
      }

      const { email, password, options } = credentials;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data,

          emailRedirectTo: process.env.FRONTEND_URL,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  },

  async loginUser(credentials: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async logoutuser(token: string) {
    const userClient = createUserClientFromAuthHeader(`Bearrer ${token}`);

    if (!userClient) throw new Error("Invalid session");

    const { error } = await userClient.auth.signOut();

    if (error) throw new Error(error.message);
    return { messag: "Logged out successfully" };
  },
};
