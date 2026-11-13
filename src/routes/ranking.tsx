import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { CreditBadge } from "@/components/CreditBadge";
import { obtenerRanking, useUsuario } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { ArrowLeft, Trophy } from "lucide-react";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — EcoCréditos UCC" }] }),
  component: Ranking,
});

function Ranking() {
  useRequireAuth();
  const usuario = useUsuario();
  const orden = obtenerRanking(usuario);
  return (
    <MobileShell title="Tabla de posiciones">
      <div className="px-5 pt-4">
        <Link to="/inicio" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Inicio
        </Link>

        <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-5 flex items-center gap-3 shadow-soft">
          <Trophy className="w-8 h-8" />
          <div>
            <p className="font-semibold">Comunidad UCC</p>
            <p className="text-xs opacity-85">Compite con tus compañeros y suma para tu campus.</p>
          </div>
        </div>

        <div className="mt-5 bg-card rounded-2xl border border-border overflow-hidden">
          {orden.map((r, i) => (
            <div key={r.correo ?? r.nombre} className={`flex items-center justify-between px-4 py-3 ${r.esTu ? "bg-primary/5" : ""} ${i < orden.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-warning text-warning-foreground" : i === 1 ? "bg-muted" : i === 2 ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{r.nombre}{r.esTu && " (tú)"}</p>
                  <p className="text-xs text-muted-foreground">{r.rol}</p>
                </div>
              </div>
              <CreditBadge value={r.creditos} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
