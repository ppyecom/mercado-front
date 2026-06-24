"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Ingreso = {
  id: number; lote: string; cantidad: string; fechaIngreso: string;
  proveedor: { razonSocial: string };
  producto: { nombre: string; unidad: string };
  comerciante: { nombres: string; apellidos: string };
};
type Proveedor = { id: number; ruc: string; razonSocial: string; procedencia: string };
type Producto = { id: number; nombre: string; categoria: string; unidad: string };

export default function MercaderiaPage() {
  const [items, setItems] = useState<Ingreso[]>([]);
  const [provs, setProvs] = useState<Proveedor[]>([]);
  const [prods, setProds] = useState<Producto[]>([]);
  const [coms, setComs] = useState<any[]>([]);
  const [form, setForm] = useState({ lote: "", proveedorId: "", productoId: "", comercianteId: "", cantidad: "", observaciones: "" });
  const [provForm, setProvForm] = useState({ ruc: "", razonSocial: "", procedencia: "" });
  const [prodForm, setProdForm] = useState({ nombre: "", categoria: "FRUTA", unidad: "KG" });
  const [showProv, setShowProv] = useState(false);
  const [showProd, setShowProd] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setItems(await api<Ingreso[]>("/mercaderia"));
    setProvs(await api<Proveedor[]>("/mercaderia/proveedores"));
    setProds(await api<Producto[]>("/mercaderia/productos"));
    setComs(await api("/comerciantes"));
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setMsg(null);
    try {
      await api("/mercaderia", { method: "POST", body: JSON.stringify({
        lote: form.lote,
        proveedorId: Number(form.proveedorId),
        productoId: Number(form.productoId),
        comercianteId: Number(form.comercianteId),
        cantidad: Number(form.cantidad),
        observaciones: form.observaciones || null,
      })});
      setForm({ lote: "", proveedorId: "", productoId: "", comercianteId: "", cantidad: "", observaciones: "" });
      setMsg("Ingreso registrado.");
      await load();
    } catch (e: any) { setErr(e.message); }
  }

  async function addProveedor(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setMsg(null);
    try {
      const nuevo = await api<Proveedor>("/mercaderia/proveedores", {
        method: "POST", body: JSON.stringify(provForm),
      });
      setProvForm({ ruc: "", razonSocial: "", procedencia: "" });
      setShowProv(false);
      await load();
      setForm((f) => ({ ...f, proveedorId: String(nuevo.id) }));
      setMsg(`Proveedor ${nuevo.razonSocial} registrado y seleccionado.`);
    } catch (e: any) { setErr(e.message); }
  }

  async function addProducto(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setMsg(null);
    try {
      const nuevo = await api<Producto>("/mercaderia/productos", {
        method: "POST", body: JSON.stringify(prodForm),
      });
      setProdForm({ nombre: "", categoria: "FRUTA", unidad: "KG" });
      setShowProd(false);
      await load();
      setForm((f) => ({ ...f, productoId: String(nuevo.id) }));
      setMsg(`Producto ${nuevo.nombre} registrado y seleccionado.`);
    } catch (e: any) { setErr(e.message); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ingreso de mercaderia (trazabilidad)</h1>

      {msg && <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-2 rounded">{msg}</div>}
      {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2 rounded">{err}</div>}

      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Proveedores</h2>
              <p className="text-xs text-gray-500">Origen autorizado de la mercaderia.</p>
            </div>
            <button onClick={() => setShowProv((s) => !s)} className="text-xs text-blue-600">
              {showProv ? "Cerrar" : "+ Nuevo proveedor"}
            </button>
          </div>
          {showProv && (
            <form onSubmit={addProveedor} className="mt-3 grid grid-cols-3 gap-2">
              <input className="border rounded p-2 text-sm" placeholder="RUC" value={provForm.ruc} onChange={(e) => setProvForm({ ...provForm, ruc: e.target.value })} required />
              <input className="border rounded p-2 text-sm" placeholder="Razon social" value={provForm.razonSocial} onChange={(e) => setProvForm({ ...provForm, razonSocial: e.target.value })} required />
              <input className="border rounded p-2 text-sm" placeholder="Procedencia" value={provForm.procedencia} onChange={(e) => setProvForm({ ...provForm, procedencia: e.target.value })} required />
              <button className="col-span-3 bg-blue-600 text-white rounded py-1 text-sm">Guardar proveedor</button>
            </form>
          )}
          <ul className="mt-3 text-sm divide-y max-h-40 overflow-y-auto">
            {provs.map((p) => (
              <li key={p.id} className="py-1">
                <span className="font-mono text-xs text-gray-500">{p.ruc}</span> · {p.razonSocial}
                <span className="text-xs text-gray-500"> ({p.procedencia})</span>
              </li>
            ))}
            {provs.length === 0 && <li className="text-gray-400 py-1">Sin proveedores registrados.</li>}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Productos</h2>
              <p className="text-xs text-gray-500">Catalogo de items comerciales.</p>
            </div>
            <button onClick={() => setShowProd((s) => !s)} className="text-xs text-blue-600">
              {showProd ? "Cerrar" : "+ Nuevo producto"}
            </button>
          </div>
          {showProd && (
            <form onSubmit={addProducto} className="mt-3 grid grid-cols-3 gap-2">
              <input className="border rounded p-2 text-sm" placeholder="Nombre" value={prodForm.nombre} onChange={(e) => setProdForm({ ...prodForm, nombre: e.target.value })} required />
              <select className="border rounded p-2 text-sm" value={prodForm.categoria} onChange={(e) => setProdForm({ ...prodForm, categoria: e.target.value })}>
                <option value="FRUTA">FRUTA</option>
                <option value="VERDURA">VERDURA</option>
                <option value="TUBERCULO">TUBERCULO</option>
              </select>
              <select className="border rounded p-2 text-sm" value={prodForm.unidad} onChange={(e) => setProdForm({ ...prodForm, unidad: e.target.value })}>
                <option value="KG">KG</option>
                <option value="SACO">SACO</option>
                <option value="JABA">JABA</option>
                <option value="BULTO">BULTO</option>
              </select>
              <button className="col-span-3 bg-blue-600 text-white rounded py-1 text-sm">Guardar producto</button>
            </form>
          )}
          <ul className="mt-3 text-sm divide-y max-h-40 overflow-y-auto">
            {prods.map((p) => (
              <li key={p.id} className="py-1">
                {p.nombre} <span className="text-xs text-gray-500">· {p.categoria} · {p.unidad}</span>
              </li>
            ))}
            {prods.length === 0 && <li className="text-gray-400 py-1">Sin productos registrados.</li>}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Registrar ingreso de lote</h2>
        <form onSubmit={submit} className="bg-white p-4 rounded shadow grid grid-cols-3 gap-3">
          <input className="border rounded p-2" placeholder="Lote (unico)" value={form.lote} onChange={(e) => setForm({ ...form, lote: e.target.value })} required />
          <select className="border rounded p-2" value={form.proveedorId} onChange={(e) => setForm({ ...form, proveedorId: e.target.value })} required>
            <option value="">Proveedor</option>
            {provs.map((p) => <option key={p.id} value={p.id}>{p.razonSocial} ({p.procedencia})</option>)}
          </select>
          <select className="border rounded p-2" value={form.productoId} onChange={(e) => setForm({ ...form, productoId: e.target.value })} required>
            <option value="">Producto</option>
            {prods.map((p) => <option key={p.id} value={p.id}>{p.nombre} ({p.unidad})</option>)}
          </select>
          <select className="border rounded p-2" value={form.comercianteId} onChange={(e) => setForm({ ...form, comercianteId: e.target.value })} required>
            <option value="">Comerciante destino</option>
            {coms.map((c: any) => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>)}
          </select>
          <input className="border rounded p-2" type="number" step="0.01" placeholder="Cantidad" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} required />
          <input className="border rounded p-2" placeholder="Observaciones (opcional)" value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
          <button className="bg-blue-600 text-white rounded col-span-3">Registrar ingreso</button>
        </form>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Ingresos registrados</h2>
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-100"><tr>
            <th className="text-left p-2">Fecha</th><th className="text-left p-2">Lote</th>
            <th className="text-left p-2">Proveedor</th><th className="text-left p-2">Producto</th>
            <th className="text-left p-2">Cant.</th><th className="text-left p-2">Comerciante</th>
          </tr></thead>
          <tbody>{items.map((i) => (
            <tr key={i.id} className="border-t">
              <td className="p-2 whitespace-nowrap">{new Date(i.fechaIngreso).toLocaleString()}</td>
              <td className="p-2 font-mono text-xs">{i.lote}</td>
              <td className="p-2">{i.proveedor.razonSocial}</td>
              <td className="p-2">{i.producto.nombre} ({i.producto.unidad})</td>
              <td className="p-2">{String(i.cantidad)}</td>
              <td className="p-2">{i.comerciante.nombres} {i.comerciante.apellidos}</td>
            </tr>))}
            {items.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-gray-500">Sin ingresos registrados.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
