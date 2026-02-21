import request from "supertest";
import app from "../src/app";
import { supabase, adminSupabase } from "../src/lib/supabaseClients";

describe("Trip Invite & Collaboration Integration", () => {
  // 1. All variables declared here for global scope
  let ownerToken: string;
  let friendToken: string;
  let ownerUser: any;
  let friendUser: any;
  let testTripId: string;

  beforeAll(async () => {
    // 2. Setup Users
    const { data: oAuth } = await supabase.auth.signUp({
      email: `o-${Date.now()}@t.com`,
      password: "Password123!",
    });
    const { data: fAuth } = await supabase.auth.signUp({
      email: `f-${Date.now()}@t.com`,
      password: "Password123!",
    });

    ownerUser = oAuth.user;
    friendUser = fAuth.user;
    ownerToken = oAuth.session?.access_token || "";
    friendToken = fAuth.session?.access_token || "";

    // 3. Setup Trip
    const { data: trip, error } = await adminSupabase
      .from("t_trip_trip")
      .insert({
        title_trip: "Collab Trip",
        id_user_creator: ownerUser.id,
        startdate_trip: "2026-06-01",
        enddate_trip: "2026-06-10",
      })
      .select()
      .single();

    if (error) throw new Error(`Trip Setup Failed: ${error.message}`);
    testTripId = trip.id_trip;
  });

  afterAll(async () => {
    // 4. Cleanup both users and trip
    if (testTripId)
      await adminSupabase
        .from("t_trip_trip")
        .delete()
        .eq("id_trip", testTripId);
    if (ownerUser) await adminSupabase.auth.admin.deleteUser(ownerUser.id);
    if (friendUser) await adminSupabase.auth.admin.deleteUser(friendUser.id);
  });

  it("should allow owner to create an invite and friend to join", async () => {
    // 1. Owner creates invite
    const inviteRes = await request(app)
      .post(`/invite/trips/${testTripId}/invite`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        invitedUserId: friendUser.id,
      });

    if (inviteRes.status !== 201) {
      console.log("❌ INVITE ERROR:", JSON.stringify(inviteRes.body, null, 2));
    }

    expect(inviteRes.status).toBe(201);

    // 2. Extract the inviteId from the response to use in the PATCH call
    const inviteId = inviteRes.body.id_invi || inviteRes.body.data?.id_invi;

    // 3. Friend accepts invite
    const joinRes = await request(app)
      .patch(`/invite/${inviteId}/accept`)
      .set("Authorization", `Bearer ${friendToken}`)
      .send();

    expect(joinRes.status).toBe(200);
  });
});
