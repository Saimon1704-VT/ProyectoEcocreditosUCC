import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { CreditBadge } from "@/components/CreditBadge";
import { useUsuario, acciones } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { LogOut, Trophy, Award, BarChart3, Settings, Mail, ChevronRight, Gift } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — EcoCréditos UCC" }] }),
  component: Perfil,
});

function Perfil() {
  useRequireAuth();
  const u = useUsuario();
  const nav = useNavigate();
  const iniciales = u.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <MobileShell title="Mi perfil">
      <div className="px-5 pt-4">
        <div className="bg-gradient-card border border-border rounded-3xl p-6 text-center shadow-soft">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-glow">
            {iniciales}
          </div>
          <h2 className="mt-4 text-xl font-bold">{u.nombre}</h2>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
            <Mail className="w-3.5 h-3.5" /> {u.correo}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{u.rol} · {u.programa}</p>
          <div className="mt-4 flex justify-center"><CreditBadge value={u.creditos} size="lg" /></div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Insignias</h3>
          <div className="flex flex-wrap gap-2">
            {u.insignias.map((i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">🏅 {i}</span>
            ))}
          </div>
        </div>

        {u.canjes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Gift className="w-4 h-4 text-primary" /> Canjes recientes</h3>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {u.canjes.slice(0, 3).map((c, i) => (
                <div key={c.id} className={`flex items-center justify-between px-4 py-3 ${i < Math.min(u.canjes.length, 3) - 1 ? "border-b border-border" : ""}`}>
                  <div>
                    <p className="text-sm font-medium">{c.nombre}</p>
                    <p className="text-xs text-muted-foreground">{c.fecha}</p>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">-{c.costo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-card rounded-2xl border border-border overflow-hidden">
          <Link to="/ranking" className="flex items-center justify-between px-4 py-4 border-b border-border hover:bg-muted/50 transition">
            <span className="flex items-center gap-3 text-sm"><Trophy className="w-5 h-5 text-primary" /> Ranking de usuarios</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link to="/estadisticas" className="flex items-center justify-between px-4 py-4 border-b border-border hover:bg-muted/50 transition">
            <span className="flex items-center gap-3 text-sm"><BarChart3 className="w-5 h-5 text-primary" /> Estadísticas ambientales</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link to="/notificaciones" className="flex items-center justify-between px-4 py-4 hover:bg-muted/50 transition">
            <span className="flex items-center gap-3 text-sm"><Settings className="w-5 h-5 text-primary" /> Notificaciones</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>

        <button
          onClick={() => { acciones.cerrarSesion(); nav({ to: "/login" }); }}
          className="mt-6 w-full py-4 rounded-2xl border border-destructive/30 text-destructive font-medium flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
      </div>
    </MobileShell>
  );
}
