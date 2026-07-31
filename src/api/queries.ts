export const USER_STATS_QUERY = `
  query userStats($username: String!) {
    user(login: $username) {
      name
      login
      createdAt
      repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, first: 100) {
        totalCount
        nodes {
          stargazerCount
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
      }
    }
  }
`;

export const USER_LANGUAGES_QUERY = `
  query userLanguages($username: String!, $after: String) {
    user(login: $username) {
      repositories(
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
        first: 100
        after: $after
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export const USER_STREAK_QUERY = `
  query userStreak($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;
