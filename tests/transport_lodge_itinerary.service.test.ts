import request from "supertest";
import app from "../src/app";
import { supabase } from "../src/lib/supabaseClients";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

describe("Full Itinerary Mega-Flow Integration Test", () => {
  let supabaseAdmin: SupabaseClient;
  let testUser: any;
  let authToken: string;
  let testTripId: string;
  const uniqueEmail = `traveler-${Date.now()}@test.com`;

  beforeAll(async () => {
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!,
    );

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: uniqueEmail,
      password: "TestPassword123!",
    });
    if (authError) throw authError;
    testUser = authData.user;
    authToken = authData.session?.access_token || "";

    const { data: trip, error: tripError } = await supabase
      .from("t_trip_trip")
      .insert({
        title_trip: "Test Cleanup Trip",
        id_user_creator: testUser.id,
        startdate_trip: "2026-08-01",
        enddate_trip: "2026-08-15",
      })
      .select()
      .single();
    if (tripError) throw tripError;
    testTripId = trip.id_trip;

    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  afterAll(async () => {
    if (testTripId) {
      await supabaseAdmin
        .from("t_trip_trip")
        .delete()
        .eq("id_trip", testTripId);
    }
    if (testUser) {
      await supabaseAdmin.auth.admin.deleteUser(testUser.id);
    }
  });

  it("should create itinerary, lodging, and transport in one request and verify RLS", async () => {
    const response = await request(app)
      .post("/itinerary/full")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id_trip: testTripId,
        title_itit: "London Transit & Stay",
        date_itit: "2026-08-01",
        transport: {
          type_tran: "Flight",
          provider_tran: "British Airways",
          deploc_tran: "JFK",
          arrloc_tran: "LHR",
        },
        lodging: {
          name_lodg: "The Savoy",
          address_lodg: "Strand, London",
        },
      });

    const body = response.body;

    expect(response.status).toBe(201);
    expect(body.title_itit).toBe("London Transit & Stay");
    expect(body.transport.provider_tran).toBe("British Airways");
    expect(body.lodging.name_lodg).toBe("The Savoy");

    // Verify DB via Supabase client directly
    const { data: dbCheck } = await supabase
      .from("t_itinerary_item_itit")
      .select(`*, t_lodging_lodg(*), t_transport_tran(*)`)
      .eq("id_itit", body.id_itit)
      .single();

    expect(dbCheck).not.toBeNull();
    expect(dbCheck.t_lodging_lodg[0].name_lodg).toBe("The Savoy");
  });
});
