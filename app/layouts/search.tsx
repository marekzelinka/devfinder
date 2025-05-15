import { Outlet } from "react-router";
import { Logo } from "~/components/logo";
import { UserCombobox } from "~/resources/users";

export default function SearchLayout() {
  return (
    <div className="min-h-full bg-gray-50">
      <header className="bg-gray-800 pb-24 scheme-dark">
        <div className="mx-auto max-w-3xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between py-5">
            <div className="flex items-center max-lg:px-2">
              <div className="flex-none">
                <Logo className="h-6 w-auto text-sky-500" />
              </div>
            </div>
            <div className="flex flex-1 justify-end px-2 md:ml-6">
              <UserCombobox />
              {/* <search role="search" className="w-full md:max-w-xs">
                <SearchBar />
              </search> */}
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
