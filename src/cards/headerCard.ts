import { renderTerminalFrame, escapeXml } from "../utils/svgHelpers.js";

export interface HeaderData {
  name: string;
  role: string;
  location: string;
  degree: string;
  currentCompany: string;
  currentProject: string;
  focus: string;
}

export function renderHeaderCard(data: HeaderData): string {
  const content = `
    <!-- Top ASCII Separator -->
    <text x="0" y="5" class="term-muted">┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐</text>

    <!-- Header Banner Title -->
    <g transform="translate(14, 28)">
      <text x="0" y="0" class="term-accent-green term-bold" font-size="20">${escapeXml(data.name.toUpperCase())}</text>
      <text x="160" y="0" class="term-accent-cyan term-bold" font-size="13">/* ${escapeXml(data.role)} */</text>
    </g>

    <!-- Status Line -->
    <g transform="translate(14, 52)">
      <text x="0" y="0" class="term-text">ROLE        :</text>
      <text x="110" y="0" class="term-accent-yellow term-bold">Full-Stack Developer @ ${escapeXml(data.currentCompany)}</text>
      
      <text x="510" y="0" class="term-text">LOCATION :</text>
      <text x="610" y="0" class="term-accent-cyan">${escapeXml(data.location)}</text>
    </g>

    <g transform="translate(14, 76)">
      <text x="0" y="0" class="term-text">BUILDING    :</text>
      <text x="110" y="0" class="term-accent-green">${escapeXml(data.currentProject)}</text>

      <text x="510" y="0" class="term-text">DEGREE   :</text>
      <text x="610" y="0" class="term-foregroundText">${escapeXml(data.degree)}</text>
    </g>

    <g transform="translate(14, 100)">
      <text x="0" y="0" class="term-text">DEEPENING   :</text>
      <text x="110" y="0" class="term-accent-purple">${escapeXml(data.focus)}</text>

      <text x="510" y="0" class="term-text">STATUS   :</text>
      <text x="610" y="0" class="term-accent-green term-bold">[● OPEN TO OPPORTUNITIES]</text>
    </g>

    <!-- Bottom ASCII Separator -->
    <text x="0" y="122" class="term-muted">└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘</text>
  `;

  return renderTerminalFrame(
    {
      width: 840,
      height: 205,
      title: `pvraj1011@developer: ~/profile (zsh)`,
      command: `whoami && cat ~/bio.config`
    },
    content
  );
}
