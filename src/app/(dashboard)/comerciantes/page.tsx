"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Comerciante = {
  id: number; dni: string; ruc: string | null; nombres: string; apellidos: string;
  telefono: string; giro: string; estado: string; puestoId: number | null;
  puesto?: { codigo: string } | null;
};
type Puesto = { id: number; codigo: string; estado: string };

export default function ComerciantesPage() {
  const [items, setItems] = useState<Comerciante[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [form, setForm] = useState({
    dni: "", ruc: "", nombres: "", apellidos: "", telefono: "", giro: "FRUTAS", puestoId: "",
  });
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setItems(await api<Comerciante[]>("/comerciantes"));
    setPuestos(await api<Puesto[]>("/puestos"));
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await api("/comerciantes", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          ruc: form.ruc || null,
          puestoId: form.puestoId ? Number(form.puestoId) : null,
        }),
      });
      setForm({ dni: "", ruc: "", nombres: "", apellidos: "", telefono: "", giro: "FRUTAS", puestoId: "" });
      await load();
    } catch (e: any) { setErr(e.message); }
  }

  async function del(id: number) {
    if (!confirm("Eliminar comerciante?")) return;
    await api(`/comerciantes/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Comerciantes</h1>

      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["dni","ruc","nombres","apellidos","telefono"] as const).map((k) => (
          <input key={k} placeholder={k.toUpperCase()} className="border rounded p-2"
            value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <select className="border rounded p-2" value={form.giro} onChange={(e) => setForm({ ...form, giro: e.target.value })}>
          <option>FRUTAS</option><option>VERDURAS</option><option>TUBERCULOS</option>
        </select>
        <select className="border rounded p-2" value={form.puestoId} onChange={(e) => setForm({ ...form, puestoId: e.target.value })}>
          <option value="">(sin puesto)</option>
          {puestos.filter((p) => p.estado === "DISPONIBLE").map((p) => (
            <option key={p.id} value={p.id}>{p.codigo}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white rounded px-4">Registrar</button>
        {err && <div className="col-span-full text-red-600 text-sm">{err}</div>}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100"><tr>
            <th className="text-left p-2">DNI</th><th className="text-left p-2">RUC</th>
            <th className="text-left p-2">Nombre</th><th className="text-left p-2">Giro</th>
            <th className="text-left p-2">Puesto</th><th className="text-left p-2">Estado</th>
            <th></th>
          </tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.dni}</td>
                <td className="p-2">{c.ruc ?? "-"}</td>
                <td className="p-2">{c.nombres} {c.apellidos}</td>
                <td className="p-2">{c.giro}</td>
                <td className="p-2">{c.puesto?.codigo ?? "-"}</td>
                <td className="p-2">{c.estado}</td>
                <td className="p-2"><button onClick={() => del(c.id)} className="text-red-600">Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
