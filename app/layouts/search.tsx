import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
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
      <div className="group relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          aria-hidden
        >
          {showSpinner ? (
            <ArrowPathIcon className="size-5 animate-spin text-gray-400" />
          ) : (
            <MagnifyingGlassIcon className="size-5 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="search"
          name="q"
          id="q"
          defaultValue={q ?? undefined}
          className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-8 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 focus:[color-scheme:light] sm:text-sm/6"
          placeholder="Search"
          aria-label="Search users"
          aria-keyshortcuts={shortcut}
        />
        <div
          className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5"
          aria-hidden
        >
          <kbd className="inline-flex items-center rounded border border-gray-600 px-1 font-sans text-xs text-gray-400 group-focus-within:border-gray-200">
            {shortcut}
          </kbd>
        </div>
      </div>
    </Form>
  );
}
