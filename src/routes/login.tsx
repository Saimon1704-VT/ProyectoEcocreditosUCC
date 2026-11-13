import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Mail, Lock, ArrowRight } from "lucide-react";
import { acciones } from "@/lib/store";
import { login as loginAuth, sesionActiva } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — EcoCréditos UCC" }] }),
  component: Login,
});

function Login() {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    if (sesionActiva()) nav({ to: "/inicio" });
  }, [nav]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo.endsWith("@campusucc.edu.co") && !correo.endsWith("@ucc.edu.co")) {
      setError("Usa tu correo institucional UCC.");
      return;
    }

    const resultado = loginAuth(correo, pass);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    acciones.iniciarSesion(resultado.usuario);
    nav({ to: "/inicio" });
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-secondary to-background">
      <div className="w-full max-w-[440px] flex flex-col p-6">
        <div className="pt-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">EcoCréditos UCC</h1>
          <p className="text-muted-foreground text-sm">Universidad Cooperativa de Colombia</p>
        </div>

        <form onSubmit={enviar} className="mt-10 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Correo institucional</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition"
                placeholder="usuario@campusucc.edu.co"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" className="mt-2 bg-gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-soft hover:shadow-glow transition">
            Ingresar <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-primary font-semibold">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
