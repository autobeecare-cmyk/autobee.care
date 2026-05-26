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
  // SECTION 1: BUSINESS INFORMATION
  business_name: z.string().min(2, "Business name is required"),
  owner_name: z.string().min(2, "Owner name is required"),
  phone_number: z.string().regex(/^(?:\+91)?[6-9]\d{9}$/, "Valid Indian phone number required"),
  address: z.string().min(5, "Full address is required"),
  years_in_business: z.string().min(1, "Required"),

  // SECTION 2: OPERATING HOURS & CAPACITY
  vehicle_capacity: z.coerce.number().min(1).max(20, "Must be between 1 and 20"),
  staff_count: z.coerce.number().min(1, "Required"),
  regular_open_time: z.string().min(1, "Required"),
  regular_close_time: z.string().min(1, "Required"),
  has_weekend_hours: z.boolean(),
  saturday_open_time: z.string().optional(),
  saturday_close_time: z.string().optional(),
  sunday_open_time: z.string().optional(),
  sunday_close_time: z.string().optional(),
  weekly_off_day: z.string().optional(),
  has_lunch_break: z.boolean(),
  lunch_start_time: z.string().optional(),
  lunch_end_time: z.string().optional(),

  // SECTION 3: SERVICES & DURATION
  services_offered: z.array(z.string()).min(1, "Select at least one service"),
  service_durations: z.record(z.string(), z.coerce.number()),
  service_prices: z.record(z.string(), z.coerce.number()).optional(),

  // SECTION 4: CURRENT CUSTOMER ACQUISITION
  daily_vehicles: z.coerce.number().min(1).max(200, "Must be between 1 and 200"),
  repeat_customer_percentage: z.string().min(1, "Required"),
  acquisition_channels: z.array(z.string()).min(1, "Select at least one channel"),
  biggest_pain_point: z.string().optional(),

  // SECTION 5: WALK-IN BUFFER & SLOT STRATEGY
  walk_in_percentage: z.string().min(1, "Required"),
  walk_in_buffer_percent: z.coerce.number().min(0).max(50),

  // SECTION 6: TECHNICAL READINESS
  has_smartphone: z.boolean(),
  app_comfort_level: z.string().min(1, "Required"),
  response_time: z.string().min(1, "Required"),

  // SECTION 7: COMMITMENT & PAYMENT
  trial_commitment: z.boolean(),
  bank_account_name: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank_account_type: z.string().optional(),
  bank_ifsc_code: z.string().optional(),
  upi_id: z.string().optional(),
  contact_preference: z.string().min(1, "Required"),

  // SECTION 8: CONFIRMATION & NEXT STEPS
  confirmed_ready: z.boolean().refine((val) => val === true, "You must confirm to proceed"),
  additional_comments: z.string().optional(),
});

export type PartnerSurveyValues = z.infer<typeof partnerSurveySchema>;
