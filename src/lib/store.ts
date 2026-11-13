// Estado global simple en memoria + localStorage para el prototipo
import { useEffect, useState } from "react";
import { logout, obtenerUsuarioActual, type AuthUser } from "@/lib/auth";

export type Rol = "Estudiante" | "Docente" | "Administrativo";

export const PROGRAMAS = [
  "Derecho",
  "Contaduría Pública",
  "Administración de Empresas",
  "Ingeniería Civil",
  "Ingeniería de Software",
  "Ingeniería Mecánica",
  "Odontología",
  "Psicología",
] as const;

export type Programa = (typeof PROGRAMAS)[number];

export type Accion = {
  id: string;
  tipo: string;
  creditos: number;
  fecha: string;
  estado: "Validado" | "Rechazado";
};

export type Canje = {
  id: string;
  nombre: string;
  costo: number;
  fecha: string;
};

export type Notificacion = {
  id: string;
  tipo: "accion" | "recompensa" | "ranking" | "alerta" | "info";
  titulo: string;
  desc: string;
  tiempo: string;
  nuevo: boolean;
};

export type Usuario = {
  nombre: string;
  correo: string;
  rol: Rol;
  programa: string;
  creditos: number;
  metaSemanal: number;
  progresoSemanal: number;
  insignias: string[];
  historial: Accion[];
  canjes: Canje[];
  notificaciones: Notificacion[];
  onboarded: boolean;
  autenticado: boolean;
};

export type RankingUsuario = {
  nombre: string;
  rol: Rol;
  creditos: number;
  esTu?: boolean;
  correo?: string;
};

const KEY = "creditos-ucc-state";
const USER_KEY_PREFIX = "creditos-ucc-state:";
const RANKING_KEY = "creditos-ucc-ranking-base";

const inicial: Usuario = {
  nombre: "",
  correo: "",
  rol: "Estudiante",
  programa: "Sin programa asignado",
  creditos: 0,
  metaSemanal: 100,
  progresoSemanal: 0,
  insignias: ["Eco-Iniciado"],
  historial: [],
  canjes: [],
  notificaciones: [],
  onboarded: false,
  autenticado: false,
};

function claveUsuario(correo: string) {
  return `${USER_KEY_PREFIX}${correo.trim().toLowerCase()}`;
}

function leer(): Usuario {
  if (typeof window === "undefined") return inicial;
  try {
    const usuarioAuth = obtenerUsuarioActual();
    const rawGlobal = localStorage.getItem(KEY);
    const global = rawGlobal ? JSON.parse(rawGlobal) : {};

    if (!usuarioAuth) return { ...inicial, onboarded: Boolean(global.onboarded), autenticado: false };

    const rawUsuario = localStorage.getItem(claveUsuario(usuarioAuth.correo));
    const base = rawUsuario ? { ...inicial, ...JSON.parse(rawUsuario) } : { ...inicial, onboarded: Boolean(global.onboarded) };

    return {
      ...base,
      nombre: usuarioAuth.nombre,
      correo: usuarioAuth.correo,
      autenticado: true,
      onboarded: true,
    };
  } catch {
    return inicial;
  }
}

let estado: Usuario = inicial;
const listeners = new Set<() => void>();

function emitir() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify({ onboarded: estado.onboarded }));
    if (estado.correo) {
      localStorage.setItem(claveUsuario(estado.correo), JSON.stringify(estado));
    }
  }
}

function crearNotificacion(datos: Omit<Notificacion, "id" | "tiempo" | "nuevo">): Notificacion {
  return {
    id: Math.random().toString(36).slice(2),
    tiempo: "Hace un momento",
    nuevo: true,
    ...datos,
  };
}

export function useUsuario() {
  const [, setTick] = useState(0);
  useEffect(() => {
    estado = leer();
    setTick((t) => t + 1);
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return estado;
}

export const acciones = {
  setOnboarded(v: boolean) { estado = { ...estado, onboarded: v }; emitir(); },
  iniciarSesion(usuario: string | AuthUser) {
    const correo = typeof usuario === "string" ? usuario : usuario.correo;
    const nombre = typeof usuario === "string" ? estado.nombre : usuario.nombre;
    let base = inicial;

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(claveUsuario(correo));
        base = raw ? { ...inicial, ...JSON.parse(raw) } : inicial;
      } catch {
        base = inicial;
      }
    }

    estado = { ...base, nombre, correo, autenticado: true, onboarded: true };
    emitir();
  },
  registrar(nombre: string, correo: string, rol: Rol, programa: Programa) {
    estado = {
      ...estado,
      nombre, correo, rol,
      programa,
      creditos: 0,
      progresoSemanal: 0,
      insignias: ["Eco-Iniciado"],
      historial: [],
      canjes: [],
      notificaciones: [
        crearNotificacion({
          tipo: "info",
          titulo: "Cuenta creada",
          desc: "Ya puedes empezar a registrar acciones ambientales.",
        }),
      ],
      autenticado: true,
      onboarded: true,
    };
    emitir();
  },
  cerrarSesion() {
    logout();
    estado = { ...estado, autenticado: false };
    emitir();
  },
  sumarCreditos(tipo: string, creditos: number) {
    const posicionAnterior = obtenerRanking(estado).findIndex((r) => r.esTu) + 1;
    const nuevosCreditos = estado.creditos + creditos;
    const posicionNueva = obtenerRanking({ ...estado, creditos: nuevosCreditos }).findIndex((r) => r.esTu) + 1;
    const notificaciones = [
      crearNotificacion({
        tipo: "accion",
        titulo: "Accion verificada",
        desc: `${tipo} +${creditos} creditos.`,
      }),
      ...estado.notificaciones,
    ];

    if (posicionAnterior > 0 && posicionNueva > 0 && posicionNueva < posicionAnterior) {
      notificaciones.unshift(
        crearNotificacion({
          tipo: "ranking",
          titulo: "Subiste en el ranking",
          desc: `Ahora estas en el puesto ${posicionNueva} de la comunidad UCC.`,
        }),
      );
    }

    const nuevo: Accion = {
      id: Math.random().toString(36).slice(2),
      tipo, creditos,
      fecha: "Hace un momento",
      estado: "Validado",
    };
    estado = {
      ...estado,
      creditos: nuevosCreditos,
      progresoSemanal: Math.min(estado.metaSemanal, estado.progresoSemanal + creditos),
      historial: [nuevo, ...estado.historial],
      notificaciones,
    };
    emitir();
  },
  rechazar(tipo: string) {
    const nuevo: Accion = {
      id: Math.random().toString(36).slice(2),
      tipo, creditos: 0,
      fecha: "Hace un momento",
      estado: "Rechazado",
    };
    estado = {
      ...estado,
      historial: [nuevo, ...estado.historial],
      notificaciones: [
        crearNotificacion({
          tipo: "alerta",
          titulo: "Accion rechazada",
          desc: `${tipo}: la validacion no fue aprobada.`,
        }),
        ...estado.notificaciones,
      ],
    };
    emitir();
  },
  canjear(nombre: string, costo: number) {
    if (estado.creditos < costo) return false;
    const nuevoCanje: Canje = {
      id: Math.random().toString(36).slice(2),
      nombre,
      costo,
      fecha: "Hace un momento",
    };
    estado = {
      ...estado,
      creditos: estado.creditos - costo,
      canjes: [nuevoCanje, ...estado.canjes],
      notificaciones: [
        crearNotificacion({
          tipo: "recompensa",
          titulo: "Canje exitoso",
          desc: `Canjeaste ${nombre} por ${costo} creditos.`,
        }),
        ...estado.notificaciones,
      ],
    };
    emitir();
    return true;
  },
};

