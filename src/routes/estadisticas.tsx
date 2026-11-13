import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useUsuario } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { ArrowLeft, Cloud, Droplets, TreePine, Recycle } from "lucide-react";

export const Route = createFileRoute("/estadisticas")({
  head: () => ({ meta: [{ title: "Estadísticas ambientales — EcoCréditos UCC" }] }),
  component: Estadisticas,
});

function Estadisticas() {
  useRequireAuth();
  const u = useUsuario();
  const co2 = Math.round(u.creditos * 0.18);
  const agua = Math.round(u.creditos * 1.4);
  const arboles = Math.max(1, Math.round(u.creditos / 80));
  const reciclado = Math.round(u.creditos * 0.05);

  const stats = [
    { icon: Cloud, label: "CO₂ evitado", valor: `${co2} kg`, color: "text-sky", bg: "bg-sky/10" },
    { icon: Droplets, label: "Agua ahorrada", valor: `${agua} L`, color: "text-primary", bg: "bg-primary/10" },
    { icon: TreePine, label: "Árboles equivalentes", valor: `${arboles}`, color: "text-leaf", bg: "bg-success/10" },
    { icon: Recycle, label: "Material reciclado", valor: `${reciclado} kg`, color: "text-earth", bg: "bg-accent" },
  ];

  return (
    <MobileShell title="Tu impacto ambiental">
      <div className="px-5 pt-4">
        <Link to="/perfil" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Perfil
        </Link>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold mt-3">{s.valor}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-gradient-hero text-primary-foreground rounded-2xl p-5">
          <p className="text-sm opacity-85">Equivalente</p>
          <p className="font-semibold mt-1">Tu impacto equivale a evitar {Math.round(co2 / 4)} viajes en automóvil de 10 km. 🌱</p>
        </div>
      </div>
    </MobileShell>
  );
}
