import { Outlet, NavLink, Link } from "react-router";
import { Crosshair, Trophy, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

// Telegram SVG icon (rasmiy logo)
function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

// Sizning Telegram kanal linkingizni shu yerga yozing:
const TELEGRAM_CHANNEL_URL = "https://t.me/Namangan_scrims";

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient glow - fixed, pastda qoladi */}
      <div
        className="fixed inset-0 pointer-events-none z-0 dark:block hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(242,169,0,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Light mode ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 dark:hidden block"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(242,169,0,0.05) 0%, transparent 70%)",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          HEADER — sticky top-0, z-50 (content ustida qoladi)
          ═══════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl"
        style={{
          isolation: "isolate",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Crosshair size={18} className="text-primary" />
            </div>
            <div className="hidden xs:block">
              <div className="font-['Barlow_Condensed'] font-extrabold text-lg leading-none tracking-widest uppercase text-foreground">
                50 Namangan
              </div>
              <div className="text-[9px] font-mono text-primary/50 tracking-[0.2em] uppercase">
                Tournament Platform
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1 ml-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-[22px] text-sm font-['Barlow_Condensed'] font-semibold tracking-wider uppercase border-b-2 transition-all ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Trophy size={14} />
              Turnirlar
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Telegram tugmasi — desktop */}
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#229ED9] hover:text-foreground border border-[#229ED9]/40 hover:border-[#229ED9] hover:bg-[#229ED9]/10 px-3 py-1.5 rounded transition-all"
              aria-label="Telegram kanalimiz"
            >
              <TelegramIcon size={15} />
              <span>Telegram</span>
            </a>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center w-9 h-9 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Mavzuni o'zgartirish"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Telegram tugmasi — mobil (faqat icon) */}
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded text-[#229ED9] hover:bg-[#229ED9]/10 transition-colors"
              aria-label="Telegram"
            >
              <TelegramIcon size={18} />
            </a>

            {/* Hamburger — mobil */}
            <button
              className="sm:hidden text-muted-foreground hover:text-foreground p-1"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menyuni ochish"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-['Barlow_Condensed'] tracking-wider uppercase text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Trophy size={14} />
              Turnirlar
            </NavLink>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 min-w-0">
        <Outlet />
      </main>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-border py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left — brend */}
          <span className="text-xs font-mono text-muted-foreground/40 tracking-widest uppercase text-center sm:text-left">
            PUBG ORG · Tournament Platform · 2025
          </span>

          {/* Right — Telegram + Admin */}
          <div className="flex items-center gap-4">
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-[#229ED9]/60 hover:text-[#229ED9] transition-colors"
            >
              <TelegramIcon size={12} />
              Telegram
            </a>
            <Link
              to="/admin"
              className="text-xs font-mono text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            >
              Admin Panel →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
