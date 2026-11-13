import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, ShieldCheck, Gift, ArrowRight } from "lucide-react";
import { acciones } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Bienvenido a EcoCréditos UCC" }] }),
  component: Onboarding,
});

const slides = [
  {
    icon: Leaf,
    titulo: "Bienvenido a EcoCréditos UCC",
    desc: "Gana créditos realizando acciones ambientales verificadas en tu campus.",
  },
  {
    icon: ShieldCheck,
    titulo: "Acciones reales, validadas",
    desc: "Verificamos cada acción con GPS, códigos QR y registros del campus.",
  },
  {
    icon: Gift,
    titulo: "Canjea por beneficios",
    desc: "Cambia tus créditos por horas de bienestar, certificados y más.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const S = slides[i];
  const Icon = S.icon;
  const ultimo = i === slides.length - 1;

  return (
    <div className="min-h-screen bg-gradient-hero flex justify-center">
      <div className="w-full max-w-[440px] flex flex-col text-primary-foreground p-6">
        <div className="flex justify-between items-center pt-2">
          <span className="font-display font-bold text-lg">UCC</span>
          <button
            onClick={() => { acciones.setOnboarded(true); nav({ to: "/login" }); }}
            className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            Saltar
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 animate-fade-up" key={i}>
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse-ring" />
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
              <Icon className="w-16 h-16" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl font-bold leading-tight px-4">{S.titulo}</h2>
          <p className="text-primary-foreground/85 text-base max-w-xs">{S.desc}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, idx) => (
            <span key={idx} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
          ))}
        </div>

        <button
          onClick={() => {
            if (ultimo) { acciones.setOnboarded(true); nav({ to: "/login" }); }
            else setI(i + 1);
          }}
          className="w-full bg-white text-primary font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-elegant hover:scale-[1.02] transition"
        >
          {ultimo ? "Comenzar" : "Siguiente"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
