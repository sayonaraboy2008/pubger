import { Link } from "react-router";
import { Crosshair } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Crosshair size={40} className="text-muted-foreground/30 mb-4" />
      <h1 className="font-['Barlow_Condensed'] font-extrabold text-5xl tracking-widest text-muted-foreground/20 mb-2">
        404
      </h1>
      <p className="text-muted-foreground font-mono text-sm mb-6">Sahifa topilmadi</p>
      <Link
        to="/"
        className="text-primary text-sm font-mono hover:underline transition-colors"
      >
        ← Bosh sahifaga
      </Link>
    </div>
  );
}
