import { NextRequest, NextResponse } from "next/server";
import { RegistrationStorageError, saveRegistrationToPrimaryStorage } from "@/lib/google-sheets";
import { checkRateLimit } from "@/lib/rate-limit";
import { registrationSchema } from "@/lib/registration-schema";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 20_000;
const MIN_FORM_COMPLETION_MS = 1_500;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

function getClientKey(request: NextRequest) {
  const forwardedAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedAddress || request.headers.get("x-real-ip") || "unknown-client";
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Registration data is too large." }, { status: 413 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site" || (origin && origin !== request.nextUrl.origin)) {
    return NextResponse.json({ error: "Cross-site registration requests are not allowed." }, { status: 403 });
  }

  const rateLimit = checkRateLimit(getClientKey(request));
  if (!rateLimit.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Registration data must be valid JSON." }, { status: 400 });
  }

  if (JSON.stringify(body).length > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Registration data is too large." }, { status: 413 });
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.trim() !== ""
  ) {
    // Return a neutral response so automated form fillers do not learn how the trap works.
    return NextResponse.json({ success: true, message: "Team registration recorded successfully." });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid registration data." },
      { status: 400 },
    );
  }

  const now = Date.now();
  const formAge = now - parsed.data.form_started_at;
  if (formAge < MIN_FORM_COMPLETION_MS || formAge > MAX_FORM_AGE_MS) {
    return NextResponse.json(
      { error: "Please refresh the registration page and complete the form again." },
      { status: 400 },
    );
  }

  const registration = {
    team_name: parsed.data.team_name,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    student_id: parsed.data.student_id,
    academic_year: parsed.data.academic_year,
    programming_languages: parsed.data.programming_languages,
    team_members: parsed.data.team_members,
  };

  try {
    const savedRecord = await saveRegistrationToPrimaryStorage(registration);

    return NextResponse.json({
      success: true,
      message: "Team registration recorded successfully.",
      registrationId: savedRecord.id,
      storage: process.env.NODE_ENV === "production" ? "google_sheets" : "configured_primary",
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof RegistrationStorageError) {
      const status = error.code === "duplicate" ? 409 : error.code === "not_configured" ? 503 : 502;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ error: "Failed to save registration. Please try again." }, { status: 500 });
  }
}
