import { Outlet, NavLink, Link } from "react-router";
import { Crosshair, Trophy, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 35% at 50% -5%, rgba(240,165,0,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 sticky top-0 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Crosshair size={18} className="text-primary" />
            </div>
            <div>
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

          {/* Right */}
          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary border border-border hover:border-primary/40 px-3 py-1.5 rounded transition-all"
            >
              Admin
            </Link>
            {/* Mobile menu */}
            <button
              className="sm:hidden text-muted-foreground hover:text-foreground p-1"
              onClick={() => setMobileOpen((o) => !o)}
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
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-mono text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-mono text-muted-foreground/40 tracking-widest uppercase">
            PUBG ORG · Tournament Platform · 2025
          </span>
          <Link
            to="/admin"
            className="text-xs font-mono text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          >
            Admin Panel →
          </Link>
        </div>
      </footer>
    </div>
  );
}
