import { RectangleStackIcon } from '@heroicons/react/24/outline'
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { CSSProperties } from 'react'
import { Empty } from '~/components/empty'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import { getUserByLogin } from '~/utils/github.server'
import type { User } from '~/utils/types'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data ? (data.user.name ?? `@${data.user.login}`) : 'Not Found',
    },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')?.trim()

  if (!q) {
    url.searchParams.set('q', 'kentcdodds')

    return redirect(url.toString())
  }

  const user = await getUserByLogin(q)
  if (!user) {
    throw new Response(`No user with the login "${q}" exists.`, {
      status: 404,
    })
  }

  return json({ user })
}

export function ErrorBoundary() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <GeneralErrorBoundary />
      </div>
    </div>
  )
}

export default function Component() {
  const { user } = useLoaderData<typeof loader>()

  const stats = {
    Repositories: user.repositories.totalCount,
    Followers: user.followers.totalCount,
    Following: user.following.totalCount,
  }

  return (
    <>
      <h1 className="sr-only">Search results</h1>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6 sm:flex sm:items-center sm:justify-between sm:gap-5">
          <img
            key={user.avatarUrl}
            src={user.avatarUrl}
            alt=""
            className="mx-auto size-20 flex-none rounded-full"
          />
          <div className="max-sm:mt-4 max-sm:text-center sm:min-w-0 sm:flex-1 sm:pt-1">
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
            <p className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
              {user.name ?? `@${user.login}`}
            </p>
            <p className="text-sm font-medium text-gray-600">
              Joined on{' '}
              <time dateTime={user.createdAt}>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}
              </time>
            </p>
          </div>
          <div className="flex justify-center max-sm:mt-5">
            <a
              href={user.url}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              View profile
            </a>
          </div>
        </div>
        <dl className="grid grid-cols-1 divide-gray-200 border-t border-gray-200 bg-gray-50 max-sm:divide-y sm:grid-cols-3 sm:divide-x">
          {Object.entries(stats).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-row-reverse justify-center gap-1 px-6 py-5 text-sm font-medium"
            >
              <dt className="text-gray-600">{label}</dt>
              <dd className="text-gray-900">
                {value.toLocaleString('en-US', { style: 'decimal' })}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-6 sm:px-6">
          <h3 className="text-base/7 font-semibold text-gray-900">Profile</h3>
        </div>
        <div className="border-t border-gray-100">
          <UserProfile user={user} />
        </div>
      </div>
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base/7 font-semibold text-gray-900">
              Top Repositories
            </h3>
            <a
              href={`${user.url}?tab=repositories`}
              className="text-sm/6 font-semibold text-gray-600 hover:text-gray-500"
            >
              View all<span className="sr-only">, repositories</span>
            </a>
          </div>
        </div>
        <div className="border-t border-gray-100">
          {user.topRepositories.nodes.length ? (
            <UserRepositories user={user} />
          ) : (
            <div className="px-6 py-12">
              <Empty
                icon={<RectangleStackIcon />}
                title="No repositories found"
                description={`${user.login} doesn't have any public repositories yet.`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function UserProfile({
  user,
}: {
  user: Pick<
    User,
    | 'login'
    | 'email'
    | 'location'
    | 'company'
    | 'websiteUrl'
    | 'twitterUsername'
    | 'bio'
  >
}) {
  return (
    <dl className="divide-y divide-gray-100">
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm/6 font-medium text-gray-900">Email</dt>
        <dd className="text-sm/6 text-gray-700 max-sm:mt-1 sm:col-span-2">
          {user.email?.length ? (
            <a
              href={`mailto:${user.email}`}
              className="font-medium text-gray-600 underline hover:text-gray-500"
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
              className="font-medium text-gray-600 underline hover:text-gray-500"
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
              className="font-medium text-gray-600 underline hover:text-gray-500"
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
  )
}

function UserRepositories({
  user,
}: {
  user: Pick<User, 'login' | 'url' | 'topRepositories'>
}) {
  return (
    <ul className="divide-y divide-gray-100">
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
              <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-md bg-white px-1.5 py-0.5 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                {repository.primaryLanguage ? (
                  <svg
                    viewBox="0 0 6 6"
                    className="size-1.5 fill-[--color]"
                    style={
                      {
                        '--color': repository.primaryLanguage.color,
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
                  className="inline-flex items-center rounded-md bg-sky-50 px-1.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-700/10"
                >
                  {topic.name}
                </span>
              ))}
            </p>
          ) : null}
          <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
            <p className="whitespace-nowrap">
              {repository.stargazerCount.toLocaleString('en-US', {
                style: 'decimal',
              })}{' '}
              {repository.stargazerCount === 1 ? 'star' : 'stars'}
            </p>
            <svg
              viewBox="0 0 2 2"
              className="size-0.5 fill-current"
              aria-hidden
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            <p className="whitespace-nowrap">
              {repository.forkCount.toLocaleString('en-US', {
                style: 'decimal',
              })}{' '}
              {repository.forkCount === 1 ? 'fork' : 'forks'}
            </p>
            {repository.licenseInfo &&
            repository.licenseInfo?.name !== 'Other' ? (
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
              Updated on{' '}
              <time dateTime={repository.updatedAt}>
                {new Date(repository.updatedAt).toLocaleDateString('en-US', {
                  dateStyle: 'medium',
                })}
              </time>
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
