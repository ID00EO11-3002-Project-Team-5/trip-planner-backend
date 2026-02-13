import request from "supertest";
import app from "../src/app";
import { adminSupabase } from "../src/lib/supabaseClients";

describe("User Lifecycle: Create to Delete", () => {
  let userId: string;
  const timestamp = Date.now();
  const testUser = {
    email: `lifecycle-${timestamp}@test.com`,
    password: "SecurePassword123!",
    username: `user_${timestamp}`,
  };

  // 1. SIGN UP
  it("should register the user", async () => {
    const res = await request(app).post("/auth/signup").send(testUser);
    expect(res.statusCode).toEqual(201);
    userId = res.body.user.id; // Save ID for deletion
  });

  // 2. LOGIN
  it("should login and return a token", async () => {
    const res = await request(app).post("/auth/login").send(testUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body.session).toHaveProperty("access_token");
  });

  // 3. DELETE
  afterAll(async () => {
    if (userId) {
      const { error } = await adminSupabase.auth.admin.deleteUser(userId);
      if (error) console.error("Cleanup failed:", error.message);
    }
  });
});