export const TIPOS_ACCION = [
  { id: "movilidad", nombre: "Movilidad sostenible", creditos: 25, icono: "Bike", desc: "Llega al campus en bici, caminando o transporte público.", verificacion: "gps" as const, color: "leaf" },
  { id: "reciclaje", nombre: "Reciclaje en campus", creditos: 15, icono: "Recycle", desc: "Deposita residuos en los puntos ecológicos del campus.", verificacion: "qr" as const, color: "primary" },
  { id: "botellas", nombre: "Entrega de botellas ecológicas", creditos: 10, icono: "Bottle", desc: "Entrega botellas plásticas en los contenedores especiales.", verificacion: "qr" as const, color: "sky" },
  { id: "jornadas", nombre: "Jornadas ambientales", creditos: 40, icono: "Users", desc: "Participa en jornadas de reforestación o limpieza.", verificacion: "gps" as const, color: "leaf" },
  { id: "energia", nombre: "Ahorro de energía", creditos: 12, icono: "Lightbulb", desc: "Reporta apagado de luces y equipos en aulas vacías.", verificacion: "qr" as const, color: "warning" },
  { id: "papel", nombre: "Reducción de papel", creditos: 8, icono: "FileText", desc: "Entrega trabajos digitales en lugar de impresos.", verificacion: "manual" as const, color: "earth" },
];

export const RECOMPENSAS = [
  { id: "r1", nombre: "2 horas de bienestar", desc: "Acceso a actividades de bienestar universitario.", costo: 80, icono: "Heart" },
  { id: "r2", nombre: "Certificado ambiental UCC", desc: "Certificado oficial de impacto ambiental.", costo: 200, icono: "Award" },
  { id: "r3", nombre: "Punto adicional académico", desc: "1 punto extra en una materia electiva.", costo: 350, icono: "GraduationCap" },
  { id: "r4", nombre: "Acceso prioritario a eventos", desc: "Cupos preferentes en eventos UCC.", costo: 120, icono: "Ticket" },
  { id: "r5", nombre: "Kit ecológico UCC", desc: "Botella, bolsa y libreta reciclada.", costo: 150, icono: "Gift" },
  { id: "r6", nombre: "Pase de parqueadero gratis", desc: "Beneficio por movilidad sostenible.", costo: 60, icono: "ParkingCircle" },
];

const RANKING_INICIAL: RankingUsuario[] = [
  { nombre: "Andrés Pérez", rol: "Estudiante", creditos: 980 },
  { nombre: "Laura Castro", rol: "Docente", creditos: 870 },
  { nombre: "Juan Ríos", rol: "Estudiante", creditos: 720 },
  { nombre: "Sofía Núñez", rol: "Administrativo", creditos: 690 },
  { nombre: "Diego Vargas", rol: "Estudiante", creditos: 540 },
];

function leerRankingBase(): RankingUsuario[] {
  if (typeof window === "undefined") return RANKING_INICIAL;

  try {
    const raw = localStorage.getItem(RANKING_KEY);
    if (!raw) {
      localStorage.setItem(RANKING_KEY, JSON.stringify(RANKING_INICIAL));
      return RANKING_INICIAL;
    }

    const ranking = JSON.parse(raw);
    return Array.isArray(ranking) ? ranking : RANKING_INICIAL;
  } catch {
    return RANKING_INICIAL;
  }
}

export function obtenerRanking(usuario: Usuario = estado) {
  const ranking = [...leerRankingBase()];

  if (usuario.autenticado && usuario.correo) {
    ranking.push({
      nombre: usuario.nombre || "Tu cuenta",
      correo: usuario.correo,
      rol: usuario.rol,
      creditos: usuario.creditos,
      esTu: true,
    });
  }

  return ranking.sort((a, b) => b.creditos - a.creditos);
}
