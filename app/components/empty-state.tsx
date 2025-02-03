import { type ReactNode } from "react";

export function EmptyState({
  icon,
  title = "No data",
  description,
  children,
}: {
  icon?: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center text-sm">
      {icon ? (
        <div className="mb-4 [&_svg]:size-6 [&_svg]:text-gray-400">{icon}</div>
      ) : null}
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description ? <p className="mt-2 text-gray-500">{description}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
