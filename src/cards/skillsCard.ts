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
  const barLength = 20; // Number of characters in progress bar

  const defaultSkills: SkillItem[] = [
    { name: "React / Next.js", percentage: 95, level: "EXPERT", color: "#39d353" },
    { name: "Node.js / Express", percentage: 90, level: "EXPERT", color: "#58a6ff" },
    { name: "AI / RAG / LLM APIs", percentage: 85, level: "ADVANCED", color: "#bc8cff" },
    { name: "PHP / MVC Architecture", percentage: 85, level: "ADVANCED", color: "#f0883e" },
    { name: "MongoDB / MySQL", percentage: 80, level: "ADVANCED", color: "#e34c26" }
  ];

  const skills = data.skills && data.skills.length > 0 ? data.skills : defaultSkills;

  const skillRows = skills.map((skill, index) => {
    const yPos = 20 + index * 24;
    const filledBlocks = Math.round((skill.percentage / 100) * barLength);
    const emptyBlocks = barLength - filledBlocks;
    
    const barStr = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
    const accentClass = skill.color === "#bc8cff" ? "term-accent-purple" :
                        skill.color === "#58a6ff" ? "term-accent-cyan" :
                        skill.color === "#f0883e" ? "term-accent-orange" :
                        skill.color === "#e34c26" ? "term-accent-yellow" : "term-accent-green";

    return `
      <g transform="translate(0, ${yPos})">
        <text x="12" y="0" class="term-text">${escapeXml(skill.name.padEnd(21, " "))}</text>
        <text x="175" y="0" class="${accentClass}">${barStr}</text>
        <text x="355" y="0" class="term-bold ${accentClass}">${skill.percentage}%</text>
        <text x="395" y="0" class="term-muted">${escapeXml(skill.level)}</text>
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
