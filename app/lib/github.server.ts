import { GraphqlResponseError, graphql } from "@octokit/graphql";
import invariant from "tiny-invariant";
import type { SearchUser, User } from "~/types";

invariant(process.env.GITHUB_API_TOKEN, "Missing GITHUB_API_TOKEN env var");

const client = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_API_TOKEN}`,
  },
});

const GET_USER_QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      avatarUrl
      bio
      company
      createdAt
      email
      followers {
        totalCount
      }
      following {
        totalCount
      }
      location
      login
      name
      pronouns
      repositories {
        totalCount
      }
      topRepositories: repositories(
        affiliations: OWNER
        first: 10
        isArchived: false
        isFork: false
        isLocked: false
        orderBy: { direction: DESC, field: STARGAZERS }
        ownerAffiliations: OWNER
        privacy: PUBLIC
      ) {
        nodes {
          description
          forkCount
          licenseInfo {
            name
          }
          name
          primaryLanguage {
            color
            name
          }
          repositoryTopics(first: 6) {
            nodes {
              topic {
                name
              }
            }
          }
          stargazerCount
          updatedAt
          url
        }
      }
      twitterUsername
      url
      websiteUrl
    }
  }
`;

export async function getUserByLogin(login: string) {
  try {
    const data = await client<{ user: User }>(GET_USER_QUERY, { login });

    return data.user;
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      const notFoundError = error.errors?.find(
        (error) => error.type === "NOT_FOUND",
      );
      if (notFoundError) {
        return null;
      }

      throw new Error(error.errors?.[0].message);
    }

    throw error;
  }
}

const GET_SEARCH_USER_QUERY = /* GraphQL */ `
  query ($searchQuery: String!) {
    search(query: $searchQuery, type: USER, first: 5) {
      nodes {
        ... on User {
          avatarUrl
          login
          name
        }
      }
    }
  }
`;

export async function getUsersByQuery(query: string) {
  try {
    const data = await client<{ search: SearchUser }>(GET_SEARCH_USER_QUERY, {
      searchQuery: query,
    });

    return data.search.nodes.filter((node) => node.login);
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      throw new Error(error.errors?.[0].message);
    }

    throw error;
  }
}
