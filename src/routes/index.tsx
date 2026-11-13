import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useUsuario } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const u = useUsuario();
  const nav = useNavigate();
  useEffect(() => {
    if (!u.onboarded) nav({ to: "/onboarding" });
    else if (!u.autenticado) nav({ to: "/login" });
    else nav({ to: "/inicio" });
  }, [u.onboarded, u.autenticado, nav]);
  return <Navigate to="/onboarding" />;
}
