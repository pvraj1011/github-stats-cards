import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

export interface CardConfig {
  enabled: boolean;
  title: string;
  limit?: number;
}

export interface AppConfig {
  username: string;
  token: string;
  outputDir: string;
  theme: string;
  cards: {
    header: CardConfig;
    stats: CardConfig;
    languages: CardConfig;
    streak: CardConfig;
  };
}

export function loadConfig(configPath = "./config.json"): AppConfig {
  let fileConfig: Partial<AppConfig> = {};
  
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, "utf-8");
      fileConfig = JSON.parse(raw);
    } catch (err) {
      console.warn(`[WARN] Failed to parse ${configPath}, using environment defaults.`);
    }
  }

  const username = process.env.GITHUB_USERNAME || fileConfig.username || "pvraj1011";
  const token = process.env.GITHUB_TOKEN || process.env.GH_PAT || "";
  const outputDir = process.env.OUTPUT_DIR || "./output";
  const theme = fileConfig.theme || "terminal";

  const cards = {
    header: {
      enabled: fileConfig.cards?.header?.enabled ?? true,
      title: fileConfig.cards?.header?.title || "PROFILE HEADER"
    },
    stats: {
      enabled: fileConfig.cards?.stats?.enabled ?? true,
      title: fileConfig.cards?.stats?.title || "STATISTICS"
    },
    languages: {
      enabled: fileConfig.cards?.languages?.enabled ?? true,
      title: fileConfig.cards?.languages?.title || "TOP LANGUAGES",
      limit: fileConfig.cards?.languages?.limit || 6
    },
    streak: {
      enabled: fileConfig.cards?.streak?.enabled ?? true,
      title: fileConfig.cards?.streak?.title || "STREAK TRACKER"
    }
  };

  return {
    username,
    token,
    outputDir: path.resolve(process.cwd(), outputDir),
    theme,
    cards
  };
}
