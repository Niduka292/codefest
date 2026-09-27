export const ALLOWED_LANGUAGES = ["Python", "Java", "C++", "JavaScript", "HTML", "Other"] as const;
export const ALLOWED_ACADEMIC_YEARS = ["Year 1", "Year 2", "Year 3"] as const;
export const MAX_ADDITIONAL_MEMBERS = 4;
export const STUDENT_ID_PATTERN = /^[A-Za-z0-9_-]{3,20}$/;
export const STUDENT_ID_HELP = "3-20 letters, numbers, hyphens, or underscores.";
