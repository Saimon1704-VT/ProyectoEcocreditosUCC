import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { sesionActiva } from "@/lib/auth";

export function useRequireAuth() {
  const nav = useNavigate();

  useEffect(() => {
    if (!sesionActiva()) nav({ to: "/login" });
  }, [nav]);
}
