import { renderTerminalFrame, escapeXml } from "../utils/svgHelpers.js";

export interface SkillItem {
  name: string;
  percentage: number;
  level: string;
  color?: string;
}

export interface SkillsData {
  username: string;
  skills: SkillItem[];
}

export function renderSkillsCard(data: SkillsData): string {
  const defaultSkills: SkillItem[] = [
    { name: "React / Next.js", percentage: 95, level: "EXPERT", color: "#39d353" },
    { name: "Node.js / Express", percentage: 90, level: "EXPERT", color: "#58a6ff" },
    { name: "AI / RAG / LLMs", percentage: 85, level: "ADVANCED", color: "#bc8cff" },
    { name: "PHP / MVC Arch", percentage: 85, level: "ADVANCED", color: "#f0883e" },
    { name: "MongoDB / MySQL", percentage: 80, level: "ADVANCED", color: "#e34c26" }
  ];

  const skills = data.skills && data.skills.length > 0 ? data.skills : defaultSkills;
  const trackWidth = 140;

  const skillRows = skills.map((skill, index) => {
    const yPos = 20 + index * 24;
    const fillWidth = Math.max((skill.percentage / 100) * trackWidth, 4);
    const color = skill.color || "#39d353";
    const accentClass = color === "#bc8cff" ? "term-accent-purple" :
                        color === "#58a6ff" ? "term-accent-cyan" :
                        color === "#f0883e" ? "term-accent-orange" :
                        color === "#e34c26" ? "term-accent-yellow" : "term-accent-green";

    return `
      <g transform="translate(0, ${yPos})">
        <text x="12" y="0" class="term-text">${escapeXml(skill.name)}</text>
        
        <!-- Progress Bar Background Track -->
        <rect x="170" y="-10" width="${trackWidth}" height="11" rx="3" fill="#21262d" />
        
        <!-- Progress Bar Fill -->
        <rect x="170" y="-10" width="${fillWidth.toFixed(1)}" height="11" rx="3" fill="${color}" />
        
        <!-- Percentage Text -->
        <text x="325" y="0" class="term-bold ${accentClass}">${skill.percentage}%</text>
        
        <!-- Level Label -->
        <text x="375" y="0" class="term-muted">${escapeXml(skill.level)}</text>
      </g>
    `;
  }).join("\n");

  const content = `
    <!-- Top ASCII Separator Line -->
    <text x="0" y="2" class="term-muted">┌───────────────────────────────────────────────────────────────┐</text>
    
    <!-- Skills Progress Grid -->
    ${skillRows}

    <!-- Bottom ASCII Separator Line -->
    <text x="0" y="132" class="term-muted">└───────────────────────────────────────────────────────────────┘</text>
  `;

  return renderTerminalFrame(
    {
      width: 495,
      height: 215,
      title: `${data.username}@terminal: ~/skills (zsh)`,
      command: `github-stats --card=skills`
    },
    content
  );
}
