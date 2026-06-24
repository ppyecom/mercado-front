"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Puesto = { id: number; codigo: string; zona: string; areaM2: string; estado: string; comerciante?: any };

export default function PuestosPage() {
  const [items, setItems] = useState<Puesto[]>([]);
  const [form, setForm] = useState({ codigo: "", zona: "", areaM2: "" });
  const [err, setErr] = useState<string | null>(null);

  async function load() { setItems(await api<Puesto[]>("/puestos")); }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      await api("/puestos", {
        method: "POST",
        body: JSON.stringify({ codigo: form.codigo, zona: form.zona, areaM2: Number(form.areaM2) }),
      });
      setForm({ codigo: "", zona: "", areaM2: "" });
      await load();
    } catch (e: any) { setErr(e.message); }
  }

  async function setEstado(id: number, estado: string) {
    await api(`/puestos/${id}`, { method: "PUT", body: JSON.stringify({ estado }) });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Puestos del mercado</h1>

      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid grid-cols-4 gap-3">
        <input className="border rounded p-2" placeholder="Codigo (P-A03)" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
        <input className="border rounded p-2" placeholder="Zona" value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })} />
        <input className="border rounded p-2" placeholder="Area m2" value={form.areaM2} onChange={(e) => setForm({ ...form, areaM2: e.target.value })} />
        <button className="bg-blue-600 text-white rounded px-4">Crear</button>
        {err && <div className="col-span-full text-red-600 text-sm">{err}</div>}
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="font-bold">{p.codigo}</div>
            <div className="text-xs text-gray-500">{p.zona} · {String(p.areaM2)} m2</div>
            <div className={`mt-2 text-xs inline-block px-2 py-1 rounded ${
              p.estado === "DISPONIBLE" ? "bg-green-100 text-green-700" :
              p.estado === "OCUPADO" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{p.estado}</div>
            {!p.comerciante && (
              <div className="mt-3 flex gap-2 text-xs">
                <button onClick={() => setEstado(p.id, "DISPONIBLE")} className="text-blue-600">Disponible</button>
                <button onClick={() => setEstado(p.id, "MANTENIMIENTO")} className="text-yellow-700">Mant.</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
