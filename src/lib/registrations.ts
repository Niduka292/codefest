import fs from "fs";
import path from "path";
import os from "os";
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

const inMemoryRegistrations: RegistrationRecord[] = [];

export function getSavedRegistrations(): RegistrationRecord[] {
  // Check process.cwd() registrations.json first
  try {
    const localPath = path.join(process.cwd(), "registrations.json");
    if (fs.existsSync(localPath)) {
      const fileData = fs.readFileSync(localPath, "utf-8");
      if (fileData.trim()) {
        const parsed: unknown = JSON.parse(fileData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as RegistrationRecord[];
        }
      }
    }
  } catch (err) {
    console.warn("Could not read local registrations.json:", err);
  }

  // Check /tmp registrations.json for serverless envs
  try {
    const tmpPath = path.join(os.tmpdir(), "registrations.json");
    if (fs.existsSync(tmpPath)) {
      const fileData = fs.readFileSync(tmpPath, "utf-8");
      if (fileData.trim()) {
        const parsed: unknown = JSON.parse(fileData);
        if (Array.isArray(parsed)) {
          return parsed as RegistrationRecord[];
        }
      }
    }
  } catch (err) {
    console.warn("Could not read tmp registrations.json:", err);
  }

  return inMemoryRegistrations;
}

export function saveRegistrationRecord(record: Omit<RegistrationRecord, "id">): RegistrationRecord {
  const existing = getSavedRegistrations();
  const newRecord: RegistrationRecord = {
    ...record,
    id: `reg-${randomUUID()}`,
  };
  
  const updated = [newRecord, ...existing];

  // Update in-memory fallback array
  inMemoryRegistrations.length = 0;
  inMemoryRegistrations.push(...updated);

  // Try writing to /tmp/registrations.json (works on Vercel) and local cwd
  const targetPaths = [
    path.join(os.tmpdir(), "registrations.json"),
    path.join(process.cwd(), "registrations.json"),
  ];

  for (const targetPath of targetPaths) {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, JSON.stringify(updated, null, 2), "utf-8");
      break;
    } catch (err) {
      // Ignore EROFS read-only file system on serverless containers
    }
  }

  return newRecord;
}
