import Link from "next/link";
import { Zap, Globe, X } from "lucide-react";
import { APP_NAME, APP_VERSION } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Platform: [
    { label: "Fan Hub", href: "/dashboard" },
    { label: "Onboarding", href: "/onboarding" },
    { label: "Admin", href: "/admin/login" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="flex flex-col items-center text-center gap-12 py-12 md:flex-row md:justify-center md:gap-32 md:text-left">
          {/* Brand column */}
          <div className="flex flex-col items-center md:items-start max-w-sm">
            <Link href="/" className="flex items-center gap-2" id="footer-logo">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-amber)]">
                <Zap className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-display text-base font-bold tracking-widest text-[var(--text-primary)]">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
              The intelligent stadium fan engagement platform. Powered by AI.
              Built for matchday.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                id="footer-github"
                aria-label="GitHub"
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                id="footer-twitter"
                aria-label="X (Twitter)"
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
              >
                <X className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="flex flex-col items-center md:items-start">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      id={`footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-[var(--border-subtle)]" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            v{APP_VERSION} · Powered by{" "}
            <span className="text-[var(--accent-amber)]">Gemini AI</span> ·{" "}
            <span className="text-[var(--accent-emerald)]">Firebase</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
