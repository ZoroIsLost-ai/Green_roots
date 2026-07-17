export default function Navbar() {
  return (
    <header className="border-b border-surface-border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white">
          वि
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">प्रतिक्रिया फॉर्म</p>
          <p className="text-xs text-ink-muted">विभाग → जिला → नगर</p>
        </div>
      </div>
    </header>
  );
}
