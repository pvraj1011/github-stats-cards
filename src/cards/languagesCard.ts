import { fetchGraphQL } from "../api/client.js";
import { USER_LANGUAGES_QUERY } from "../api/queries.js";
import { renderTerminalFrame, escapeXml } from "../utils/svgHelpers.js";

export interface LanguageItem {
  name: string;
  color: string;
  size: number;
  percentage: number;
}

export interface LanguagesData {
  username: string;
  totalBytes: number;
  languages: LanguageItem[];
}

interface GraphQLLanguagesResponse {
  user: {
    repositories: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: Array<{
        name: string;
        languages: {
          edges: Array<{
            size: number;
            node: {
              name: string;
              color: string | null;
            };
          }>;
        };
      }>;
    };
  } | null;
}

const DEFAULT_LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4F5D95",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  Vue: "#41b883",
  React: "#61dafb"
};

export async function fetchLanguagesData(
  username: string,
  token: string,
  limit = 6
): Promise<LanguagesData> {
  const response = await fetchGraphQL<GraphQLLanguagesResponse>(
    USER_LANGUAGES_QUERY,
    { username },
    token
  );

  if (!response.user) {
    throw new Error(`[ERROR] User '${username}' not found on GitHub API.`);
  }

  const langMap: Map<string, { name: string; color: string; size: number }> = new Map();
  const repos = response.user.repositories.nodes || [];

  for (const repo of repos) {
    const edges = repo.languages?.edges || [];
    for (const edge of edges) {
      const name = edge.node.name;
      const size = edge.size || 0;
      const color = edge.node.color || DEFAULT_LANG_COLORS[name] || "#858585";

      if (langMap.has(name)) {
        const existing = langMap.get(name)!;
        existing.size += size;
      } else {
        langMap.set(name, { name, color, size });
      }
    }
  }

  const allLanguages = Array.from(langMap.values());
  const totalBytes = allLanguages.reduce((acc, item) => acc + item.size, 0);

  if (totalBytes === 0) {
    return {
      username,
      totalBytes: 0,
      languages: []
    };
  }

  allLanguages.sort((a, b) => b.size - a.size);

  let topLanguages = allLanguages.slice(0, limit).map((lang) => ({
    ...lang,
    percentage: (lang.size / totalBytes) * 100
  }));

  const remaining = allLanguages.slice(limit);
  if (remaining.length > 0) {
    const remainingSize = remaining.reduce((acc, item) => acc + item.size, 0);
    topLanguages.push({
      name: "Other",
      color: "#858585",
      size: remainingSize,
      percentage: (remainingSize / totalBytes) * 100
    });
  }

  return {
    username,
    totalBytes,
    languages: topLanguages
  };
}

export function renderLanguagesCard(data: LanguagesData): string {
  const barWidth = 459; // Total progress bar width in px
  let currentX = 0;

  // Build segmented progress bar rects
  const barSegments = data.languages.map((lang) => {
    const segmentWidth = Math.max((lang.percentage / 100) * barWidth, 2);
    const rectX = currentX;
    currentX += segmentWidth;

    return `<rect x="${rectX.toFixed(1)}" y="18" width="${segmentWidth.toFixed(1)}" height="10" fill="${lang.color}" />`;
  }).join("\n");

  // Build 2-column legend grid
  const halfLength = Math.ceil(data.languages.length / 2);
  const col1 = data.languages.slice(0, halfLength);
  const col2 = data.languages.slice(halfLength);

  const renderColumn = (items: LanguageItem[], startX: number) => {
    return items.map((lang, index) => {
      const yPos = 48 + index * 24;
      return `
        <g transform="translate(${startX}, ${yPos})">
          <circle cx="4" cy="-4" r="4.5" fill="${lang.color}" />
          <text x="16" y="0" class="term-text">${escapeXml(lang.name)}</text>
          <text x="140" y="0" class="term-muted">${lang.percentage.toFixed(1)}%</text>
        </g>
      `;
    }).join("\n");
  };

  const content = `
    <!-- Top ASCII Separator Line -->
    <text x="0" y="5" class="term-muted">┌───────────────────────────────────────────────────────────────┐</text>

    <!-- Language Percentage Progress Bar Container -->
    <g transform="translate(0, 5)">
      <rect x="0" y="18" width="${barWidth}" height="10" rx="4" fill="#21262d" />
      <g clip-path="url(#bar-clip)">
        ${barSegments}
      </g>
    </g>

    <!-- Clip Path for Rounded Progress Bar -->
    <svg:defs xmlns:svg="http://www.w3.org/2000/svg">
      <clipPath id="bar-clip">
        <rect x="0" y="23" width="${barWidth}" height="10" rx="4" />
      </clipPath>
    </svg:defs>

    <!-- 2-Column Monospace Legend Grid -->
    ${renderColumn(col1, 12)}
    ${renderColumn(col2, 240)}

    <!-- Bottom ASCII Separator Line -->
    <text x="0" y="130" class="term-muted">└───────────────────────────────────────────────────────────────┘</text>
  `;

  return renderTerminalFrame(
    {
      width: 495,
      height: 215,
      title: `${data.username}@github: ~ (zsh)`,
      command: `github-stats --card=languages`
    },
    content
  );
}
