export type Team = {
  id: string;
  name: string;
  score: number;
  members?: string[] | null;
  latest_solve?: string | null;
  latest_points?: number | null;
  created_at?: string | null;
};

export type ScoreEvent = {
  id: string;
  team_id: string;
  points: number;
  reason: string;
  created_at: string;
  teams?:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

export type ParticipantInsert = {
  team_name: string;
  full_name: string;
  email: string;
  student_id: string;
  programming_languages: string[];
  academic_year: string;
  team_members: {
    full_name: string;
    student_id: string;
  }[];
};
