import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { href, useFetcher, useNavigate } from "react-router";
import { useSpinDelay } from "spin-delay";
import invariant from "tiny-invariant";
import { getUsersByQuery } from "~/lib/github.server";
import type { Route } from "./+types/users";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  invariant(typeof query === "string", "query is required");

  const users = await getUsersByQuery(query);

  return {
    users,
  };
}

export function UserCombobox() {
  const userFetcher = useFetcher<typeof loader>();
  const users = userFetcher.data?.users ?? [];
  type User = (typeof users)[number];
  const [selectedUser, setSelectedUser] = useState<null | undefined | User>(
    null,
  );
  const navigate = useNavigate();

  const isSearching = userFetcher.state !== "idle";
  const shouldShowSpinner = useSpinDelay(isSearching, {
    delay: 150,
    minDuration: 500,
  });
  const shouldDisplayMenu = users.length > 0;

  const comboboxInputRef = useRef<HTMLInputElement>(null);
  // Focus input on key press
  const shortcut = "ctrl+k";
  useHotkeys(
    shortcut,
    () => {
      const searchInput = comboboxInputRef.current;

      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    { preventDefault: true },
  );

  return (
    <Combobox
      as="div"
      value={selectedUser}
      onChange={(user) => {
        setSelectedUser(user);

        if (user) {
          const searchParams = new URLSearchParams([["login", user.login]]);
          navigate(`${href("/")}?${searchParams}`);
        }
      }}
      className="relative"
    >
      <div className="group grid grid-cols-1">
        <ComboboxInput<typeof selectedUser>
          ref={comboboxInputRef}
          displayValue={(user) => user?.login || ""}
          onChange={(event) => {
            userFetcher.submit(
              { query: event.target.value ?? "" },
              { method: "GET", action: "/resources/users" },
            );
          }}
          className="col-start-1 row-start-1 block w-full rounded-md bg-gray-700 py-1.5 pr-10 pl-10 text-base text-white outline-hidden placeholder:text-gray-400 data-focus:bg-white data-focus:text-gray-900 data-focus:scheme-light data-focus:placeholder:text-gray-400 sm:text-sm/6"
          aria-label="Search users"
          aria-keyshortcuts={shortcut}
        />
        <div
          className="pointer-events-none col-start-1 row-start-1 ml-3 self-center text-gray-400"
          aria-hidden
        >
          {shouldShowSpinner ? (
            <ArrowPathIcon className="size-5 animate-spin sm:size-4" />
          ) : (
            <MagnifyingGlassIcon className="size-5 sm:size-4" />
          )}
        </div>
        <div
          className="pointer-events-none col-start-1 row-start-1 mr-3 self-center justify-self-end"
          aria-hidden
        >
          <kbd className="flex items-center rounded-sm border border-gray-600 px-1 font-sans text-xs text-gray-400 group-focus-within:border-gray-200">
            {shortcut}
          </kbd>
        </div>
      </div>
      <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 empty:invisible focus:outline-hidden sm:text-sm">
        {shouldDisplayMenu
          ? users.map((user) => (
              <ComboboxOption
                key={user.login}
                value={user}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-sky-600 data-focus:text-white data-focus:outline-hidden"
              >
                <div className="flex">
                  <span className="truncate group-data-selected:font-semibold">
                    {user.name || `@${user.login}`}
                  </span>
                  {user.name ? (
                    <span className="ml-2 truncate text-gray-500 group-data-focus:text-sky-200">
                      @{user.login}
                    </span>
                  ) : null}
                </div>
              </ComboboxOption>
            ))
          : null}
      </ComboboxOptions>
    </Combobox>
  );
}
