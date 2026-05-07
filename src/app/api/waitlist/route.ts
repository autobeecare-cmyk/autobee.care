import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as z from "zod";

const waitlistSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^(?:\+91)?[6-9]\d{9}$/),
  email: z.string().email().optional().or(z.literal("")),
  area: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = waitlistSchema.parse(body);



    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("waitlist")
      .insert([{ ...validatedData, source: "landing_page" }]);

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
