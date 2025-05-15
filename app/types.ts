interface Repository {
  description: string | null;
  forkCount: number;
  licenseInfo: {
    name: string;
  } | null;
  name: string;
  primaryLanguage: {
    color: string | null;
    name: string;
  } | null;
  repositoryTopics: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
  stargazerCount: number;
  updatedAt: string;
  url: string;
}

export type SearchUser = {
  nodes: Pick<User, "avatarUrl" | "login" | "name">[];
};

export interface User {
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  createdAt: string;
  email: string | null;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  location: string | null;
  login: string;
  name: string | null;
  pronouns: string | null;
  repositories: {
    totalCount: number;
  };
  topRepositories: {
    nodes: Repository[];
  };
  twitterUsername: string | null;
  url: string;
  websiteUrl: string | null;
}
