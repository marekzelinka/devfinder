import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Form, Outlet, useNavigation, useSearchParams } from "react-router";
import { useSpinDelay } from "spin-delay";

export default function SearchLayout() {
  return (
    <div className="min-h-full bg-gray-100">
      <header className="bg-gray-800 pb-24 [color-scheme:dark]">
        <div className="mx-auto max-w-3xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between py-5">
            <div className="flex items-center max-lg:px-2">
              <div className="flex-none">
                <Logo className="h-8 w-auto text-sky-500" />
              </div>
            </div>
            <div className="flex flex-1 justify-end px-2 md:ml-6">
              <search role="search" className="w-full max-w-lg md:max-w-xs">
                <SearchBar />
              </search>
            </div>
          </div>
        </div>
      </header>
      <main className="-mt-24 pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M200 0v200h-60v-69.967C139.982 168.678 108.649 200 70 200c-38.66 0-70-31.34-70-70s31.34-70 70-70c38.649 0 69.982 31.322 70 69.967V60H0V0h200Z" />
    </svg>
  );
}

function SearchBar() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const navigation = useNavigation();
  const searching = new URLSearchParams(navigation.location?.search).has("q");
  const showSpinner = useSpinDelay(searching);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search input value with the URL Search Params
  useEffect(() => {
    const searchField = inputRef.current;
    if (searchField) {
      searchField.value = q ?? "";
    }
  }, [q]);

  // Focus input on key press
  const shortcut = "/";
  useHotkeys(
    shortcut,
    () => {
      const searchField = inputRef.current;
      if (searchField) {
        searchField.focus();
        searchField.select();
      }
    },
    { preventDefault: true },
  );

  return (
    <Form>
      <div className="group grid grid-cols-1">
        <input
          ref={inputRef}
          type="search"
          name="q"
          id="q"
          defaultValue={q ?? undefined}
          className="col-start-1 row-start-1 block w-full rounded-md bg-gray-700 py-1.5 pr-10 pl-10 text-base text-white outline-hidden placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:scheme-light focus:placeholder:text-gray-400 sm:text-sm/6"
          placeholder="Search"
          aria-label="Search users"
          aria-keyshortcuts={shortcut}
        />
        <div
          className="pointer-events-none col-start-1 row-start-1 ml-3 self-center text-gray-400"
          aria-hidden
        >
          {showSpinner ? (
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
    </Form>
  );
}
