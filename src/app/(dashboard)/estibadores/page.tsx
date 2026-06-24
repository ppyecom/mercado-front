"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Est = { id: number; dni: string; nombres: string; apellidos: string; telefono: string; estado: string };
type Tar = { id: number; concepto: string; montoSoles: string; vigenteDesde: string };

export default function EstibadoresPage() {
  const [items, setItems] = useState<Est[]>([]);
  const [tarifas, setTarifas] = useState<Tar[]>([]);
  const [form, setForm] = useState({ dni: "", nombres: "", apellidos: "", telefono: "" });
  const [tf, setTf] = useState({ concepto: "", montoSoles: "", vigenteDesde: "2026-01-01" });

  async function load() {
    setItems(await api<Est[]>("/estibadores"));
    setTarifas(await api<Tar[]>("/estibadores/tarifas/list"));
  }
  useEffect(() => { load(); }, []);

  async function addEst(e: React.FormEvent) {
    e.preventDefault();
    await api("/estibadores", { method: "POST", body: JSON.stringify(form) });
    setForm({ dni: "", nombres: "", apellidos: "", telefono: "" });
    await load();
  }
  async function addTarifa(e: React.FormEvent) {
    e.preventDefault();
    await api("/estibadores/tarifas", { method: "POST", body: JSON.stringify({
      concepto: tf.concepto, montoSoles: Number(tf.montoSoles), vigenteDesde: tf.vigenteDesde,
    })});
    setTf({ concepto: "", montoSoles: "", vigenteDesde: "2026-01-01" });
    await load();
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Estibadores</h1>
        <form onSubmit={addEst} className="bg-white p-4 rounded shadow grid grid-cols-5 gap-3 mt-3">
          {(["dni","nombres","apellidos","telefono"] as const).map((k) => (
            <input key={k} placeholder={k.toUpperCase()} className="border rounded p-2"
              value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          ))}
          <button className="bg-blue-600 text-white rounded">Registrar</button>
        </form>
        <table className="w-full mt-4 bg-white rounded shadow text-sm">
          <thead className="bg-gray-100"><tr>
            <th className="text-left p-2">DNI</th><th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Tel.</th><th className="text-left p-2">Estado</th>
          </tr></thead>
          <tbody>{items.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.dni}</td><td className="p-2">{e.nombres} {e.apellidos}</td>
              <td className="p-2">{e.telefono}</td><td className="p-2">{e.estado}</td>
            </tr>))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-bold">Tarifario digital de estibaje</h2>
        <p className="text-sm text-gray-600">Sustituye el cobro informal de cupos por una tarifa publica auditable.</p>
        <form onSubmit={addTarifa} className="bg-white p-4 rounded shadow grid grid-cols-4 gap-3 mt-3">
          <input className="border rounded p-2" placeholder="Concepto (CARGA_SACO)" value={tf.concepto} onChange={(e) => setTf({ ...tf, concepto: e.target.value })} />
          <input className="border rounded p-2" placeholder="Monto S/." value={tf.montoSoles} onChange={(e) => setTf({ ...tf, montoSoles: e.target.value })} />
          <input className="border rounded p-2" type="date" value={tf.vigenteDesde} onChange={(e) => setTf({ ...tf, vigenteDesde: e.target.value })} />
          <button className="bg-blue-600 text-white rounded">Crear tarifa</button>
        </form>
        <table className="w-full mt-4 bg-white rounded shadow text-sm">
          <thead className="bg-gray-100"><tr>
            <th className="text-left p-2">Concepto</th><th className="text-left p-2">Monto S/.</th>
            <th className="text-left p-2">Vigente desde</th>
          </tr></thead>
          <tbody>{tarifas.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.concepto}</td><td className="p-2">{String(t.montoSoles)}</td>
              <td className="p-2">{new Date(t.vigenteDesde).toLocaleDateString()}</td>
            </tr>))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
