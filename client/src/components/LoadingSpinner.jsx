export function LoadingSpinner({ fullScreen = false, label = "Loading..." }) {
  return (
    <div className={`${fullScreen ? "flex min-h-screen" : "flex min-h-[260px]"} items-center justify-center`}>
      <div className="panel flex flex-col items-center gap-4 px-8 py-10 text-center">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-500">Please wait while we prepare your workspace.</p>
        </div>
      </div>
    </div>
  );
}
