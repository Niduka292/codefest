import { NextResponse } from "next/server";
import { saveRegistrationRecord } from "@/lib/registrations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      team_name,
      full_name,
      email,
      student_id,
      academic_year,
      programming_languages,
      team_members,
    } = body;

    // Basic validation
    if (!team_name || !full_name || !email || !student_id) {
      return NextResponse.json(
        { error: "Team name, leader name, email, and student ID are required." },
        { status: 400 }
      );
    }

    // 1. Always save locally to registrations.json
    const savedRecord = saveRegistrationRecord({
      submitted_at: new Date().toISOString(),
      team_name: String(team_name).trim(),
      full_name: String(full_name).trim(),
      email: String(email).trim(),
      student_id: String(student_id).trim(),
      academic_year: String(academic_year || "Year 1"),
      programming_languages: Array.isArray(programming_languages) ? programming_languages : [],
      team_members: Array.isArray(team_members) ? team_members : [],
    });

    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

    let webhookStatus = "not_configured";

    if (webhookUrl && webhookUrl.trim() !== "") {
      try {
        const formattedMembers = savedRecord.team_members
          .map((m) => `${m.full_name} (${m.student_id})`)
          .join("; ");

        // Post URL-encoded params to handle Google Apps Script & webhooks reliably
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
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formParams.toString(),
          redirect: "follow",
        });

        if (response.ok || response.status === 200 || response.status === 302) {
          webhookStatus = "success";
        } else {
          console.warn("Google Webhook response status:", response.status);
          webhookStatus = `failed_status_${response.status}`;
        }
      } catch (err) {
        console.error("Error forwarding to Google Sheets webhook:", err);
        webhookStatus = "webhook_error";
      }
    }

    return NextResponse.json({
      success: true,
      message: "Team registration recorded successfully.",
      record: savedRecord,
      webhookStatus,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to process registration submission." },
      { status: 500 }
    );
  }
}
