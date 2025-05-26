import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
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

const people = [
  { id: 1, name: "Leslie Alexander", url: "#" },
  // More people...
];

export function UserCombobox() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const userFetcher = useFetcher<typeof loader>();
  const users = userFetcher.data?.users ?? [];
  type User = (typeof users)[number];
  const isSearching = userFetcher.state !== "idle";
  const shouldShowSpinner = useSpinDelay(isSearching, {
    delay: 150,
    minDuration: 500,
  });

  const navigate = useNavigate();

  // Open modal on key press
  const shortcut = { display: "Ctrl+k", actual: "mod+k" };
  useHotkeys(
    shortcut.actual,
    () => {
      setIsOpen(true);
    },
    { preventDefault: true, enabled: !isOpen },
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex w-full items-center gap-x-3 rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-white/10 hover:outline-white/20 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-500 sm:text-sm/6"
      >
        <MagnifyingGlassIcon className="size-5 sm:size-4" />
        <span className="flex-auto text-left">Search users by login…</span>
        <kbd className="flex items-center rounded-sm border border-white/5 px-1 font-sans text-xs">
          {shortcut.display}
        </kbd>
      </button>
      <Dialog
        className="relative z-10"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setQuery("");
        }}
        aria-keyshortcuts={shortcut.actual}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <DialogPanel
            transition
            className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          >
            <Combobox<User>
              onChange={(user) => {
                if (user) {
                  const searchParams = new URLSearchParams([
                    ["login", user.login],
                  ]);
                  navigate(`${href("/")}?${searchParams}`);
                }
              }}
            >
              <div className="grid grid-cols-1">
                <ComboboxInput
                  autoFocus
                  className="col-start-1 row-start-1 h-12 w-full pr-4 pl-11 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm"
                  placeholder="Search users by login…"
                  onChange={(event) => {
                    const query = event.target.value ?? "";
                    userFetcher.submit(
                      { query },
                      { method: "GET", action: "/resources/users" },
                    );
                    setQuery(query);
                  }}
                  onBlur={() => setIsOpen(false)}
                />
                <div className="pointer-events-none col-start-1 row-start-1 ml-4 self-center text-gray-400">
                  {shouldShowSpinner ? (
                    <ArrowPathIcon className="size-5 animate-spin" />
                  ) : (
                    <MagnifyingGlassIcon className="size-5" />
                  )}
                </div>
              </div>
              {users.length > 0 && (
                <ComboboxOptions
                  static
                  className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                >
                  {users.map((user) => (
                    <ComboboxOption
                      key={user.login}
                      value={user}
                      className="group flex cursor-default items-center px-4 py-2 select-none data-focus:bg-sky-600 data-focus:text-white data-focus:outline-hidden"
                    >
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="size-6 flex-none rounded-full"
                      />
                      <span className="ml-3 truncate">
                        {user.name || `@${user.login}`}
                      </span>
                      {user.name ? (
                        <span className="ml-2 truncate text-gray-500 group-data-focus:text-sky-200">
                          @{user.login}
                        </span>
                      ) : null}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              )}
              {query !== "" && users.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No people found.</p>
              ) : null}
            </Combobox>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
