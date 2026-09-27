export type LeaderboardTeam = {
  id: string;
  rank: number;
  name: string;
  dsa_points: number;
  security_points: number;
  systems_points: number;
  total_score: number;
  latest_solve: string;
  latest_points?: number;
  members?: string[];
};

export const MOCK_LEADERBOARD: LeaderboardTeam[] = [
  {
    id: "team-1",
    rank: 1,
    name: "CYBER_PHANTOMS",
    dsa_points: 950,
    security_points: 980,
    systems_points: 920,
    total_score: 2850,
    latest_solve: "GRAPH_TRAVERSAL.PY",
    latest_points: 350,
    members: ["ALEX REED", "SARAH CHEN", "DAVID KIM", "ELENA ROSTOVA"],
  },
  {
    id: "team-2",
    rank: 2,
    name: "NEURAL_NINJAS",
    dsa_points: 880,
    security_points: 820,
    systems_points: 720,
    total_score: 2420,
    latest_solve: "CIPHER_PROTOCOLS.TS",
    latest_points: 250,
    members: ["MARCUS VANCE", "PRIYA SHARMA", "LEO ZHANG"],
  },
  {
    id: "team-3",
    rank: 3,
    name: "QUANTUM_SYNAPSE",
    dsa_points: 750,
    security_points: 690,
    systems_points: 740,
    total_score: 2180,
    latest_solve: "QUANTUM_ROUTER.CPP",
    latest_points: 200,
    members: ["SOFIA GOMEZ", "TAKAHASHI KEN", "BENJAMIN MOORE"],
  },
  {
    id: "team-4",
    rank: 4,
    name: "BINARY_BREAKERS",
    dsa_points: 680,
    security_points: 640,
    systems_points: 630,
    total_score: 1950,
    latest_solve: "STACK_OVERFLOW_FIX",
    latest_points: 150,
    members: ["JASPER COX", "ZOE DIAZ", "LUCAS SILVA"],
  },
  {
    id: "team-5",
    rank: 5,
    name: "ALGORITHM_ARCHITECTS",
    dsa_points: 580,
    security_points: 540,
    systems_points: 520,
    total_score: 1640,
    latest_solve: "MEMORY_BUFFER_OPT",
    latest_points: 120,
    members: ["NATHAN ROY", "AMARA OKORIE"],
  },
];

