import { fetchGraphQL } from "../api/client.js";
import { USER_STREAK_QUERY } from "../api/queries.js";
import { renderTerminalFrame, escapeXml, formatNumber } from "../utils/svgHelpers.js";

export interface StreakData {
  username: string;
  totalContributions: number;
  firstContributionDate: string;
  lastContributionDate: string;
  currentStreak: number;
  currentStreakStart: string;
  currentStreakEnd: string;
  longestStreak: number;
  longestStreakStart: string;
  longestStreakEnd: string;
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface GraphQLStreakResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: ContributionDay[];
        }>;
      };
    };
  } | null;
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function fetchStreakData(username: string, token: string): Promise<StreakData> {
  const response = await fetchGraphQL<GraphQLStreakResponse>(
    USER_STREAK_QUERY,
    { username },
    token
  );

  if (!response.user) {
    throw new Error(`[ERROR] User '${username}' not found on GitHub API.`);
  }

  const calendar = response.user.contributionsCollection.contributionCalendar;
  const days: ContributionDay[] = [];

  for (const week of calendar.weeks || []) {
    for (const day of week.contributionDays || []) {
      days.push(day);
    }
  }

  days.sort((a, b) => a.date.localeCompare(b.date));

  const totalContributions = calendar.totalContributions || 0;
  const firstDate = days.length > 0 ? formatDateShort(days[0].date) : "";
  const lastDate = days.length > 0 ? formatDateShort(days[days.length - 1].date) : "";

  // ---------------------------------------------------------------------------
  // Calculate Longest Streak
  // ---------------------------------------------------------------------------
  let longestStreak = 0;
  let longestStart = "";
  let longestEnd = "";

  let tempStreak = 0;
  let tempStart = "";
  let tempEnd = "";

  for (const day of days) {
    if (day.contributionCount > 0) {
      if (tempStreak === 0) {
        tempStart = day.date;
      }
      tempStreak++;
      tempEnd = day.date;

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStart = tempStart;
        longestEnd = tempEnd;
      }
    } else {
      tempStreak = 0;
    }
  }

  // ---------------------------------------------------------------------------
  // Calculate Current Streak
  // ---------------------------------------------------------------------------
  let currentStreak = 0;
  let currentStart = "";
  let currentEnd = "";

  if (days.length > 0) {
    let i = days.length - 1;
    
    // If today (the last day in calendar) has 0 contributions, check yesterday
    if (days[i].contributionCount === 0 && i > 0) {
      i--;
    }

    if (days[i].contributionCount > 0) {
      currentEnd = days[i].date;
      while (i >= 0 && days[i].contributionCount > 0) {
        currentStreak++;
        currentStart = days[i].date;
        i--;
      }
    }
  }

  return {
    username,
    totalContributions,
    firstContributionDate: firstDate,
    lastContributionDate: lastDate,
    currentStreak,
    currentStreakStart: formatDateShort(currentStart),
    currentStreakEnd: formatDateShort(currentEnd),
    longestStreak,
    longestStreakStart: formatDateShort(longestStart),
    longestStreakEnd: formatDateShort(longestEnd)
  };
}

export function renderStreakCard(data: StreakData): string {
  const boxWidth = 145;
  const boxHeight = 88;

  const renderBox = (
    title: string,
    value: string,
    subtext: string,
    accentClass: string,
    startX: number
  ) => {
    return `
      <g transform="translate(${startX}, 12)">
        <rect x="0" y="0" width="${boxWidth}" height="${boxHeight}" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1" />
        <text x="${boxWidth / 2}" y="22" text-anchor="middle" class="term-muted" font-size="11">${escapeXml(title)}</text>
        <text x="${boxWidth / 2}" y="50" text-anchor="middle" class="${accentClass} term-bold" font-size="18">${escapeXml(value)}</text>
        <text x="${boxWidth / 2}" y="72" text-anchor="middle" class="term-muted" font-size="10">${escapeXml(subtext)}</text>
      </g>
    `;
  };

  const content = `
    <!-- 3 Terminal Metric Boxes -->
    ${renderBox(
      "TOTAL CONTRIBS",
      formatNumber(data.totalContributions),
      `${data.firstContributionDate} - ${data.lastContributionDate}`,
      "term-accent-green",
      0
    )}

    ${renderBox(
      "CURRENT STREAK",
      `${data.currentStreak} DAYS`,
      data.currentStreak > 0 ? `${data.currentStreakStart} - ${data.currentStreakEnd}` : "No Active Streak",
      "term-accent-cyan",
      157
    )}

    ${renderBox(
      "LONGEST STREAK",
      `${data.longestStreak} DAYS`,
      data.longestStreak > 0 ? `${data.longestStreakStart} - ${data.longestStreakEnd}` : "No Streak",
      "term-accent-orange",
      314
    )}
  `;

  return renderTerminalFrame(
    {
      width: 495,
      height: 195,
      title: `${data.username}@github: ~ (zsh)`,
      command: `github-stats --card=streak`
    },
    content
  );
}
