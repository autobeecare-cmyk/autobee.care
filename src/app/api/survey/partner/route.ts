import { NextResponse } from "next/server";
import { partnerSurveySchema } from "@/lib/schema";
import * as z from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = partnerSurveySchema.parse(body);



    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = await createAdminClient();
    
    // Convert empty strings to null to avoid Supabase errors on TIME/INTEGER columns
    const sanitizedData = Object.fromEntries(
      Object.entries(validatedData).map(([key, value]) => [key, value === "" ? null : value])
    );

    const { error } = await supabase
      .from("partner_onboarding_responses")
      .insert([{
        ...sanitizedData,
      }]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
