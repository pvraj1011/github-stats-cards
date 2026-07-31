import { TERMINAL_THEME, FONT_STACK, ThemeColors } from "../styles/themes.js";

export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "\'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toLocaleString("en-US");
}

export interface WindowOptions {
  width: number;
  height: number;
  title: string;
  command: string;
  theme?: ThemeColors;
}

export function renderTerminalFrame(options: WindowOptions, contentSvg: string): string {
  const theme = options.theme || TERMINAL_THEME;
  const { width, height, title, command } = options;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${escapeXml(title)}">
  <style>
    .term-bg { fill: ${theme.background}; stroke: ${theme.borderColor}; stroke-width: 1px; }
    .term-header { fill: ${theme.headerBg}; stroke: ${theme.borderColor}; stroke-width: 1px; }
    .term-title { font-family: ${FONT_STACK}; font-size: 12px; font-weight: 500; fill: ${theme.titleText}; }
    .term-prompt { font-family: ${FONT_STACK}; font-size: 13px; font-weight: 600; fill: ${theme.promptSymbol}; }
    .term-cmd { font-family: ${FONT_STACK}; font-size: 13px; font-weight: 500; fill: ${theme.commandText}; }
    .term-text { font-family: ${FONT_STACK}; font-size: 13px; fill: ${theme.foregroundText}; text-rendering: geometricPrecision; }
    .term-muted { font-family: ${FONT_STACK}; font-size: 12px; fill: ${theme.mutedText}; }
    .term-bold { font-weight: 700; }
    .term-accent-green { fill: ${theme.accentGreen}; }
    .term-accent-cyan { fill: ${theme.accentCyan}; }
    .term-accent-orange { fill: ${theme.accentOrange}; }
    .term-accent-yellow { fill: ${theme.accentYellow}; }
    .term-accent-purple { fill: ${theme.accentPurple}; }
  </style>

  <!-- Window Container -->
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="8" class="term-bg" />

  <!-- Window Header Chrome -->
  <path d="M 0.5,8.5 A 8,8 0 0,1 8.5,0.5 L ${width - 8.5},0.5 A 8,8 0 0,1 ${width - 0.5},8.5 L ${width - 0.5},34 L 0.5,34 Z" class="term-header" />
  
  <!-- Window Control Buttons -->
  <circle cx="16" cy="17" r="5.5" fill="${theme.dotRed}" />
  <circle cx="32" cy="17" r="5.5" fill="${theme.dotYellow}" />
  <circle cx="48" cy="17" r="5.5" fill="${theme.dotGreen}" />

  <!-- Window Title -->
  <text x="${width / 2}" y="21" text-anchor="middle" class="term-title">${escapeXml(title)}</text>

  <!-- Prompt Command Line -->
  <g transform="translate(18, 56)">
    <text class="term-prompt">$</text>
    <text x="14" class="term-cmd">${escapeXml(command)}</text>
  </g>

  <!-- Card Body Content -->
  <g transform="translate(18, 70)">
    ${contentSvg}
  </g>
</svg>`;
}
