import { fetchGraphQL } from "../api/client.js";
import { USER_STATS_QUERY } from "../api/queries.js";
import { renderTerminalFrame, escapeXml, formatNumber } from "../utils/svgHelpers.js";

export interface StatsData {
  username: string;
  name: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalContributions: number;
  publicRepos: number;
}

interface GraphQLStatsResponse {
  user: {
    name: string | null;
    login: string;
    repositories: {
      totalCount: number;
      nodes: Array<{ stargazerCount: number }>;
    };
    contributionsCollection: {
      totalCommitContributions: number;
      totalIssueContributions: number;
      totalPullRequestContributions: number;
      totalPullRequestReviewContributions: number;
    };
  } | null;
}

export async function fetchStatsData(username: string, token: string): Promise<StatsData> {
  const response = await fetchGraphQL<GraphQLStatsResponse>(
    USER_STATS_QUERY,
    { username },
    token
  );

  if (!response.user) {
    throw new Error(`[ERROR] User '${username}' not found on GitHub API.`);
  }

  const user = response.user;
  const repos = user.repositories.nodes || [];
  const totalStars = repos.reduce((acc, repo) => acc + (repo?.stargazerCount || 0), 0);
  
  const commits = user.contributionsCollection.totalCommitContributions || 0;
  const prs = user.contributionsCollection.totalPullRequestContributions || 0;
  const issues = user.contributionsCollection.totalIssueContributions || 0;
  const prReviews = user.contributionsCollection.totalPullRequestReviewContributions || 0;

  const totalContributions = commits + prs + issues + prReviews;

  return {
    username: user.login,
    name: user.name || user.login,
    totalStars,
    totalCommits: commits,
    totalPRs: prs,
    totalIssues: issues,
    totalContributions,
    publicRepos: user.repositories.totalCount || 0
  };
}

export function renderStatsCard(data: StatsData): string {
  const content = `
    <!-- Top ASCII Separator Line -->
    <text x="0" y="5" class="term-muted">┌───────────────────────────────┬───────────────────────────────┐</text>
    
    <!-- Row 1: Stars & Commits -->
    <g transform="translate(0, 26)">
      <text x="12" y="0" class="term-text">STARS        :</text>
      <text x="125" y="0" class="term-accent-green term-bold">${formatNumber(data.totalStars)}</text>
      
      <text x="240" y="0" class="term-text">COMMITS      :</text>
      <text x="355" y="0" class="term-accent-green term-bold">${formatNumber(data.totalCommits)}</text>
    </g>

    <!-- Row 2: Pull Requests & Issues -->
    <g transform="translate(0, 52)">
      <text x="12" y="0" class="term-text">PULL REQUESTS:</text>
      <text x="125" y="0" class="term-accent-green term-bold">${formatNumber(data.totalPRs)}</text>

      <text x="240" y="0" class="term-text">ISSUES       :</text>
      <text x="355" y="0" class="term-accent-green term-bold">${formatNumber(data.totalIssues)}</text>
    </g>

    <!-- Row 3: Public Repos & Total Contributions -->
    <g transform="translate(0, 78)">
      <text x="12" y="0" class="term-text">PUBLIC REPOS :</text>
      <text x="125" y="0" class="term-accent-green term-bold">${formatNumber(data.publicRepos)}</text>

      <text x="240" y="0" class="term-text">CONTRIBUTIONS:</text>
      <text x="355" y="0" class="term-accent-green term-bold">${formatNumber(data.totalContributions)}</text>
    </g>

    <!-- Bottom ASCII Separator Line -->
    <text x="0" y="98" class="term-muted">└───────────────────────────────┴───────────────────────────────┘</text>
  `;

  return renderTerminalFrame(
    {
      width: 495,
      height: 195,
      title: `${data.username}@github: ~ (zsh)`,
      command: `github-stats --card=stats`
    },
    content
  );
}
