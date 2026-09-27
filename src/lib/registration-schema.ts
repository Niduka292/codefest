export type ValidatedRegistration = {
  team_name: string;
  full_name: string;
  email: string;
  student_id: string;
  academic_year: string;
  programming_languages: string[];
  team_members: {
    full_name: string;
    student_id: string;
  }[];
  form_started_at: number;
};

export const registrationSchema = {
  safeParse(data: unknown): { success: true; data: ValidatedRegistration } | { success: false; error: { issues: { message: string }[] } } {
    if (typeof data !== "object" || data === null) {
      return { success: false, error: { issues: [{ message: "Invalid payload" }] } };
    }

    const d = data as Record<string, unknown>;

    const team_name = String(d.team_name || "").trim();
    const full_name = String(d.full_name || "").trim();
    const email = String(d.email || "").trim();
    const student_id = String(d.student_id || "").trim();
    const academic_year = String(d.academic_year || "Year 1");
    const form_started_at = Number(d.form_started_at || Date.now());

    if (!team_name) return { success: false, error: { issues: [{ message: "Team name is required." }] } };
    if (!full_name) return { success: false, error: { issues: [{ message: "Leader name is required." }] } };
    if (!email || !email.includes("@")) return { success: false, error: { issues: [{ message: "Valid email is required." }] } };
    if (!student_id) return { success: false, error: { issues: [{ message: "Student ID is required." }] } };

    const programming_languages = Array.isArray(d.programming_languages)
      ? d.programming_languages.map(String)
      : [];

    const rawMembers = Array.isArray(d.team_members) ? d.team_members : [];
    const team_members = rawMembers
      .map((m: unknown) => {
        if (typeof m === "object" && m !== null) {
          const item = m as Record<string, unknown>;
          return {
            full_name: String(item.full_name || "").trim(),
            student_id: String(item.student_id || "").trim(),
          };
        }
        return { full_name: "", student_id: "" };
      })
      .filter((m) => m.full_name && m.student_id);

    return {
      success: true,
      data: {
        team_name,
        full_name,
        email,
        student_id,
        academic_year,
        programming_languages,
        team_members,
        form_started_at,
      },
    };
  },
};
