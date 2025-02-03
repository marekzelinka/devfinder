export function Logo({ className }: { className?: string }) {
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
