import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router";
import { Crosshair, LayoutDashboard, LogOut, Shield, Menu, Calculator } from "lucide-react";
import { useState, useEffect } from "react";

const ADMIN_SESSION_KEY = "pubg_admin_auth";

export function useAdminAuth() {
  const isAuth = () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  const login = () => sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  const logout = () => sessionStorage.removeItem(ADMIN_SESSION_KEY);
  return { isAuth, login, logout };
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const authenticated = isAuth();
  const isLoginPage = location.pathname === "/admin" || location.pathname === "/admin/";

  useEffect(() => {
    if (!authenticated && !isLoginPage) {
      navigate("/admin", { replace: true });
    }
  }, [authenticated, isLoginPage, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  if (isLoginPage && !authenticated) {
    return (
      <div
        className="min-h-screen bg-background text-foreground flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(240,165,0,0.06) 0%, transparent 70%)",
          }}
        />
        <Outlet />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div
      className="min-h-screen bg-background text-foreground flex"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 bg-card border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-border flex-shrink-0">
          <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Crosshair size={15} className="text-primary" />
          </div>
          <div>
            <div className="font-['Barlow_Condensed'] font-extrabold text-sm tracking-widest uppercase text-foreground leading-none">
              PUBG ORG
            </div>
            <div className="text-[9px] font-mono text-primary/50 tracking-wider uppercase">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-mono text-muted-foreground/50 tracking-[0.2em] uppercase px-3 mb-2">
            Boshqaruv
          </div>
          <NavLink
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-['Barlow_Condensed'] font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`
            }
          >
            <LayoutDashboard size={15} />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/calculator"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-['Barlow_Condensed'] font-semibold tracking-wide transition-all ${isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
          >
            <Calculator size={15} />
            PTS Kalkulyator
          </NavLink>
          <NavLink
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-['Barlow_Condensed'] font-semibold tracking-wide text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Shield size={15} />
            Saytga o&apos;tish
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-['Barlow_Condensed'] font-semibold tracking-wide text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut size={15} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center gap-4 px-4 lg:px-6 lg:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <Menu size={20} />
          </button>
          <span className="font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase text-foreground">
            Admin Panel
          </span>
          <button
            onClick={handleLogout}
            className="ml-auto text-muted-foreground hover:text-foreground p-1"
          >
            <LogOut size={16} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
