import {
  createUserClientFromAuthHeader,
  supabase,
} from "../lib/supabaseClients";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export const authService = {
  async registerUser(credentials: SignUpWithPasswordCredentials) {
    if (!("email" in credentials)) {
      throw new Error("Email registration is required.");
    }

    const { email, password, options } = credentials;

    if (!email || !password) {
      throw new Error("Email and password are required for registration.");
    }

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
    const userClient = createUserClientFromAuthHeader(`Bearer ${token}`);

    if (!userClient) throw new Error("Invalid session");

    const { error } = await userClient.auth.signOut();

    if (error) throw new Error(error.message);
    return { messag: "Logged out successfully" };
  },

  async deleteSelfAccount(token: string) {
    // This creates a client using the user's own JWT token
    const userClient = createUserClientFromAuthHeader(`Bearer ${token}`);

    if (!userClient) {
      throw new Error("No valid session found for deletion.");
    }

    // RPC calls the 'delete_own_user' function we just created in SQL
    const { error } = await userClient.rpc("delete_own_user");

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: "Your account and profile have been permanently deleted.",
    };
  },
};
