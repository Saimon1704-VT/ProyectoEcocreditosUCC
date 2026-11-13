import { createFileRoute, Link } from "@tanstack/react-router";
import { obtenerRanking, useUsuario } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { MobileShell } from "@/components/MobileShell";
import { CreditBadge } from "@/components/CreditBadge";
import { Leaf, History, Gift, Plus, TrendingUp, Trophy, Cloud } from "lucide-react";

export const Route = createFileRoute("/inicio")({
  head: () => ({ meta: [{ title: "Inicio — EcoCréditos UCC" }] }),
  component: Inicio,
});

function Inicio() {
  useRequireAuth();
  const u = useUsuario();
  const pct = Math.round((u.progresoSemanal / u.metaSemanal) * 100);
  const co2 = Math.round(u.creditos * 0.18);
  const ranking = obtenerRanking(u);

  return (
    <MobileShell>
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-8 pb-12 rounded-b-[2rem]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-85">Hola,</p>
            <h2 className="text-2xl font-bold">{u.nombre.split(" ")[0]} 👋</h2>
            <p className="text-xs opacity-80 mt-0.5">{u.rol} · {u.programa}</p>
          </div>
          <Link to="/notificaciones" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-6 bg-white/15 backdrop-blur rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-85">Créditos acumulados</span>
            <Leaf className="w-5 h-5 opacity-80" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold">{u.creditos}</span>
            <span className="text-sm opacity-80">créditos verdes</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs opacity-90 mb-1.5">
              <span>Meta semanal</span>
              <span>{u.progresoSemanal} / {u.metaSemanal}</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 grid grid-cols-3 gap-3">
        <Link to="/acciones" className="bg-card rounded-2xl p-3 shadow-soft flex flex-col items-center gap-2 hover:scale-[1.03] transition">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-center leading-tight">Registrar acción</span>
        </Link>
        <Link to="/recompensas" className="bg-card rounded-2xl p-3 shadow-soft flex flex-col items-center gap-2 hover:scale-[1.03] transition">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Gift className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-xs font-medium text-center leading-tight">Ver recompensas</span>
        </Link>
        <Link to="/historial" className="bg-card rounded-2xl p-3 shadow-soft flex flex-col items-center gap-2 hover:scale-[1.03] transition">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <History className="w-5 h-5 text-secondary-foreground" />
          </div>
          <span className="text-xs font-medium text-center leading-tight">Historial</span>
        </Link>
      </div>

      <section className="px-5 mt-8">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary"/> Tu impacto</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground">CO₂ evitado</p>
            <p className="text-2xl font-bold mt-1">{co2} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground">Acciones validadas</p>
            <p className="text-2xl font-bold mt-1">{u.historial.filter(h => h.estado === "Validado").length}</p>
          </div>
        </div>
      </section>

      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Trophy className="w-4 h-4 text-primary"/> Ranking</h3>
          <Link to="/ranking" className="text-xs text-primary font-medium">Ver todo</Link>
        </div>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {ranking.slice(0, 3).map((r, i) => (
            <div key={r.correo ?? r.nombre} className={`flex items-center justify-between px-4 py-3 ${r.esTu ? "bg-primary/5" : ""} ${i < 2 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-warning text-warning-foreground" : i === 1 ? "bg-muted" : "bg-secondary"}`}>{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{r.nombre}{r.esTu && " (tú)"}</p>
                  <p className="text-xs text-muted-foreground">{r.rol}</p>
                </div>
              </div>
              <CreditBadge value={r.creditos} size="sm" />
            </div>
          ))}
        </div>
      </section>
    </MobileShell>
  );
}
