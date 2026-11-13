import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { acciones, PROGRAMAS, type Programa, type Rol } from "@/lib/store";
import { registrar as registrarAuth, sesionActiva } from "@/lib/auth";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Registro — EcoCréditos UCC" }] }),
  component: Registro,
});

function Regla({ ok, texto }: { ok: boolean; texto: string }) {
  return (
    <li className={`flex items-center gap-1.5 ${ok ? "text-success" : "text-muted-foreground"}`}>
      {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
      {texto}
    </li>
  );
}

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [rol, setRol] = useState<Rol>("Estudiante");
  const [programa, setPrograma] = useState<Programa>("Derecho");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    if (sesionActiva()) nav({ to: "/inicio" });
  }, [nav]);

  const reglas = {
    largo: pass.length >= 8,
    mayus: /[A-Z]/.test(pass),
    numero: /\d/.test(pass),
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExito("");
    if (!nombre.trim()) return setError("Ingresa tu nombre completo.");
    if (!correo.endsWith("@campusucc.edu.co") && !correo.endsWith("@ucc.edu.co"))
      return setError("Usa tu correo institucional UCC.");
    if (!reglas.largo) return setError("La contraseña debe tener mínimo 8 caracteres.");
    if (!reglas.mayus || !reglas.numero) return setError("La contraseña debe incluir una mayúscula y un número.");
    if (pass !== pass2) return setError("Las contraseñas no coinciden.");

    const resultado = registrarAuth({ nombre, correo, password: pass });
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    acciones.registrar(resultado.usuario.nombre, resultado.usuario.correo, rol, programa);
    setExito("Cuenta creada correctamente.");
    window.setTimeout(() => nav({ to: "/inicio" }), 900);
  };

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="w-full max-w-[440px] p-6">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <p className="text-muted-foreground text-sm mt-1">Solo para miembros de la comunidad UCC.</p>

        <form onSubmit={enviar} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Nombre completo</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 w-full px-3 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Correo institucional</label>
            <input value={correo} onChange={(e) => setCorreo(e.target.value)} className="mt-1 w-full px-3 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none" placeholder="usuario@campusucc.edu.co" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Programa</label>
            <select
              value={programa}
              onChange={(e) => setPrograma(e.target.value as Programa)}
              className="mt-1 w-full px-3 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none"
            >
              {PROGRAMAS.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
            <div className="mt-1 relative">
              <input
                type={verPass ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full pr-10 px-3 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none"
                placeholder="Mínimo 8 caracteres"
              />
              <button type="button" onClick={() => setVerPass(!verPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {verPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {pass.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs">
                <Regla ok={reglas.largo} texto="Mínimo 8 caracteres" />
                <Regla ok={reglas.mayus} texto="Al menos una letra mayúscula" />
                <Regla ok={reglas.numero} texto="Al menos un número" />
              </ul>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Confirmar contraseña</label>
            <input
              type={verPass ? "text" : "password"}
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              className="mt-1 w-full px-3 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none"
              placeholder="Repite tu contraseña"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Rol</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["Estudiante", "Docente", "Administrativo"] as Rol[]).map((r) => (
                <button key={r} type="button" onClick={() => setRol(r)}
                  className={`py-3 rounded-xl text-sm font-medium border transition ${rol === r ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {exito && <p className="text-sm text-success">{exito}</p>}

          <button className="mt-2 bg-gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-soft">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
}
