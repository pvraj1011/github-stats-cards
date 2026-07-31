import { graphql } from "@octokit/graphql";

export interface GraphQLClientOptions {
  token: string;
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<T> {
  if (!token) {
    throw new Error(
      "[FATAL ERROR] GitHub PAT Token is missing! Set GITHUB_TOKEN or GH_PAT environment variable."
    );
  }

  try {
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
        "user-agent": "github-stats-cards/1.0.0"
      }
    });

    const response = await graphqlWithAuth<T>(query, variables);
    
    if (!response) {
      throw new Error("Received empty/null response from GitHub GraphQL API.");
    }

    return response;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    const errorsList = error?.errors ? JSON.stringify(error.errors, null, 2) : "";
    throw new Error(
      `[FATAL ERROR] GitHub GraphQL Query Failed:\n${errorMessage}\n${errorsList}`
    );
  }
}
