import { useState } from "react";
import { Calculator, Crosshair, Trophy, RotateCcw } from "lucide-react";
import { DEFAULT_SCORING } from "../../../lib/utils";

export default function PointsCalculator() {
  const [kills, setKills] = useState(0);
  const [placement, setPlacement] = useState(1);
  const [killPts, setKillPts] = useState(DEFAULT_SCORING.killPts);
  const [placementPts, setPlacementPts] = useState(DEFAULT_SCORING.placementPts[0]);
  const total = kills * killPts + placementPts;
  const reset = () => { setKills(0); setPlacement(1); setKillPts(1); setPlacementPts(DEFAULT_SCORING.placementPts[0]); };
  return <div className="max-w-3xl mx-auto">
    <div className="flex items-start justify-between gap-4 mb-8"><div><div className="flex items-center gap-2 text-primary mb-2"><Calculator size={16}/><span className="font-mono text-[10px] tracking-[.22em] uppercase">Mustaqil vosita</span></div><h1 className="font-['Barlow_Condensed'] font-extrabold text-3xl tracking-wider uppercase">Kill + Top kalkulyatori</h1><p className="font-mono text-xs text-muted-foreground mt-1">Turnirga saqlanmaydi — faqat tezkor hisob-kitob uchun.</p></div><button onClick={reset} className="p-2 border border-border rounded-lg text-muted-foreground hover:text-primary"><RotateCcw size={15}/></button></div>
    <div className="grid md:grid-cols-[1fr_.8fr] gap-5">
      <section className="rounded-xl border border-border bg-card p-5 space-y-5"><h2 className="font-['Barlow_Condensed'] font-bold tracking-wider uppercase text-lg">Natijani kiriting</h2>
        {[{label:"Kill soni",value:kills,set:setKills,min:0},{label:"Top o'rin",value:placement,set:setPlacement,min:1},{label:"1 kill uchun pts",value:killPts,set:setKillPts,min:0},{label:"Tanlangan Top uchun pts",value:placementPts,set:setPlacementPts,min:0}].map((x)=><label key={x.label} className="block"><span className="block mb-1.5 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">{x.label}</span><input type="number" min={x.min} value={x.value} onChange={(e)=>x.set(Math.max(x.min,Number(e.target.value)))} className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none"/></label>)}
      </section>
      <section className="rounded-xl border border-primary/25 bg-primary/[.06] p-5 flex flex-col justify-between"><div><span className="text-[10px] font-mono tracking-[.2em] text-primary uppercase">Jami ball</span><div className="font-mono text-6xl font-bold text-primary mt-3">{total}<span className="text-xl ml-2">PTS</span></div></div><div className="space-y-3 pt-8"><div className="flex justify-between border-b border-border pb-2 font-mono text-xs"><span className="text-muted-foreground flex gap-2"><Crosshair size={13}/>Kill</span><span>{kills} × {killPts} = {kills * killPts}</span></div><div className="flex justify-between border-b border-border pb-2 font-mono text-xs"><span className="text-muted-foreground flex gap-2"><Trophy size={13}/>Top #{placement}</span><span>{placementPts} pts</span></div></div></section>
    </div>
  </div>;
}
