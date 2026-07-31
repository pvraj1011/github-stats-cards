# ⚡ Custom GitHub Stats Cards & Contribution Snake

> **Zero-runtime-API, ultra-reliable static SVG stats cards & Contribution Snake animation for your GitHub Profile README.**
> Automatically generated daily via GitHub Actions and committed to a dedicated `output` branch — avoiding third-party view-time rate-limit failures forever.

---

## 🎨 Visual Preview (Retro Terminal Theme)

All cards feature a clean, high-contrast Retro Terminal CLI aesthetic (`● ● ● bash`) designed for maximum legibility in both dark and light profile READMEs.

### 1. Stats Card (`stats.svg`)
```
┌───────────────────────────────────────────────────────────────┐
│ ● ● ● pvraj1011@github: ~ (zsh)                               │
│ $ github-stats --card=stats                                   │
│ ┌───────────────────────────────┬───────────────────────────┐ │
│ │ STARS        : 142            │ COMMITS      : 1.3k       │ │
│ │ PULL REQUESTS: 85             │ ISSUES       : 34         │ │
│ │ PUBLIC REPOS : 28             │ CONTRIBUTIONS: 1.4k       │ │
│ └───────────────────────────────┴───────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### 2. Top Languages Card (`languages.svg`)
Includes multi-color language usage bar and clean 2-column legend breakdown:
```
┌───────────────────────────────────────────────────────────────┐
│ ● ● ● pvraj1011@github: ~ (zsh)                               │
│ $ github-stats --card=languages                               │
│ [███████████████████████████████████████████████████████████] │
│ ● TypeScript   46.2%    ● HTML         6.7%                   │
│ ● JavaScript   28.0%    ● CSS          4.0%                   │
│ ● Python       13.0%    ● PHP          2.1%                   │
└───────────────────────────────────────────────────────────────┘
```

### 3. Streak Tracker Card (`streak.svg`)
Displays contribution streaks with start/end date ranges:
```
┌───────────────────────────────────────────────────────────────┐
│ ● ● ● pvraj1011@github: ~ (zsh)                               │
│ $ github-stats --card=streak                                  │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐     │
│ │ TOTAL CONTRIBS │ │ CURRENT STREAK │ │ LONGEST STREAK │     │
│ │ 1.4k           │ │ 18 DAYS        │ │ 42 DAYS        │     │
│ │ Aug 01 - Jul 31│ │ Jul 14 - Jul 31│ │ Apr 01 - May 12│     │
│ └────────────────┘ └────────────────┘ └────────────────┘     │
└───────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Why Zero-Runtime-API Architecture?

Third-party card generators render SVGs live on every profile view by querying the GitHub API on demand. When shared public instances hit GitHub rate limits, card rendering breaks across thousands of profile READMEs.

**This project solves it architecturally:**
1. A **GitHub Actions** workflow runs on a daily schedule (`cron`) and via manual trigger (`workflow_dispatch`).
2. It queries GitHub's **GraphQL API** *once* per run using a Personal Access Token stored safely in repository secrets.
3. It renders static SVG files and commits them to an isolated `output` branch.
4. Your Profile README embeds static raw file URLs. **Zero live API calls at view-time.**

---

## 🚀 Quickstart & Setup (Fork & Run in 3 Minutes)

### Step 1: Fork this repository
Click **Fork** at the top right of this repository to create your own copy under your GitHub account.

### Step 2: Create a Personal Access Token (PAT)
1. Go to **GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)** (or Fine-Grained Tokens).
2. Generate a new token with:
   - **Classic PAT**: `read:user` scope (and public repository access).
   - **Fine-Grained PAT**: Read access for public repositories & user profile data.
3. Copy your newly generated token.

> 🔒 **Privacy Guarantee**: This action strictly queries public repository data and public contribution calendars. No private repository names, code, or commits are ever fetched or exposed.

### Step 3: Add repository secret
1. In your forked repository, go to **Settings → Secrets and variables → Actions**.
2. Click **New repository secret**.
3. Name: `GH_PAT`
4. Value: Paste your token copied from Step 2.

### Step 4: Trigger the workflow
1. Go to the **Actions** tab in your repository.
2. Select **Generate GitHub Stats Cards**.
3. Click **Run workflow → Run workflow**.
4. Once completed, a new orphan branch named `output` will be created containing your generated `.svg` files!

---

## 📌 Embedding in your Profile README

Copy and paste the following HTML into your `README.md` (replace `<YOUR_GITHUB_USERNAME>` with your username):

```html
<p align="center">
  <img src="https://raw.githubusercontent.com/<YOUR_GITHUB_USERNAME>/github-stats-cards/output/stats.svg" width="49%" alt="GitHub Stats" />
  <img src="https://raw.githubusercontent.com/<YOUR_GITHUB_USERNAME>/github-stats-cards/output/languages.svg" width="49%" alt="Top Languages" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/<YOUR_GITHUB_USERNAME>/github-stats-cards/output/streak.svg" width="100%" alt="Streak Tracker" />
</p>
```

---

## ⚙️ Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/pvraj1011/github-stats-cards.git
cd github-stats-cards

# Install dependencies
npm install

# Copy environment template for local testing
cp .env.example .env
# Edit .env and set your GITHUB_TOKEN and GITHUB_USERNAME

# Build and generate local SVGs
npm run dev
```

Generated `.svg` files will be written to `./output/` for inspection.

---

## 📜 License
[MIT](LICENSE) © Vraj Patel (`pvraj1011`)