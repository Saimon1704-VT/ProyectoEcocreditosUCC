import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MobileShell } from "@/components/MobileShell";
import { CreditBadge } from "@/components/CreditBadge";
import { TIPOS_ACCION, acciones } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { ArrowLeft, MapPin, QrCode, CheckCircle2, XCircle, Loader2, Leaf, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/accion/$id")({
  head: () => ({ meta: [{ title: "Validar acción — EcoCréditos UCC" }] }),
  component: AccionDetalle,
});

type Estado = "inicio" | "verificando" | "exito" | "rechazado";

function AccionDetalle() {
  useRequireAuth();
  const { id } = Route.useParams();
  const accion = TIPOS_ACCION.find((a) => a.id === id) ?? TIPOS_ACCION[0];
  const [estado, setEstado] = useState<Estado>("inicio");
  const [paso, setPaso] = useState(0);
  const nav = useNavigate();

  const pasos = accion.verificacion === "gps"
    ? ["Detectando ubicación GPS…", "Validando ruta sostenible…", "Confirmando con sistema UCC…"]
    : accion.verificacion === "qr"
      ? ["Activando cámara…", "Leyendo código QR…", "Validando con punto ecológico…"]
      : ["Registrando acción…", "Verificando con docente…", "Confirmando con sistema UCC…"];

  useEffect(() => {
    if (estado !== "verificando") return;
    if (paso < pasos.length) {
      const t = setTimeout(() => setPaso(paso + 1), 900);
      return () => clearTimeout(t);
    }
    acciones.sumarCreditos(accion.nombre, accion.creditos);
    setEstado("exito");
  }, [estado, paso]);

  const iniciar = () => { setPaso(0); setEstado("verificando"); };

  return (
    <MobileShell showBell={false}>
      <div className="px-5 pt-4">
        <Link to="/acciones" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Acciones
        </Link>

        <div className="mt-4 bg-gradient-card rounded-3xl border border-border p-6 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            {accion.verificacion === "gps" ? <MapPin className="w-7 h-7 text-primary" /> : <QrCode className="w-7 h-7 text-primary" />}
          </div>
          <h2 className="text-xl font-bold mt-3">{accion.nombre}</h2>
          <p className="text-sm text-muted-foreground mt-2">{accion.desc}</p>
          <div className="mt-4 flex items-center justify-between">
            <CreditBadge value={accion.creditos} />
            <span className="text-xs text-muted-foreground">Límite diario: 2 veces</span>
          </div>
        </div>

        <div className="mt-5 bg-card rounded-2xl border border-border p-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Cómo se verifica</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {accion.verificacion === "gps" && (
              <>
                <li>📍 Tu ubicación GPS debe coincidir con un trayecto válido.</li>
                <li>⏱ Se medirá tu distancia y tiempo recorridos.</li>
              </>
            )}
            {accion.verificacion === "qr" && (
              <>
                <li>📷 Escanea el código QR del punto ecológico.</li>
                <li>🛡 El sistema antifraude valida cada lectura.</li>
              </>
            )}
            {accion.verificacion === "manual" && (
              <>
                <li>📝 La acción será confirmada por tu docente o el sistema académico.</li>
              </>
            )}
          </ul>
        </div>

        <button
          onClick={iniciar}
          disabled={estado === "verificando"}
          className="mt-6 w-full bg-gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-soft disabled:opacity-60"
        >
          {estado === "verificando" ? "Verificando…" : "Validar acción"}
        </button>
      </div>

      {estado === "verificando" && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-card rounded-3xl p-8 border border-border shadow-elegant text-center animate-scale-in">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
              <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                {accion.verificacion === "gps" ? <MapPin className="w-10 h-10 text-primary" /> : <QrCode className="w-10 h-10 text-primary" />}
              </div>
            </div>
            <h3 className="mt-6 font-semibold">Verificación en curso</h3>
            <div className="mt-4 space-y-2 text-left">
              {pasos.map((p, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm transition ${i < paso ? "text-success" : i === paso ? "text-foreground" : "text-muted-foreground/50"}`}>
                  {i < paso ? <CheckCircle2 className="w-4 h-4" /> : i === paso ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="w-4 h-4 rounded-full border border-current" />}
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {estado === "exito" && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-card rounded-3xl p-8 border border-border shadow-elegant text-center animate-scale-in">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-success" />
              </div>
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-success font-bold text-2xl animate-credit-pop flex items-center gap-1">
                <Leaf className="w-5 h-5" /> +{accion.creditos}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-bold">¡Acción verificada correctamente!</h3>
            <p className="text-sm text-muted-foreground mt-2">Has ganado <strong className="text-primary">{accion.creditos} créditos verdes</strong>.</p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-success bg-success/10 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> {accion.verificacion === "gps" ? "Ubicación verificada" : accion.verificacion === "qr" ? "Código QR válido" : "Verificación válida"}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => nav({ to: "/historial" })} className="flex-1 py-3 rounded-xl border border-border font-medium text-sm">Ver historial</button>
              <button onClick={() => nav({ to: "/inicio" })} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm">Continuar</button>
            </div>
          </div>
        </div>
      )}

      {estado === "rechazado" && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-card rounded-3xl p-8 border border-border shadow-elegant text-center animate-scale-in">
            <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-14 h-14 text-destructive" />
            </div>
            <h3 className="mt-6 text-xl font-bold">Acción rechazada</h3>
            <p className="text-sm text-muted-foreground mt-2">Detectamos actividad sospechosa o datos no válidos. Inténtalo de nuevo siguiendo las instrucciones.</p>
            <div className="mt-6 flex gap-2">
              <button onClick={() => nav({ to: "/acciones" })} className="flex-1 py-3 rounded-xl border border-border font-medium text-sm">Volver</button>
              <button onClick={() => { setEstado("inicio"); }} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm">Reintentar</button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
