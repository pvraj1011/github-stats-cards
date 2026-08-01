import { escapeXml } from "../utils/svgHelpers.js";

export interface HeaderData {
  name: string;
  role: string;
  lines?: string[];
}

export function renderHeaderCard(data?: HeaderData): string {
  const name = escapeXml(data?.name || "VRAJ PATEL");
  const role = escapeXml(data?.role || "FULL-STACK DEVELOPER & AI/ML ENGINEER");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="245" viewBox="0 0 850 245" fill="none" role="img" aria-label="${name} Hero Banner">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&amp;display=swap');

    .bg { fill: #0d1117; stroke: #30363d; stroke-width: 1.5px; }
    .header-bar { fill: #161b22; stroke: #30363d; stroke-width: 1px; }
    .title-text { font-family: 'Fira Code', ui-monospace, monospace; font-size: 13px; font-weight: 500; fill: #8b949e; }
    
    /* Animated Gradient Text */
    .hero-name {
      font-family: 'Fira Code', ui-monospace, monospace;
      font-size: 32px;
      font-weight: 700;
      fill: url(#name-gradient);
      letter-spacing: 1px;
    }

    .hero-subtitle {
      font-family: 'Fira Code', ui-monospace, monospace;
      font-size: 15px;
      font-weight: 600;
      fill: #58a6ff;
    }

    /* Typing Cursor Animation */
    .cursor {
      font-family: 'Fira Code', ui-monospace, monospace;
      font-size: 26px;
      font-weight: 700;
      fill: #39d353;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* Rotating Text Line Fades */
    .rotator-1 { animation: cycleText1 12s infinite; }
    .rotator-2 { animation: cycleText2 12s infinite; }
    .rotator-3 { animation: cycleText3 12s infinite; }

    @keyframes cycleText1 {
      0%, 30% { opacity: 1; transform: translateY(0px); }
      33%, 97% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0px); }
    }

    @keyframes cycleText2 {
      0%, 30% { opacity: 0; transform: translateY(10px); }
      33%, 63% { opacity: 1; transform: translateY(0px); }
      66%, 100% { opacity: 0; transform: translateY(-10px); }
    }

    @keyframes cycleText3 {
      0%, 63% { opacity: 0; transform: translateY(10px); }
      66%, 97% { opacity: 1; transform: translateY(0px); }
      100% { opacity: 0; transform: translateY(-10px); }
    }

    /* Matrix Binary Rain Columns */
    .matrix-stream {
      font-family: 'Fira Code', ui-monospace, monospace;
      font-size: 11px;
      fill: #39d353;
      opacity: 0.15;
      animation: matrixFall 8s linear infinite;
    }

    @keyframes matrixFall {
      0% { transform: translateY(-40px); opacity: 0.2; }
      50% { opacity: 0.08; }
      100% { transform: translateY(160px); opacity: 0; }
    }

    /* Animated Border Line */
    .glow-line {
      stroke: url(#line-gradient);
      stroke-width: 2px;
      stroke-dasharray: 200 600;
      animation: moveLine 6s linear infinite;
    }

    @keyframes moveLine {
      0% { stroke-dashoffset: 800; }
      100% { stroke-dashoffset: -800; }
    }

    /* Pulsating Status Dot */
    .pulse-dot {
      fill: #39d353;
      animation: pulse 2s infinite;
    }
    .pulse-ring {
      stroke: #39d353;
      fill: none;
      animation: ring 2s infinite;
    }

    @keyframes ring {
      0% { r: 4px; opacity: 1; stroke-width: 2px; }
      100% { r: 14px; opacity: 0; stroke-width: 0.5px; }
    }

    .term-code { font-family: 'Fira Code', ui-monospace, monospace; font-size: 13px; fill: #c9d1d9; }
    .term-muted { font-family: 'Fira Code', ui-monospace, monospace; font-size: 12px; fill: #8b949e; }
    .term-green { fill: #39d353; font-weight: 600; }
    .term-cyan { fill: #58a6ff; font-weight: 600; }
    .term-orange { fill: #f0883e; font-weight: 600; }
    .term-purple { fill: #bc8cff; font-weight: 600; }
  </style>

  <defs>
    <!-- Vibrant Name Gradient -->
    <linearGradient id="name-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#58a6ff" />
      <stop offset="50%" stop-color="#bc8cff" />
      <stop offset="100%" stop-color="#39d353" />
    </linearGradient>

    <!-- Animated Glow Border Gradient -->
    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#58a6ff" stop-opacity="0.1" />
      <stop offset="50%" stop-color="#39d353" stop-opacity="1" />
      <stop offset="100%" stop-color="#bc8cff" stop-opacity="0.1" />
    </linearGradient>
  </defs>

  <!-- Container Frame -->
  <rect x="1" y="1" width="848" height="243" rx="10" class="bg" />

  <!-- Top Header Window Bar -->
  <path d="M 1,10 A 10,10 0 0,1 11,1 L 839,1 A 10,10 0 0,1 849,10 L 849,36 L 1,36 Z" class="header-bar" />
  
  <!-- Window Controls -->
  <circle cx="18" cy="18" r="5.5" fill="#ff5f56" />
  <circle cx="36" cy="18" r="5.5" fill="#ffbd2e" />
  <circle cx="54" cy="18" r="5.5" fill="#27c93f" />

  <!-- Window Header Title -->
  <text x="425" y="22" text-anchor="middle" class="title-text">pvraj1011@terminal: ~/hero (zsh)</text>

  <!-- Animated Glowing Top Border Accent Line -->
  <line x1="1" y1="36" x2="849" y2="36" class="glow-line" />

  <!-- Matrix Background Stream Columns -->
  <g class="matrix-stream">
    <text x="760" y="50">01011</text>
    <text x="785" y="70">10100</text>
    <text x="810" y="45">11010</text>
  </g>

  <!-- Main Hero Content -->
  <g transform="translate(30, 75)">
    <!-- Command Prompt -->
    <text x="0" y="0" class="hero-subtitle">&gt; $ ./init_profile.sh --hero --matrix</text>
    
    <!-- Big Animated Name Header -->
    <g transform="translate(0, 38)">
      <text x="0" y="0" class="hero-name">${name}</text>
      <text x="210" y="-3" class="cursor">▋</text>
    </g>

    <!-- Subtitle / Role -->
    <text x="0" y="62" class="term-code" font-size="14">${role}</text>

    <!-- Rotating Dynamic Skill / Focus Banner Lines -->
    <g transform="translate(0, 95)">
      <!-- Line 1 -->
      <g class="rotator-1">
        <text x="0" y="0" class="term-code">⚡ <tspan class="term-orange">Building:</tspan> Suched Billing System (SBS V2) @ CSD InfoSolution</text>
      </g>
      <!-- Line 2 -->
      <g class="rotator-2">
        <text x="0" y="0" class="term-code">🧠 <tspan class="term-purple">Specializing:</tspan> LangChain • RAG Pipelines • LLM Agent Workflows</text>
      </g>
      <!-- Line 3 -->
      <g class="rotator-3">
        <text x="0" y="0" class="term-code">🚀 <tspan class="term-cyan">Stack:</tspan> React / Next.js • Node.js • PHP MVC • Python • MongoDB</text>
      </g>
    </g>

    <!-- Status Badge (Right Side) -->
    <g transform="translate(570, 20)">
      <rect x="0" y="0" width="220" height="95" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1" />
      
      <!-- Pulsating Green Status Dot -->
      <g transform="translate(24, 28)">
        <circle cx="0" cy="0" r="4" class="pulse-ring" />
        <circle cx="0" cy="0" r="4" class="pulse-dot" />
        <text x="16" y="4" class="term-green" font-size="12">ACTIVE DEVELOPER</text>
      </g>

      <text x="24" y="54" class="term-muted" font-size="11">LOCATION : Ahmedabad, IN</text>
      <text x="24" y="74" class="term-cyan" font-size="11">STATUS   : Open to Work</text>
    </g>
  </g>
</svg>`;
}
