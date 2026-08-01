import fs from "node:fs";
import path from "node:path";
import * as core from "@actions/core";
import { loadConfig } from "./config.js";
import { renderHeaderCard, HeaderData } from "./cards/headerCard.js";
import { fetchStatsData, renderStatsCard, StatsData } from "./cards/statsCard.js";
import { fetchLanguagesData, renderLanguagesCard, LanguagesData } from "./cards/languagesCard.js";
import { fetchStreakData, renderStreakCard, StreakData } from "./cards/streakCard.js";
import { renderSkillsCard, SkillsData } from "./cards/skillsCard.js";
import { fetchSpotlightData, renderSpotlightCard, SpotlightData } from "./cards/spotlightCard.js";

async function run(): Promise<void> {
  try {
    const config = loadConfig();
    const isMock = process.argv.includes("--mock") || (!config.token && !process.env.GITHUB_ACTIONS);

    console.log(`[INFO] Initializing Custom GitHub Stats Cards Generator`);
    console.log(`[INFO] Target Username: ${config.username}`);
    console.log(`[INFO] Output Directory: ${config.outputDir}`);
    console.log(`[INFO] Execution Mode: ${isMock ? "MOCK DATA (Local Test)" : "LIVE GRAPHQL API"}`);

    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    // -------------------------------------------------------------------------
    // CARD 0: Animated Hero Header Banner Card
    // -------------------------------------------------------------------------
    if (config.cards.header.enabled) {
      console.log(`[CARD 0] Generating Animated Profile Header Card...`);
      const headerData: HeaderData = {
        name: "VRAJ PATEL",
        role: "FULL-STACK DEVELOPER & AI/ML ENGINEER"
      };

      const headerSvg = renderHeaderCard(headerData);
      const headerPath = path.join(config.outputDir, "header.svg");
      fs.writeFileSync(headerPath, headerSvg, "utf-8");
      console.log(`[SUCCESS] Wrote Animated Header Card SVG to ${headerPath}`);
    }

    // -------------------------------------------------------------------------
    // CARD 1: Stats Card
    // -------------------------------------------------------------------------
    if (config.cards.stats.enabled) {
      console.log(`[CARD 1] Generating Stats Card...`);
      let statsData: StatsData;

      if (isMock) {
        statsData = {
          username: config.username,
          name: "Vraj Patel",
          totalStars: 142,
          totalCommits: 1280,
          totalPRs: 85,
          totalIssues: 34,
          totalContributions: 1399,
          publicRepos: 28
        };
      } else {
        statsData = await fetchStatsData(config.username, config.token);
      }

      const statsSvg = renderStatsCard(statsData);
      const statsPath = path.join(config.outputDir, "stats.svg");
      fs.writeFileSync(statsPath, statsSvg, "utf-8");
      console.log(`[SUCCESS] Wrote Stats Card SVG to ${statsPath}`);
    }

    // -------------------------------------------------------------------------
    // CARD 2: Top Languages Card
    // -------------------------------------------------------------------------
    if (config.cards.languages.enabled) {
      console.log(`[CARD 2] Generating Top Languages Card...`);
      let languagesData: LanguagesData;

      if (isMock) {
        languagesData = {
          username: config.username,
          totalBytes: 524000,
          languages: [
            { name: "TypeScript", color: "#3178c6", size: 242000, percentage: 46.2 },
            { name: "JavaScript", color: "#f1e05a", size: 147000, percentage: 28.0 },
            { name: "Python", color: "#3572A5", size: 68000, percentage: 13.0 },
            { name: "HTML", color: "#e34c26", size: 35000, percentage: 6.7 },
            { name: "CSS", color: "#563d7c", size: 21000, percentage: 4.0 },
            { name: "PHP", color: "#4F5D95", size: 11000, percentage: 2.1 }
          ]
        };
      } else {
        languagesData = await fetchLanguagesData(
          config.username,
          config.token,
          config.cards.languages.limit
        );
      }

      const languagesSvg = renderLanguagesCard(languagesData);
      const languagesPath = path.join(config.outputDir, "languages.svg");
      fs.writeFileSync(languagesPath, languagesSvg, "utf-8");
      console.log(`[SUCCESS] Wrote Top Languages Card SVG to ${languagesPath}`);
    }

    // -------------------------------------------------------------------------
    // CARD 3: Streak Tracker Card
    // -------------------------------------------------------------------------
    if (config.cards.streak.enabled) {
      console.log(`[CARD 3] Generating Streak Tracker Card...`);
      let streakData: StreakData;

      if (isMock) {
        streakData = {
          username: config.username,
          totalContributions: 1399,
          firstContributionDate: "Aug 01",
          lastContributionDate: "Jul 31",
          currentStreak: 18,
          currentStreakStart: "Jul 14",
          currentStreakEnd: "Jul 31",
          longestStreak: 42,
          longestStreakStart: "Apr 01",
          longestStreakEnd: "May 12"
        };
      } else {
        streakData = await fetchStreakData(config.username, config.token);
      }

      const streakSvg = renderStreakCard(streakData);
      const streakPath = path.join(config.outputDir, "streak.svg");
      fs.writeFileSync(streakPath, streakSvg, "utf-8");
      console.log(`[SUCCESS] Wrote Streak Card SVG to ${streakPath}`);
    }

    // -------------------------------------------------------------------------
    // CARD 4: Skill Mastery Matrix Card
    // -------------------------------------------------------------------------
    if (config.cards.skills.enabled) {
      console.log(`[CARD 4] Generating Skill Mastery Matrix Card...`);
      const skillsData: SkillsData = {
        username: config.username,
        skills: [
          { name: "React / Next.js", percentage: 95, level: "EXPERT", color: "#39d353" },
          { name: "Node.js / Express", percentage: 90, level: "EXPERT", color: "#58a6ff" },
          { name: "AI / RAG / LLM APIs", percentage: 85, level: "ADVANCED", color: "#bc8cff" },
          { name: "PHP / MVC Architecture", percentage: 85, level: "ADVANCED", color: "#f0883e" },
          { name: "MongoDB / MySQL", percentage: 80, level: "ADVANCED", color: "#e34c26" }
        ]
      };

      const skillsSvg = renderSkillsCard(skillsData);
      const skillsPath = path.join(config.outputDir, "skills.svg");
      fs.writeFileSync(skillsPath, skillsSvg, "utf-8");
      console.log(`[SUCCESS] Wrote Skill Mastery Matrix Card SVG to ${skillsPath}`);
    }

    // -------------------------------------------------------------------------
    // CARD 5: Live Project Spotlight Card
    // -------------------------------------------------------------------------
    if (config.cards.spotlight.enabled) {
      console.log(`[CARD 5] Generating Live Project Spotlight Card...`);
      let spotlightData: SpotlightData;

      if (isMock) {
        spotlightData = {
          username: config.username,
          repoName: "Suched Billing System (SBS V2)",
          description: "Modular multi-tenant SaaS billing platform with 3FA auth & Schema Synchronizer CLI",
          primaryLanguage: "PHP / TypeScript",
          languageColor: "#4F5D95",
          stargazerCount: 14,
          forkCount: 3,
          pushedAt: new Date().toISOString().split("T")[0],
          status: "PRODUCTION"
        };
      } else {
        spotlightData = await fetchSpotlightData(config.username, "github-stats-cards", config.token);
      }

      const spotlightSvg = renderSpotlightCard(spotlightData);
      const spotlightPath = path.join(config.outputDir, "spotlight.svg");
      fs.writeFileSync(spotlightPath, spotlightSvg, "utf-8");
      console.log(`[SUCCESS] Wrote Live Project Spotlight Card SVG to ${spotlightPath}`);
    }

    console.log(`[SUCCESS] All enabled cards generated successfully.`);
  } catch (error: any) {
    const message = error?.message || String(error);
    console.error(`[ERROR] ${message}`);
    core.setFailed(message);
    process.exit(1);
  }
}

run();
