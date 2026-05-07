import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ownerSurveySchema } from "@/lib/schema";
import * as z from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = ownerSurveySchema.parse(body);



    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("owner_responses")
      .insert([{
        ...validatedData,
        user_agent: req.headers.get("user-agent"),
        referrer: req.headers.get("referer"),
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
