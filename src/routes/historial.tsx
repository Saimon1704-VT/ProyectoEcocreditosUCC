import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useUsuario } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/historial")({
  head: () => ({ meta: [{ title: "Historial — EcoCréditos UCC" }] }),
  component: Historial,
});

function Historial() {
  useRequireAuth();
  const u = useUsuario();
  return (
    <MobileShell title="Historial">
      <div className="px-5 pt-4">
        <Link to="/inicio" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Inicio
        </Link>

        <div className="flex flex-col gap-2">
          {u.historial.map((h) => {
            const valido = h.estado === "Validado";
            return (
              <div key={h.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${valido ? "bg-success/10" : "bg-destructive/10"}`}>
                  {valido ? <CheckCircle2 className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-destructive" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{h.tipo}</p>
                  <p className="text-xs text-muted-foreground">{h.fecha} · {h.estado}</p>
                </div>
                <span className={`text-sm font-semibold ${valido ? "text-primary" : "text-muted-foreground"}`}>
                  {valido ? `+${h.creditos}` : "0"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
