import { getRegistrationRecords } from "@/lib/google-sheets";

export async function getParticipantCount(): Promise<number> {
  const registrations = await getRegistrationRecords();
  return registrations.reduce((total, registration) => total + 1 + registration.team_members.length, 0);
}

export async function getAdminSession() {
  return { session: { id: "admin-user" }, isAdmin: true };
}
