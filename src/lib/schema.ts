import * as z from "zod";

export const ownerSurveySchema = z.object({
  // Step 1: About You
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^(?:\+91)?[6-9]\d{9}$/, "Valid Indian phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  age_group: z.string().min(1, "Please select an age group"),
  area: z.string().min(1, "Please select an area"),
  occupation: z.string().optional(),

  // Step 2: Your Vehicle
  vehicle_type: z.string().min(1, "Please select vehicle type"),
  vehicle_make_model: z.string().min(2, "Please specify make and model"),
  vehicle_age: z.string().min(1, "Please select vehicle age"),

  // Step 3: Your Wash Habits
  wash_frequency: z.string().min(1, "Required"),
  current_wash_location: z.string().min(1, "Required"),
  current_spend: z.string().min(1, "Required"),
  biggest_pain_point: z.string().min(1, "Required"),

  // Step 4: AutoBee Concept
  used_wash_app_before: z.string().min(1, "Required"),
  would_book_via_app: z.string().min(1, "Required"),
  pay_for_subscription: z.string().min(1, "Required"),
  willingness_to_pay: z.string().min(1, "Required"),
  on_time_guarantee_value: z.string().min(1, "Required"),
  fixed_pricing_preference: z.string().min(1, "Required"),

  // Step 5: Beyond Wash
  want_vehicle_management: z.string().min(1, "Required"),
  insurance_reminder_useful: z.string().min(1, "Required"),
  service_history_useful: z.string().min(1, "Required"),
  prepurchase_inspection: z.string().min(1, "Required"),

  // Step 6: Final Thoughts
  refer_to_friends: z.string().min(1, "Required"),
  open_feedback: z.string().optional(),
  early_access_interest: z.string().min(1, "Required"),
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
