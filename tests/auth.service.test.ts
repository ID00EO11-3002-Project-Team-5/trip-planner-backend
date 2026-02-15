import request from "supertest";
import app from "../src/app";
import { adminSupabase } from "../src/lib/supabaseClients";

describe("User Lifecycle: Full Integration Test", () => {
  let userId: string;
  let accessToken: string;

  const timestamp = Date.now();
  const testUser = {
    email: `lifecycle-${timestamp}@test.com`,
    password: "SecurePassword123!",
    username: `user_${timestamp}`,
  };

  it("should complete the full user lifecycle successfully", async () => {
    // 1. SIGN UP
    const signupRes = await request(app).post("/auth/signup").send(testUser);
    expect(signupRes.statusCode).toEqual(201);

    userId = signupRes.body.user.id;
    expect(typeof userId).toBe("string");
    expect(userId.length).toBeGreaterThan(0);

    // 2. LOGIN
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(loginRes.statusCode).toEqual(200);
    accessToken = loginRes.body.session.access_token;

    // 3. LOGOUT
    const logoutRes = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(logoutRes.statusCode).toEqual(200);
    expect(logoutRes.body.message).toContain("Logout successful");

    // 4. RE-LOGIN
    const reloginRes = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    const freshToken = reloginRes.body.session.access_token;

    // 5. DELETE ACCOUNT
    const deleteRes = await request(app)
      .delete("/auth/delete_account")
      .set("Authorization", `Bearer ${freshToken}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.message).toContain("permanently deleted");
  });
});

describe("Security: Cross-User Deletion Prevention", () => {
  let userBToken: string;
  let userAId: string;
  let userBId: string;

  const timestamp = Date.now();

  afterAll(async () => {
    if (userAId) {
      await adminSupabase.auth.admin.deleteUser(userAId);
    }
    if (userBId) {
      await adminSupabase.auth.admin.deleteUser(userBId);
    }
  });

  it("should prevent User B from deleting User A's account", async () => {
    const signupA = await request(app)
      .post("/auth/signup")
      .send({
        email: `victim-${timestamp}@test.com`,
        password: "Password123!",
        username: "victim_user",
      });
    userAId = signupA.body.user.id;

    const signupB = await request(app)
      .post("/auth/signup")
      .send({
        email: `attacker-${timestamp}@test.com`,
        password: "Password123!",
        username: "attacker_user",
      });
    userBId = signupB.body.user.id;
    const loginB = await request(app)
      .post("/auth/login")
      .send({
        email: `attacker-${timestamp}@test.com`,
        password: "Password123!",
      });
    userBToken = loginB.body.session.access_token;

    const res = await request(app)
      .delete("/auth/delete_account")
      .set("Authorization", `Bearer ${userBToken}`);

    const { data: userA } = await adminSupabase.auth.admin.getUserById(userAId);
    expect(userA.user).not.toBeNull();
    expect(res.statusCode).toBe(200);
  });
});
