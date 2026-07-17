import { Leaf, Globe } from "lucide-react";
import Link from "next/link";

type NavbarProps = {
  lang: "hi" | "en";
  setLang: (lang: "hi" | "en") => void;
};

export default function Navbar({ lang, setLang }: NavbarProps) {
  return (
    <header className="border-b border-surface-border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
            <Leaf className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">प्रतिक्रिया फॉर्म</p>
            <p className="text-xs text-ink-muted">विभाग → जिला → नगर</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Language Toggle Button */}
          <button
            onClick={() => setLang(lang === "hi" ? "en" : "hi")}
            className="flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-muted transition-all hover:bg-surface-soft hover:text-ink active:scale-[0.98]"
            title={lang === "hi" ? "Switch to English" : "हिन्दी में बदलें"}
          >
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>{lang === "hi" ? "English" : "हिन्दी"}</span>
          </button>

          {/* Admin Login - Highlighted in Green */}
          <Link
            href="/admin"
            className="rounded-xl border border-primary/20 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/25 hover:border-primary/30 active:scale-[0.98]"
          >
            एडमिन लॉगिन (Admin Login)
          </Link>
        </div>
      </div>
    </header>
  );
}
