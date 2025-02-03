import { Outlet } from "react-router";
import { Logo } from "~/components/logo";
import { SearchBar } from "~/components/search-bar";

export default function SearchLayout() {
  return (
    <div className="min-h-full">
      <header className="bg-gray-800 pb-24 [color-scheme:dark]">
        <div className="mx-auto max-w-3xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between py-5">
            <div className="flex items-center max-lg:px-2">
              <div className="flex flex-none items-center gap-3">
                <Logo className="h-6 w-auto text-sky-500" />
                <span className="text-base font-medium text-white max-md:hidden">
                  DevFinder
                </span>
              </div>
            </div>
            <div className="flex flex-1 justify-end px-2 md:ml-6">
              <search role="search" className="w-full md:max-w-xs">
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
