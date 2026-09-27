export const ALLOWED_LANGUAGES = [
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "HTML",
  "Other",
] as const;

export const ALLOWED_ACADEMIC_YEARS = ["Year 1", "Year 2", "Year 3"] as const;

export const MAX_ADDITIONAL_MEMBERS = 4;
export const MAX_TEAM_SIZE = MAX_ADDITIONAL_MEMBERS + 1;
export const STUDENT_ID_PATTERN = /^AS20\d{5}$/;
export const STUDENT_ID_HELP = "Student ID must match AS202XXXX using digits in place of X, for example AS2022123.";
