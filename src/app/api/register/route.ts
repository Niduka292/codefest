import { NextRequest, NextResponse } from "next/server";
import { getSavedRegistrations, saveRegistrationRecord } from "@/lib/registrations";
import { checkRateLimit } from "@/lib/rate-limit";
import { registrationSchema, type ValidatedRegistration } from "@/lib/registration-schema";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 20_000;
const MIN_FORM_COMPLETION_MS = 1_500;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

function getClientKey(request: NextRequest) {
  const forwardedAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedAddress || request.headers.get("x-real-ip") || "unknown-client";
}

function canonical(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function findDuplicate(registration: ValidatedRegistration) {
  const registrations = getSavedRegistrations();
  const submittedIds = new Set([
    registration.student_id,
    ...registration.team_members.map((member) => member.student_id),
  ]);

  for (const existing of registrations) {
    if (canonical(existing.team_name) === canonical(registration.team_name)) {
      return "That team name is already registered.";
    }

    if (canonical(existing.email) === canonical(registration.email)) {
      return "A registration already exists for this email address.";
    }

    const existingIds = [existing.student_id, ...(existing.team_members ?? []).map((member) => member.student_id)]
      .map((studentId) => studentId.trim().toUpperCase());

    if (existingIds.some((studentId) => submittedIds.has(studentId))) {
      return "One or more student IDs have already been registered.";
    }
  }

  return null;
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

  const duplicateError = findDuplicate(parsed.data);
  if (duplicateError) {
    return NextResponse.json({ error: duplicateError }, { status: 409 });
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
    const savedRecord = saveRegistrationRecord({
      submitted_at: new Date().toISOString(),
      ...registration,
    });

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let webhookStatus = "not_configured";

    if (webhookUrl?.trim()) {
      try {
        const formattedMembers = savedRecord.team_members
          .map((member) => `${member.full_name} (${member.student_id})`)
          .join("; ");

        const formParams = new URLSearchParams();
        formParams.append("submitted_at", savedRecord.submitted_at);
        formParams.append("team_name", savedRecord.team_name);
        formParams.append("full_name", savedRecord.full_name);
        formParams.append("email", savedRecord.email);
        formParams.append("student_id", savedRecord.student_id);
        formParams.append("academic_year", savedRecord.academic_year);
        formParams.append("programming_languages", savedRecord.programming_languages.join(", "));
        formParams.append("team_members", formattedMembers);

        const response = await fetch(webhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formParams.toString(),
          redirect: "follow",
        });

        webhookStatus = response.ok ? "success" : `failed_status_${response.status}`;
      } catch (error) {
        console.error("Error forwarding registration to the configured webhook:", error);
        webhookStatus = "webhook_error";
      }
    }

    return NextResponse.json({
      success: true,
      message: "Team registration recorded successfully.",
      registrationId: savedRecord.id,
      webhookStatus,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to save registration. Please try again." }, { status: 500 });
  }
}
