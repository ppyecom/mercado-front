"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Incidencia = {
  id: number;
  tipo: string;
  descripcion: string;
  reportadoPor: string;
  estado: string;
  fecha: string;
  comerciante?: { id: number; nombres: string; apellidos: string } | null;
};

const ESTADOS = ["PENDIENTE", "EN_REVISION", "CERRADO"];

function badge(estado: string) {
  const cls =
    estado === "PENDIENTE" ? "bg-red-100 text-red-700" :
    estado === "EN_REVISION" ? "bg-yellow-100 text-yellow-700" :
    "bg-green-100 text-green-700";
  return <span className={`text-xs px-2 py-1 rounded ${cls}`}>{estado}</span>;
}

function badgeTipo(t: string) {
  const cls =
    t === "SEGURIDAD" ? "bg-red-50 text-red-800 border border-red-200" :
    t === "INFRAESTRUCTURA" ? "bg-blue-50 text-blue-800 border border-blue-200" :
    t === "SANITARIO" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
    "bg-gray-50 text-gray-800 border border-gray-200";
  return <span className={`text-xs px-2 py-1 rounded ${cls}`}>{t}</span>;
}

export default function IncidenciasPage() {
  const [items, setItems] = useState<Incidencia[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try { setItems(await api<Incidencia[]>("/incidencias")); }
    catch (e: any) { setErr(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function setEstado(id: number, estado: string) {
    await api(`/incidencias/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) });
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Incidencias reportadas</h1>
        <p className="text-sm text-gray-600 mt-1">
          Registro documentado. Este modulo no resuelve casos de seguridad
          ciudadana; las incidencias de tipo SEGURIDAD deben ser derivadas a la
          Policia Nacional o al Ministerio Publico.
        </p>
      </div>

      {err && <div className="text-red-600 text-sm">{err}</div>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Descripcion</th>
              <th className="text-left p-2">Reportado por</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Cambiar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t align-top">
                <td className="p-2 whitespace-nowrap">{new Date(i.fecha).toLocaleString()}</td>
                <td className="p-2">{badgeTipo(i.tipo)}</td>
                <td className="p-2 max-w-md">{i.descripcion}</td>
                <td className="p-2">{i.reportadoPor}</td>
                <td className="p-2">{badge(i.estado)}</td>
                <td className="p-2">
                  <select
                    className="border rounded p-1 text-xs"
                    value={i.estado}
                    onChange={(e) => setEstado(i.id, e.target.value)}
                  >
                    {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-gray-500 text-center">Sin incidencias.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
