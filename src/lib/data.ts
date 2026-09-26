export async function getParticipantCount(): Promise<number> {
  return 42;
}

export async function getAdminSession() {
  return { session: { id: "admin-user" }, isAdmin: true };
}
