import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Fetch all data
    const [
      { data: owners, error: ownerError },
      { data: partners, error: partnerError },
      { data: waitlist, error: waitlistError }
    ] = await Promise.all([
      supabase.from("owner_responses").select("*").order("created_at", { ascending: false }),
      supabase.from("partner_responses").select("*").order("created_at", { ascending: false }),
      supabase.from("waitlist").select("*").order("created_at", { ascending: false })
    ]);

    if (ownerError || partnerError || waitlistError) {
      throw new Error("Failed to fetch dashboard data");
    }

    // Process Owner Stats
    const vehicleTypes = owners?.reduce((acc: any, curr) => {
      acc[curr.vehicle_type] = (acc[curr.vehicle_type] || 0) + 1;
      return acc;
    }, {});

    const willingness = owners?.reduce((acc: any, curr) => {
      acc[curr.current_spend] = (acc[curr.current_spend] || 0) + 1;
      return acc;
    }, {});

    const subscription = owners?.reduce((acc: any, curr) => {
      acc[curr.pay_for_subscription] = (acc[curr.pay_for_subscription] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      summary: {
        totalOwners: owners?.length || 0,
        totalPartners: partners?.length || 0,
        totalWaitlist: waitlist?.length || 0,
      },
      owners: {
        raw: owners?.slice(0, 50) || [],
        vehicleTypes: Object.entries(vehicleTypes || {}).map(([name, value]) => ({ name, value })),
        willingness: Object.entries(willingness || {}).map(([name, value]) => ({ name, value })),
        subscription: Object.entries(subscription || {}).map(([name, value]) => ({ name, value })),
      },
      partners: partners?.slice(0, 50) || [],
      waitlist: waitlist?.slice(0, 100) || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
