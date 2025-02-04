import { Input } from "@headlessui/react";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Form, useNavigation, useSearchParams } from "react-router";
import { useSpinDelay } from "spin-delay";

export function SearchBar() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const navigation = useNavigation();
  const searching = new URLSearchParams(navigation.location?.search).has("q");
  const shouldShowSpinner = useSpinDelay(searching);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchField = searchInputRef.current;
    if (searchField) {
      // Sync search input value with the URL Search Params
      searchField.value = q ?? "";
    }
  }, [q]);

  // Focus input on key press
  const shortcut = "/";
  useHotkeys(
    shortcut,
    () => {
      const searchInput = searchInputRef.current;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    { preventDefault: true },
  );

  return (
    <Form>
      <div className="group grid grid-cols-1">
        <Input
          ref={searchInputRef}
          type="search"
          name="q"
          id="q"
          defaultValue={q ?? undefined}
          className="col-start-1 row-start-1 w-full rounded-md bg-gray-700 py-1.5 pr-10 pl-10 text-base text-white outline-hidden placeholder:text-gray-400 data-focus:bg-white data-focus:text-gray-900 data-focus:scheme-light data-focus:placeholder:text-gray-400 sm:text-sm/6"
          placeholder="Search"
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
    </Form>
  );
}
