"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Metrics = {
  comerciantesActivos: number;
  comerciantesTotal: number;
  puestosTotal: number;
  puestosOcupados: number;
  puestosDisponibles: number;
  ocupacionPct: number;
  estibadoresActivos: number;
  turnosHoy: number;
  ingresosHoy: number;
  incidenciasSeguridadPendientes: number;
  incidenciasPendientesTotal: number;
};

function Card({ title, value, hint }: { title: string; value: any; hint?: string }) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <div className="text-xs uppercase text-gray-500">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [m, setM] = useState<Metrics | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Metrics>("/dashboard/metrics").then(setM).catch((e) => setErr(e.message));
  }, []);

  if (err) return <div className="text-red-600">{err}</div>;
  if (!m) return <div>Cargando metricas...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard operativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Comerciantes activos" value={m.comerciantesActivos} hint={`Total: ${m.comerciantesTotal}`} />
        <Card title="Ocupacion de puestos" value={`${m.ocupacionPct}%`} hint={`${m.puestosOcupados}/${m.puestosTotal}`} />
        <Card title="Puestos disponibles" value={m.puestosDisponibles} />
        <Card title="Estibadores activos" value={m.estibadoresActivos} />
        <Card title="Turnos hoy" value={m.turnosHoy} hint="Tarifario digital aplicado" />
        <Card title="Ingresos mercaderia hoy" value={m.ingresosHoy} />
        <Card
          title="Incidencias de seguridad pendientes"
          value={m.incidenciasSeguridadPendientes}
          hint={`Pendientes totales: ${m.incidenciasPendientesTotal}`}
        />
      </div>
    </div>
  );
}