export async function fetchLiveLeaderboard(): Promise<{ teams: LeaderboardTeam[]; source: string }> {
  const leaderboardUrl =
    process.env.GOOGLE_SHEETS_LEADERBOARD_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEETS_LEADERBOARD_URL;

  if (!leaderboardUrl || leaderboardUrl.trim() === "") {
    return { teams: MOCK_LEADERBOARD, source: "local_mock" };
  }

  try {
    const response = await fetch(leaderboardUrl.trim(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      redirect: "follow",
    });

    if (!response.ok) {
      console.warn(`GOOGLE_SHEETS_LEADERBOARD_URL returned status ${response.status}`);
      return { teams: MOCK_LEADERBOARD, source: "local_mock" };
    }

    const rawJson = await response.json();
    let rawList: any[] = [];

    if (Array.isArray(rawJson)) {
      rawList = rawJson;
    } else if (rawJson && typeof rawJson === "object") {
      if (Array.isArray(rawJson.teams)) rawList = rawJson.teams;
      else if (Array.isArray(rawJson.data)) rawList = rawJson.data;
      else if (Array.isArray(rawJson.result)) rawList = rawJson.result;
      else if (Array.isArray(rawJson.rows)) rawList = rawJson.rows;
    }

    if (!rawList || rawList.length === 0) {
      return { teams: MOCK_LEADERBOARD, source: "local_mock" };
    }

    // Check if 2D array format (headers in row 0)
    if (Array.isArray(rawList[0])) {
      const headers = (rawList[0] as any[]).map((h) => String(h).toLowerCase().trim());
      const dataRows = rawList.slice(1);

      const teamNameIdx = headers.findIndex((h) => h.includes("team") || h.includes("name"));
      const dsaIdx = headers.findIndex((h) => h.includes("dsa") || h.includes("data") || h.includes("struct"));
      const secIdx = headers.findIndex((h) => h.includes("sec") || h.includes("cyber") || h.includes("guard"));
      const sysIdx = headers.findIndex((h) => h.includes("sys") || h.includes("org"));
      const solveIdx = headers.findIndex((h) => h.includes("solve") || h.includes("latest") || h.includes("status"));

      const formatted: LeaderboardTeam[] = dataRows
        .filter((row) => row && row[teamNameIdx !== -1 ? teamNameIdx : 0])
        .map((row, idx) => {
          const name = String(row[teamNameIdx !== -1 ? teamNameIdx : 0] || `Team ${idx + 1}`).toUpperCase();
          const dsa = Number(row[dsaIdx !== -1 ? dsaIdx : 1]) || 0;
          const sec = Number(row[secIdx !== -1 ? secIdx : 2]) || 0;
          const sys = Number(row[sysIdx !== -1 ? sysIdx : 3]) || 0;
          const solve = String(row[solveIdx !== -1 ? solveIdx : 4] || "PROTOCOL ACTIVE");

          return {
            id: `sheet-team-${idx}`,
            rank: idx + 1,
            name,
            dsa_points: dsa,
            security_points: sec,
            systems_points: sys,
            total_score: dsa + sec + sys,
            latest_solve: solve,
            latest_points: 100,
          };
        });

      formatted.sort((a, b) => b.total_score - a.total_score);
      formatted.forEach((t, i) => (t.rank = i + 1));

      return {
        teams: formatted.length > 0 ? formatted : MOCK_LEADERBOARD,
        source: formatted.length > 0 ? "google_spreadsheet" : "local_mock",
      };
    }

    // Array of Objects format
    const formatted: LeaderboardTeam[] = rawList.map((item: Record<string, any>, idx: number) => {
      const getVal = (...keys: string[]) => {
        for (const k of keys) {
          if (item[k] !== undefined && item[k] !== null && item[k] !== "") return item[k];
          const foundKey = Object.keys(item).find((ik) => ik.toLowerCase().trim() === k.toLowerCase().trim());
          if (foundKey && item[foundKey] !== undefined && item[foundKey] !== null && item[foundKey] !== "") {
            return item[foundKey];
          }
        }
        return undefined;
      };

      const name = String(getVal("name", "team_name", "team name", "team") || `Team ${idx + 1}`).toUpperCase();
      const dsa = Number(getVal("dsa_points", "dsa", "data structures points", "data structures") || 0);
      const sec = Number(getVal("security_points", "security", "security points", "cyber security", "sec") || 0);
      const sys = Number(getVal("systems_points", "systems", "systems points", "computer system organization", "sys") || 0);
      const calculatedTotal = dsa + sec + sys;
      const total = calculatedTotal > 0 ? calculatedTotal : Number(getVal("total_score", "total", "total score", "score") || 0);
      const solve = String(getVal("latest_solve", "latest solve", "solve") || "PROTOCOL ACTIVE");

      let members: string[] = [];
      const rawMembers = getVal("members", "team_members", "team members");
      if (Array.isArray(rawMembers)) {
        members = rawMembers.map((m) => String(m));
      } else if (typeof rawMembers === "string" && rawMembers.trim() !== "") {
        members = rawMembers.split(";").map((m) => m.trim()).filter(Boolean);
      }

      return {
        id: `sheet-team-${idx}`,
        rank: idx + 1,
        name,
        dsa_points: dsa,
        security_points: sec,
        systems_points: sys,
        total_score: total,
        latest_solve: solve,
        latest_points: 100,
        members,
      };
    });

    formatted.sort((a, b) => b.total_score - a.total_score);
    formatted.forEach((t, i) => (t.rank = i + 1));

    return { teams: formatted, source: "google_spreadsheet" };
  } catch (error) {
    console.error("Error fetching live leaderboard:", error);
    return { teams: MOCK_LEADERBOARD, source: "local_mock" };
  }
}
