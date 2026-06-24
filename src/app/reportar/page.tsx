"use client";
import { useState } from "react";
import Link from "next/link";

const TIPOS = [
  { v: "SEGURIDAD", label: "Seguridad (cupos, amenazas, violencia)" },
  { v: "INFRAESTRUCTURA", label: "Infraestructura (techos, pisos, energia)" },
  { v: "SANITARIO", label: "Sanitario (residuos, plagas, limpieza)" },
  { v: "OTRO", label: "Otro" },
];

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export default function ReportarPage() {
  const [tipo, setTipo] = useState("SEGURIDAD");
  const [descripcion, setDescripcion] = useState("");
  const [reportadoPor, setReportadoPor] = useState("");
  const [sent, setSent] = useState<{ id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/incidencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          descripcion,
          reportadoPor: reportadoPor.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setSent({ id: data.id });
      setDescripcion("");
      setReportadoPor("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-blue-600">&larr; Inicio</Link>
        <h1 className="text-2xl font-bold">Reportar incidencia</h1>

        <p className="text-sm text-gray-600">
          Puede reportar de forma anonima. El sistema registra la fecha y la
          categoria; la administracion municipal podra derivar el caso a la
          autoridad competente (PNP, Ministerio Publico, Defensa Civil, etc.).
          <br />
          <strong>Este formulario no protege ni interviene</strong>; si su vida
          o integridad estan en riesgo inmediato, llame al <strong>105</strong>.
        </p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <div className="font-semibold text-green-800">Reporte registrado #{sent.id}</div>
            <p className="text-sm text-green-700 mt-1">
              Gracias. La administracion del mercado revisara su reporte.
            </p>
            <button onClick={() => setSent(null)} className="mt-3 text-sm text-blue-600">
              Enviar otro reporte
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-4">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div>
              <label className="block text-sm mb-1">Tipo de incidencia</label>
              <select
                className="w-full border rounded p-2"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                {TIPOS.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Descripcion</label>
              <textarea
                className="w-full border rounded p-2 min-h-[140px]"
                placeholder="Cuente que ocurrio, donde y cuando. No incluya datos que lo identifiquen si no lo desea."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                minLength={10}
                maxLength={2000}
                required
              />
              <div className="text-xs text-gray-500 mt-1">{descripcion.length}/2000</div>
            </div>
            <div>
              <label className="block text-sm mb-1">
                Nombre o referencia (opcional)
              </label>
              <input
                className="w-full border rounded p-2"
                placeholder="Si no completa este campo, el reporte queda como Anonimo"
                value={reportadoPor}
                onChange={(e) => setReportadoPor(e.target.value)}
                maxLength={120}
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar reporte"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
