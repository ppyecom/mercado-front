"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Ingreso = {
  id: number; lote: string; cantidad: string; fechaIngreso: string;
  proveedor: { razonSocial: string };
  producto: { nombre: string; unidad: string };
  comerciante: { nombres: string; apellidos: string };
};

export default function MercaderiaPage() {
  const [items, setItems] = useState<Ingreso[]>([]);
  const [provs, setProvs] = useState<any[]>([]);
  const [prods, setProds] = useState<any[]>([]);
  const [coms, setComs] = useState<any[]>([]);
  const [form, setForm] = useState({ lote: "", proveedorId: "", productoId: "", comercianteId: "", cantidad: "", observaciones: "" });

  async function load() {
    setItems(await api<Ingreso[]>("/mercaderia"));
    setProvs(await api("/mercaderia/proveedores"));
    setProds(await api("/mercaderia/productos"));
    setComs(await api("/comerciantes"));
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await api("/mercaderia", { method: "POST", body: JSON.stringify({
      lote: form.lote,
      proveedorId: Number(form.proveedorId),
      productoId: Number(form.productoId),
      comercianteId: Number(form.comercianteId),
      cantidad: Number(form.cantidad),
      observaciones: form.observaciones || null,
    })});
    setForm({ lote: "", proveedorId: "", productoId: "", comercianteId: "", cantidad: "", observaciones: "" });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ingreso de mercaderia (trazabilidad)</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid grid-cols-3 gap-3">
        <input className="border rounded p-2" placeholder="Lote" value={form.lote} onChange={(e) => setForm({ ...form, lote: e.target.value })} />
        <select className="border rounded p-2" value={form.proveedorId} onChange={(e) => setForm({ ...form, proveedorId: e.target.value })}>
          <option value="">Proveedor</option>
          {provs.map((p: any) => <option key={p.id} value={p.id}>{p.razonSocial} ({p.procedencia})</option>)}
        </select>
        <select className="border rounded p-2" value={form.productoId} onChange={(e) => setForm({ ...form, productoId: e.target.value })}>
          <option value="">Producto</option>
          {prods.map((p: any) => <option key={p.id} value={p.id}>{p.nombre} ({p.unidad})</option>)}
        </select>
        <select className="border rounded p-2" value={form.comercianteId} onChange={(e) => setForm({ ...form, comercianteId: e.target.value })}>
          <option value="">Comerciante destino</option>
          {coms.map((c: any) => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>)}
        </select>
        <input className="border rounded p-2" type="number" step="0.01" placeholder="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
        <input className="border rounded p-2" placeholder="Observaciones" value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
        <button className="bg-blue-600 text-white rounded col-span-3">Registrar ingreso</button>
      </form>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100"><tr>
          <th className="text-left p-2">Fecha</th><th className="text-left p-2">Lote</th>
          <th className="text-left p-2">Proveedor</th><th className="text-left p-2">Producto</th>
          <th className="text-left p-2">Cant.</th><th className="text-left p-2">Comerciante</th>
        </tr></thead>
        <tbody>{items.map((i) => (
          <tr key={i.id} className="border-t">
            <td className="p-2">{new Date(i.fechaIngreso).toLocaleString()}</td>
            <td className="p-2">{i.lote}</td>
            <td className="p-2">{i.proveedor.razonSocial}</td>
            <td className="p-2">{i.producto.nombre} ({i.producto.unidad})</td>
            <td className="p-2">{String(i.cantidad)}</td>
            <td className="p-2">{i.comerciante.nombres} {i.comerciante.apellidos}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}
