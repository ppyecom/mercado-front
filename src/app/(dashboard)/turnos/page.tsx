"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Turno = {
  id: number; cantidad: number; montoTotal: string; estado: string;
  fechaHoraInicio: string; fechaHoraFin: string | null;
  estibador: { nombres: string; apellidos: string };
  comerciante: { nombres: string; apellidos: string };
  tarifa: { concepto: string; montoSoles: string };
};

export default function TurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [est, setEst] = useState<any[]>([]);
  const [com, setCom] = useState<any[]>([]);
  const [tar, setTar] = useState<any[]>([]);
  const [form, setForm] = useState({ estibadorId: "", comercianteId: "", tarifaId: "", cantidad: "1" });

  async function load() {
    setTurnos(await api<Turno[]>("/turnos"));
    setEst(await api("/estibadores"));
    setCom(await api("/comerciantes"));
    setTar(await api("/estibadores/tarifas/list"));
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await api("/turnos", { method: "POST", body: JSON.stringify({
      estibadorId: Number(form.estibadorId),
      comercianteId: Number(form.comercianteId),
      tarifaId: Number(form.tarifaId),
      cantidad: Number(form.cantidad),
      fechaHoraInicio: new Date().toISOString(),
    })});
    setForm({ estibadorId: "", comercianteId: "", tarifaId: "", cantidad: "1" });
    await load();
  }
  async function cerrar(id: number) {
    await api(`/turnos/${id}/cerrar`, { method: "PATCH", body: JSON.stringify({}) });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Turnos de estibaje</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid grid-cols-5 gap-3">
        <select className="border rounded p-2" value={form.estibadorId} onChange={(e) => setForm({ ...form, estibadorId: e.target.value })}>
          <option value="">Estibador</option>
          {est.map((e: any) => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
        </select>
        <select className="border rounded p-2" value={form.comercianteId} onChange={(e) => setForm({ ...form, comercianteId: e.target.value })}>
          <option value="">Comerciante</option>
          {com.map((c: any) => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>)}
        </select>
        <select className="border rounded p-2" value={form.tarifaId} onChange={(e) => setForm({ ...form, tarifaId: e.target.value })}>
          <option value="">Tarifa</option>
          {tar.map((t: any) => <option key={t.id} value={t.id}>{t.concepto} - S/. {t.montoSoles}</option>)}
        </select>
        <input className="border rounded p-2" type="number" min={1} value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
        <button className="bg-blue-600 text-white rounded">Abrir turno</button>
      </form>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100"><tr>
          <th className="text-left p-2">Estibador</th><th className="text-left p-2">Comerciante</th>
          <th className="text-left p-2">Tarifa</th><th className="text-left p-2">Cant.</th>
          <th className="text-left p-2">Monto</th><th className="text-left p-2">Estado</th>
          <th></th>
        </tr></thead>
        <tbody>{turnos.map((t) => (
          <tr key={t.id} className="border-t">
            <td className="p-2">{t.estibador.nombres} {t.estibador.apellidos}</td>
            <td className="p-2">{t.comerciante.nombres} {t.comerciante.apellidos}</td>
            <td className="p-2">{t.tarifa.concepto}</td>
            <td className="p-2">{t.cantidad}</td>
            <td className="p-2">S/. {String(t.montoTotal)}</td>
            <td className="p-2">{t.estado}</td>
            <td className="p-2">{t.estado === "PENDIENTE" && (
              <button onClick={() => cerrar(t.id)} className="text-blue-600">Cerrar</button>
            )}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}
