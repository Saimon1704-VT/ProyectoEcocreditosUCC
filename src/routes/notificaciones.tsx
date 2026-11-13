import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useUsuario } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { ArrowLeft, Bell, CheckCircle2, Gift, AlertTriangle, Trophy } from "lucide-react";

export const Route = createFileRoute("/notificaciones")({
  head: () => ({ meta: [{ title: "Notificaciones - EcoCreditos UCC" }] }),
  component: Notificaciones,
});

const estilos = {
  accion: { icon: CheckCircle2, color: "text-success bg-success/10" },
  recompensa: { icon: Gift, color: "text-primary bg-primary/10" },
  ranking: { icon: Trophy, color: "text-warning bg-warning/10 dark:bg-warning/20" },
  alerta: { icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  info: { icon: Bell, color: "text-muted-foreground bg-muted" },
};

function Notificaciones() {
  useRequireAuth();
  const u = useUsuario();
  const items = u.notificaciones.length > 0
    ? u.notificaciones
    : [
        {
          id: "vacio",
          tipo: "info" as const,
          titulo: "Sin notificaciones",
          desc: "Tus acciones, canjes y cambios de ranking apareceran aqui.",
          tiempo: "Ahora",
          nuevo: false,
        },
      ];

  return (
    <MobileShell title="Notificaciones" showBell={false}>
      <div className="px-5 pt-4">
        <Link to="/inicio" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Inicio
        </Link>
        <div className="flex flex-col gap-2">
          {items.map((n) => {
            const estilo = estilos[n.tipo];
            const Icon = estilo.icon;
            return (
              <div key={n.id} className={`bg-card rounded-2xl border border-border p-4 flex gap-3 ${n.nuevo ? "border-primary/30" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${estilo.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{n.titulo}</p>
                    {n.nuevo && <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{n.tiempo}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
