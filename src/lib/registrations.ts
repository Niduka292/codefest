import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type RegistrationRecord = {
  id: string;
  submitted_at: string;
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
};

const DATA_FILE_PATH = path.join(process.cwd(), "registrations.json");

export function getSavedRegistrations(): RegistrationRecord[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return [];
    }
    const fileData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    const parsed: unknown = JSON.parse(fileData);
    return Array.isArray(parsed) ? (parsed as RegistrationRecord[]) : [];
  } catch (err) {
    console.error("Error reading registrations.json:", err);
    return [];
  }
}

export function saveRegistrationRecord(record: Omit<RegistrationRecord, "id">): RegistrationRecord {
  const existing = getSavedRegistrations();
  const newRecord: RegistrationRecord = {
    ...record,
    id: `reg-${randomUUID()}`,
  };
  
  const updated = [newRecord, ...existing];
  
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");

  return newRecord;
}
