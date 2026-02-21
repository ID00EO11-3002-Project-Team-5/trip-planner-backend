import request from "supertest";
import app from "../src/app";
import { supabase, adminSupabase } from "../src/lib/supabaseClients";

describe("Itinerary Reordering Integration", () => {
  let authToken: string;
  let testUser: any;
  let testTripId: string;

  beforeAll(async () => {
    const uniqueEmail = `reorder-${Date.now()}@test.com`;
    const { data: authData } = await supabase.auth.signUp({
      email: uniqueEmail,
      password: "TestPassword123!",
    });
    testUser = authData.user;
    authToken = authData.session?.access_token || "";

    const { data: trip } = await supabase
      .from("t_trip_trip")
      .insert({
        title_trip: "Reorder Test Trip",
        id_user_creator: testUser.id,
        startdate_trip: "2026-10-01",
        enddate_trip: "2026-10-10",
      })
      .select()
      .single();

    testTripId = trip.id_trip;
  });

  afterAll(async () => {
    if (testTripId)
      await adminSupabase
        .from("t_trip_trip")
        .delete()
        .eq("id_trip", testTripId);
    if (testUser) await adminSupabase.auth.admin.deleteUser(testUser.id);
  });

  it("should successfully reorder itinerary items using position_itit", async () => {
    // 1. Create two itinerary items
    const res1 = await request(app)
      .post("/itinerary")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id_trip: testTripId,
        title_itit: "Activity A",
        date_itit: "2026-10-01",
        position_itit: 1,
      });

    const res2 = await request(app)
      .post("/itinerary")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id_trip: testTripId,
        title_itit: "Activity B",
        date_itit: "2026-10-01",
        position_itit: 2,
      });

    const id1 = res1.body.id_itit || res1.body.data?.id_itit;
    const id2 = res2.body.id_itit || res2.body.data?.id_itit;

    // 2. Use the validated IDs in the reorder request
    const reorderRes = await request(app)
      .patch("/itinerary/reorder")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        tripId: testTripId,
        updates: [
          { id_itit: id1, position_itit: 2 },
          { id_itit: id2, position_itit: 1 },
        ],
      });

    expect(reorderRes.status).toBe(200);

    // 3. Verify the database reflect your logic
    const { data: check } = await supabase
      .from("t_itinerary_item_itit")
      .select("title_itit")
      .eq("id_trip", testTripId)
      .order("position_itit", { ascending: true });

    expect(check![0].title_itit).toBe("Activity B");
    expect(check![1].title_itit).toBe("Activity A");
  });
});
