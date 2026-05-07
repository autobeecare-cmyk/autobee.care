import * as z from "zod";

export const ownerSurveySchema = z.object({
  // Step 1: Basics
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^(?:\+91)?[6-9]\d{9}$/, "Valid Indian phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  area: z.string().min(1, "Please select an area"),
  vehicle_type: z.string().min(1, "Please select vehicle type"),

  // Step 2: Habits & Pains
  wash_frequency: z.string().min(1, "Required"),
  current_spend: z.string().min(1, "Required"),
  biggest_pain_point: z.string().min(1, "Required"),

  // Step 3: Interest
  would_book_via_app: z.string().min(1, "Required"),
  pay_for_subscription: z.string().min(1, "Required"),
  open_feedback: z.string().optional(),
});

export type OwnerSurveyValues = z.infer<typeof ownerSurveySchema>;

// ── Partner Survey Schema ──────────────────────────────────────────────────

export const partnerSurveySchema = z.object({
  // Step 1: About Your Center
  center_name: z.string().min(2, "Center name is required"),
  owner_name: z.string().min(2, "Owner name is required"),
  phone: z.string().regex(/^(?:\+91)?[6-9]\d{9}$/, "Valid Indian phone number required"),
  area: z.string().min(1, "Please select your area"),
  years_in_business: z.string().min(1, "Required"),

  // Step 2: Your Business
  cars_per_day: z.string().min(1, "Required"),
  bikes_per_day: z.string().min(1, "Required"),
  peak_hours: z.string().min(1, "Required"),
  basic_wash_price: z.string().min(1, "Required"),
  premium_wash_price: z.string().optional(),
  add_ons_offered: z.string().optional(),
  staff_count: z.string().min(1, "Required"),

  // Step 3: Operations & Marketing
  has_signage: z.string().min(1, "Required"),
  on_google_maps: z.string().min(1, "Required"),
  uses_digital_tool: z.string().min(1, "Required"),
  customer_acquisition: z.string().min(1, "Required"),
  retention_method: z.string().optional(),
  daily_revenue_range: z.string().min(1, "Required"),
  slow_day_frequency: z.string().min(1, "Required"),

  // Step 4: Partnership Interest
  want_more_customers: z.string().min(1, "Required"),
  open_to_commission: z.string().min(1, "Required"),
  acceptable_commission: z.string().optional(),
  need_management_software: z.string().min(1, "Required"),
  raw_materials_source: z.string().optional(),
  open_to_partnership: z.string().min(1, "Required"),
  notes: z.string().optional(),
});

export type PartnerSurveyValues = z.infer<typeof partnerSurveySchema>;
