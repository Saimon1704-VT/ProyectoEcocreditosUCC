import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { CreditBadge } from "@/components/CreditBadge";
import { TIPOS_ACCION } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { Bike, Recycle, Users, Lightbulb, FileText, GlassWater, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/acciones")({
  head: () => ({ meta: [{ title: "Acciones ambientales — EcoCréditos UCC" }] }),
  component: Acciones,
});

const ICONS: Record<string, any> = {
  Bike, Recycle, Bottle: GlassWater, Users, Lightbulb, FileText,
};

function Acciones() {
  useRequireAuth();

  return (
    <MobileShell title="Acciones ambientales">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">Elige una acción y valídala para ganar créditos verdes.</p>

        <div className="mt-5 flex flex-col gap-3">
          {TIPOS_ACCION.map((a) => {
            const Icon = ICONS[a.icono] ?? Recycle;
            return (
              <Link
                key={a.id}
                to="/accion/$id"
                params={{ id: a.id }}
                className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4 hover:border-primary/40 hover:shadow-soft transition"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{a.nombre}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{a.desc}</p>
                  <div className="mt-2"><CreditBadge value={a.creditos} size="sm" /></div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </Link>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-accent text-accent-foreground text-xs">
          💡 Tip: Recuerda activar tu ubicación y la cámara para validar acciones correctamente.
        </div>
      </div>
    </MobileShell>
  );
}
