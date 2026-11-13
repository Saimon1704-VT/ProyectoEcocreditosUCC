import { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Leaf, Gift, User, Bell } from "lucide-react";

const tabs = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/acciones", label: "Acciones", icon: Leaf },
  { to: "/recompensas", label: "Recompensas", icon: Gift },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function MobileShell({ children, title, showBell = true }: { children: ReactNode; title?: string; showBell?: boolean }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-muted/40 flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen bg-background flex flex-col relative shadow-elegant">
        {title && (
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">{title}</h1>
            {showBell && (
              <Link to="/notificaciones" className="relative p-2 rounded-full hover:bg-muted transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
              </Link>
            )}
          </header>
        )}
        <main className="flex-1 pb-24">{children}</main>
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-background/95 backdrop-blur-md border-t border-border z-40">
          <ul className="grid grid-cols-4">
            {tabs.map((t) => {
              const active = loc.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <li key={t.to}>
                  <Link to={t.to} className="flex flex-col items-center py-3 gap-1 transition">
                    <div className={`p-2 rounded-xl transition ${active ? "bg-primary/10" : ""}`}>
                      <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{t.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
