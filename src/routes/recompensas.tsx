import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { CreditBadge } from "@/components/CreditBadge";
import { RECOMPENSAS, useUsuario, acciones } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { Heart, Award, GraduationCap, Ticket, Gift, ParkingCircle, CheckCircle2, X } from "lucide-react";

export const Route = createFileRoute("/recompensas")({
  head: () => ({ meta: [{ title: "Recompensas — EcoCréditos UCC" }] }),
  component: Recompensas,
});

const ICONS: Record<string, any> = { Heart, Award, GraduationCap, Ticket, Gift, ParkingCircle };

function Recompensas() {
  useRequireAuth();
  const u = useUsuario();
  const [confirmar, setConfirmar] = useState<typeof RECOMPENSAS[number] | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const canjear = () => {
    if (!confirmar) return;
    const exito = acciones.canjear(confirmar.nombre, confirmar.costo);
    if (exito) { setOk(confirmar.nombre); }
    setConfirmar(null);
  };

  return (
    <MobileShell title="Recompensas">
      <div className="px-5 pt-4">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-5 flex items-center justify-between shadow-soft">
          <div>
            <p className="text-xs opacity-85">Tus créditos</p>
            <p className="text-3xl font-bold">{u.creditos}</p>
          </div>
          <Gift className="w-12 h-12 opacity-30" />
        </div>

        <h2 className="mt-6 font-semibold mb-3">Catálogo de beneficios</h2>
        <div className="grid grid-cols-2 gap-3">
          {RECOMPENSAS.map((r) => {
            const Icon = ICONS[r.icono] ?? Gift;
            const alcanza = u.creditos >= r.costo;
            return (
              <div key={r.id} className="bg-card rounded-2xl border border-border p-4 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-tight">{r.nombre}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{r.desc}</p>
                <div className="mt-3"><CreditBadge value={r.costo} size="sm" /></div>
                <button
                  disabled={!alcanza}
                  onClick={() => setConfirmar(r)}
                  className={`mt-3 py-2 rounded-xl text-xs font-semibold transition ${alcanza ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                >
                  {alcanza ? "Canjear" : "Faltan créditos"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {confirmar && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card rounded-3xl p-6 border border-border shadow-elegant animate-scale-in">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">Confirmar canje</h3>
              <button onClick={() => setConfirmar(null)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">¿Deseas canjear <strong className="text-foreground">{confirmar.nombre}</strong> por <strong className="text-primary">{confirmar.costo} créditos</strong>?</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setConfirmar(null)} className="flex-1 py-3 rounded-xl border border-border font-medium text-sm">Cancelar</button>
              <button onClick={canjear} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {ok && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-card rounded-3xl p-8 border border-border shadow-elegant text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h3 className="mt-5 text-lg font-bold">¡Canje exitoso!</h3>
            <p className="text-sm text-muted-foreground mt-2">Recibirás "{ok}" en tu correo institucional.</p>
            <button onClick={() => setOk(null)} className="mt-6 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Listo</button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
