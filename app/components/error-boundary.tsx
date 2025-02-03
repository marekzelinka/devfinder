import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function GeneralErrorBoundary() {
  const error = useRouteError();
  const errorMessage = isRouteErrorResponse(error)
    ? error.data
    : getErrorMessage(error);

  return (
    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
        <ExclamationTriangleIcon className="size-6 text-red-600" />
      </div>
      <h3 className="mt-3 text-base/6 font-semibold text-gray-900">
        Oops! An error occurred…
      </h3>
      <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  const fallbackMessage = "Unknown Error";

  if (typeof error === "string") {
    return error;
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message || fallbackMessage;
  }

  console.error("Unable to get error message for error", error);

  return fallbackMessage;
}
