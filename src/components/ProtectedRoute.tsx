"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
    else setReady(true);
  }, [router]);
  if (!ready) return <div className="p-8 text-gray-500">Cargando...</div>;
  return <>{children}</>;
}
