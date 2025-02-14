import {
  Select,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { useState, type CSSProperties } from "react";
import { data, redirect } from "react-router";
import { EmptyState } from "~/components/empty-state";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { dateFormatter, decimalFormatter } from "~/lib/format";
import { getUserByLogin } from "~/lib/github.server";
import type { User } from "~/types";
import type { Route } from "./+types/search-result";

export function meta({ data, error }: Route.MetaArgs) {
  return [
    {
      title: `${error ? "Not Found" : (data.user.name ?? `@${data.user.login}`)} | DevFinder`,
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q) {
    url.searchParams.set("q", "kentcdodds");

    throw redirect(url.toString());
  }

  const user = await getUserByLogin(q);
  if (!user) {
    throw data(`No user with the login "${q}" exists.`, {
      status: 404,
    });
  }

  return { user };
}

export function ErrorBoundary() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="p-6">
        <GeneralErrorBoundary />
      </div>
    </div>
  );
}

export default function Results({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  const tabs = [
    { name: "Top Repositories", children: <UserRepositories user={user} /> },
    { name: "Profile", children: <UserProfile user={user} /> },
  ];

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <div className="space-y-8">
      <h1 className="sr-only">Search results</h1>
      <UserInfoCard user={user} />
      <TabGroup
        selectedIndex={selectedTabIndex}
        onChange={setSelectedTabIndex}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 sm:hidden">
          <Select
            value={selectedTabIndex}
            onChange={(event) =>
              setSelectedTabIndex(Number(event.target.value))
            }
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-sky-600"
            aria-label="Select a tab"
          >
            {tabs.map((tab, index) => (
              <option key={tab.name} value={index}>
                {tab.name}
              </option>
            ))}
          </Select>
          <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500" />
        </div>
        <div className="max-sm:hidden">
          <TabList as="nav" aria-label="Tabs" className="flex gap-4">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none data-focus:outline-1 data-focus:outline-white data-hover:text-gray-800 data-selected:bg-gray-200 data-selected:text-gray-800"
              >
                {tab.name}
              </Tab>
            ))}
          </TabList>
        </div>
        <TabPanels className="overflow-hidden rounded-lg bg-white shadow-sm">
          {tabs.map((tab) => (
            <TabPanel key={tab.name}>{tab.children}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}

function UserInfoCard({ user }: { user: User }) {
  const stats = {
    Repositories: user.repositories.totalCount,
    Followers: user.followers.totalCount,
    Following: user.following.totalCount,
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <h2 className="sr-only">Profile Overview</h2>
      <div className="bg-white p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="shrink-0">
              <img
                src={user.avatarUrl}
                alt=""
                className="mx-auto size-20 rounded-full"
              />
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 sm:flex">
                <p>{user.login}</p>
                {user.pronouns ? (
                  <>
                    <svg
                      viewBox="0 0 2 2"
                      className="size-0.5 fill-current"
                      aria-hidden
                    >
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p>{user.pronouns}</p>
                  </>
                ) : null}
              </div>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                {user.name ?? `@${user.login}`}
              </p>
              <p className="text-sm font-medium text-gray-600">
                Joined on{" "}
                <time dateTime={new Date(user.createdAt).toISOString()}>
                  {dateFormatter.format(new Date(user.createdAt))}
                </time>
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-center sm:mt-0">
            <a
              href={user.url}
              className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
            >
              View profile
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {Object.entries(stats).map(([label, value]) => (
          <div
            key={label}
            className="px-6 py-5 text-center text-sm font-medium"
          >
            <span className="text-gray-900">
              {decimalFormatter.format(value)}
            </span>{" "}
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserProfile({ user }: { user: User }) {
  return (
    <dl className="divide-y divide-gray-100">
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm/6 font-medium text-gray-900">Email</dt>
        <dd className="text-sm/6 text-gray-700 max-sm:mt-1 sm:col-span-2">
          {user.email?.length ? (
            <a
              href={`mailto:${user.email}`}
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              {user.email}
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm/6 font-medium text-gray-900">Location</dt>
        <dd className="text-sm/6 text-gray-700 max-sm:mt-1 sm:col-span-2">
          {user.location ?? <span className="text-gray-400">N/A</span>}
        </dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm/6 font-medium text-gray-900">Company</dt>
        <dd className="text-sm/6 text-gray-700 max-sm:mt-1 sm:col-span-2">
          {user.company ?? <span className="text-gray-400">N/A</span>}
        </dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm/6 font-medium text-gray-900">Website</dt>
        <dd className="text-sm/6 text-gray-700 max-sm:mt-1 sm:col-span-2">
          {user.websiteUrl ? (
            <a
              href={user.websiteUrl}
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              {user.websiteUrl}
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm/6 font-medium text-gray-900">Twitter</dt>
        <dd className="text-sm/6 text-gray-700 max-sm:mt-1 sm:col-span-2">
          {user.twitterUsername ? (
            <a
              href={`https://twitter.com/${user.twitterUsername}`}
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              @{user.twitterUsername}
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm/6 font-medium text-gray-900">Bio</dt>
        <dd className="text-sm/6 text-gray-700 max-sm:mt-1 sm:col-span-2">
          {user.bio ?? <span className="text-gray-400">N/A</span>}
        </dd>
      </div>
    </dl>
  );
}

function UserRepositories({ user }: { user: User }) {
  if (!user.topRepositories.nodes.length) {
    return (
      <div className="px-6 py-12">
        <EmptyState
          icon={<RectangleStackIcon />}
          title="No repositories found"
          description={`${user.login} doesn't have any public repositories yet.`}
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      <ul role="list" className="divide-y divide-gray-100">
        {user.topRepositories.nodes.map((repository) => (
          <li
            className="group relative px-4 py-5 hover:bg-gray-50 sm:px-6"
            key={repository.url}
          >
            <div className="flex items-start gap-x-3">
              <p className="text-sm/6 font-semibold text-gray-900">
                <a href={repository.url}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {repository.name}
                </a>
              </p>
              {repository.primaryLanguage ? (
                <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-md bg-white px-1.5 py-0.5 text-xs font-medium text-gray-900 ring-1 ring-gray-200 ring-inset">
                  {repository.primaryLanguage ? (
                    <svg
                      viewBox="0 0 6 6"
                      className="size-1.5 fill-(--color)"
                      style={
                        {
                          "--color": repository.primaryLanguage.color,
                        } as CSSProperties
                      }
                      aria-hidden
                    >
                      <circle cx={3} cy={3} r={3} />
                    </svg>
                  ) : null}
                  {repository.primaryLanguage.name}
                </p>
              ) : null}
            </div>
            {repository.description ? (
              <p className="mt-0.5 line-clamp-2 max-w-lg text-sm/6 text-gray-900">
                {repository.description}
              </p>
            ) : null}
            {repository.repositoryTopics.nodes?.length ? (
              <p className="mt-1 flex flex-wrap gap-1">
                {repository.repositoryTopics.nodes.map(({ topic }) => (
                  <span
                    key={topic.name}
                    className="inline-flex items-center rounded-md bg-sky-50 px-1.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-sky-700/10 ring-inset"
                  >
                    {topic.name}
                  </span>
                ))}
              </p>
            ) : null}
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
              <p className="whitespace-nowrap">
                {decimalFormatter.format(repository.stargazerCount)}{" "}
                {repository.stargazerCount === 1 ? "star" : "stars"}
              </p>
              <svg
                viewBox="0 0 2 2"
                className="size-0.5 fill-current"
                aria-hidden
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="whitespace-nowrap">
                {decimalFormatter.format(repository.forkCount)}{" "}
                {repository.forkCount === 1 ? "fork" : "forks"}
              </p>
              {repository.licenseInfo &&
              repository.licenseInfo?.name !== "Other" ? (
                <>
                  <svg
                    viewBox="0 0 2 2"
                    className="size-0.5 fill-current"
                    aria-hidden
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="truncate">{repository.licenseInfo.name}</p>
                </>
              ) : null}
              <svg
                viewBox="0 0 2 2"
                className="size-0.5 fill-current"
                aria-hidden
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="whitespace-nowrap">
                Updated on{" "}
                <time dateTime={new Date(repository.updatedAt).toISOString()}>
                  {dateFormatter.format(new Date(repository.updatedAt))}
                </time>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="group relative px-4 py-3 hover:bg-gray-50 sm:px-6">
        <a
          href={`${user.url}?tab=repositories`}
          className="inline-flex items-center gap-2 text-sm/6 font-semibold text-sky-600 group-hover:text-sky-500"
        >
          <span className="absolute inset-x-0 -top-px bottom-0" />
          View all<span className="sr-only">, repositories</span>
          <ArrowTopRightOnSquareIcon className="size-4" />
        </a>
      </div>
    </div>
  );
}
