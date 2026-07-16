import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Crosshair } from "lucide-react";
import { useAdminAuth } from "../../layouts/AdminLayout";

const ADMIN_PIN = "pubg2024";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = () => {
    if (pin === ADMIN_PIN) {
      login();
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError(true);
      setShaking(true);
      setPin("");
      setTimeout(() => {
        setError(false);
        setShaking(false);
      }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div
          className={`rounded-2xl border bg-card p-8 text-center transition-all ${
            shaking ? "border-destructive/50 animate-bounce" : "border-border"
          }`}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-5">
            <Lock size={26} className="text-primary" />
          </div>

          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <Crosshair size={14} className="text-primary/60" />
            <span className="text-xs font-mono text-primary/60 tracking-[0.25em] uppercase">
              PUBG ORG
            </span>
          </div>

          <h1 className="font-['Barlow_Condensed'] font-extrabold text-2xl tracking-widest uppercase text-foreground mb-1">
            Admin Panel
          </h1>
          <p className="text-xs text-muted-foreground font-mono mb-7">
            PIN kod kiriting kirish uchun
          </p>

          {/* PIN input */}
          <input
            className={`w-full text-center bg-secondary border rounded-xl px-4 py-3 text-lg font-mono tracking-[0.5em] focus:outline-none transition-all mb-2 ${
              error
                ? "border-destructive text-destructive"
                : "border-border focus:border-primary/60 text-foreground"
            }`}
            type="password"
            value={pin}
            placeholder="••••••••"
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />

          {error && (
            <p className="text-destructive text-xs font-mono mb-3">
              Noto&apos;g&apos;ri PIN kod. Qayta urinib ko&apos;ring.
            </p>
          )}

          <button
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-['Barlow_Condensed'] font-bold tracking-widest uppercase text-sm hover:bg-primary/90 active:scale-[0.98] transition-all mt-2 disabled:opacity-40"
            onClick={handleSubmit}
            disabled={!pin}
          >
            Kirish
          </button>
        </div>

        <p className="text-center text-xs font-mono text-muted-foreground/30 mt-4 tracking-wider">
          Standart PIN: pubg2024
        </p>
      </div>
    </div>
  );
}
