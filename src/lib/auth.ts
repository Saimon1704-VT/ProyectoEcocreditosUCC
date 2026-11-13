export type AuthUser = {
  nombre: string;
  correo: string;
  password: string;
};

type AuthResult =
  | { ok: true; usuario: AuthUser }
  | { ok: false; error: string };

const USERS_KEY = "ecocreditos-ucc-users";
const SESSION_KEY = "ecocreditos-ucc-session";

function puedeUsarStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizarCorreo(correo: string) {
  return correo.trim().toLowerCase();
}

function leerUsuarios(): AuthUser[] {
  if (!puedeUsarStorage()) return [];

  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const usuarios = JSON.parse(raw);
    return Array.isArray(usuarios) ? usuarios : [];
  } catch {
    return [];
  }
}

function guardarUsuarios(usuarios: AuthUser[]) {
  if (!puedeUsarStorage()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

export function registrar(usuario: AuthUser): AuthResult {
  if (!puedeUsarStorage()) {
    return { ok: false, error: "El almacenamiento local no esta disponible." };
  }

  const nuevoUsuario = {
    ...usuario,
    nombre: usuario.nombre.trim(),
    correo: normalizarCorreo(usuario.correo),
  };

  const usuarios = leerUsuarios();
  const existe = usuarios.some((u) => normalizarCorreo(u.correo) === nuevoUsuario.correo);

  if (existe) {
    return { ok: false, error: "Ya existe una cuenta registrada con este correo." };
  }

  guardarUsuarios([...usuarios, nuevoUsuario]);
  localStorage.setItem(SESSION_KEY, nuevoUsuario.correo);

  return { ok: true, usuario: nuevoUsuario };
}

export function login(correo: string, password: string): AuthResult {
  if (!puedeUsarStorage()) {
    return { ok: false, error: "El almacenamiento local no esta disponible." };
  }

  const correoNormalizado = normalizarCorreo(correo);
  const usuario = leerUsuarios().find((u) => normalizarCorreo(u.correo) === correoNormalizado);

  if (!usuario || usuario.password !== password) {
    return { ok: false, error: "Correo o contrasena incorrectos." };
  }

  localStorage.setItem(SESSION_KEY, correoNormalizado);
  return { ok: true, usuario };
}

export function sesionActiva() {
  return obtenerUsuarioActual() !== null;
}

export function obtenerUsuarioActual(): AuthUser | null {
  if (!puedeUsarStorage()) return null;

  const correoSesion = localStorage.getItem(SESSION_KEY);
  if (!correoSesion) return null;

  return leerUsuarios().find((u) => normalizarCorreo(u.correo) === normalizarCorreo(correoSesion)) ?? null;
}

export function logout() {
  if (!puedeUsarStorage()) return;
  localStorage.removeItem(SESSION_KEY);
}
