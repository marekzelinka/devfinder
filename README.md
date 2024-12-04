# GitHub User Search

This project is a simple search app for GitHub users. It's written in [TypeScript](https://www.typescriptlang.org/) and uses [React](https://react.dev/), [React Router](https://reactrouter.com/) and [Tailwind CSS](https://tailwindcss.com/). I've deployed it on [Fly.io](https://fly.io/).

## Get started

1. Clone the repository:

   ```sh
   git clone https://github.com/marekzelinka/github-user-search.git
   ```

2. Install the dependencies:

   ```sh
   pnpm i
   ```

3. Define required env variables:

   - Create a new [GitHub access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
   - Copy the template contents in [.env.example](.env.example) to a new file named `.env` and fill all the required fields.

4. Run the application in dev mode:

   ```sh
   pnpm dev
   ```

## Goals

Practice working with Remix [data loadings APIs](https://remix.run/docs/en/main/guides/data-loading) and using third-party APIs, like [GitHub GraphQL API](https://docs.github.com/en/graphql).

## Credits

- Challenge by [Frontend Mentor](https://www.frontendmentor.io/challenges/github-user-search-app-Q09YOgaH6)
