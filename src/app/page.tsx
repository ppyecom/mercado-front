import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">SGM La Parada</h1>
        <p className="text-gray-600">
          Sistema de Gestion y Formalizacion del Mercado Mayorista de La Parada (La Victoria, Lima).
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded">
            Ingresar (admin)
          </Link>
          <Link href="/reportar" className="inline-block px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded">
            Reportar incidencia
          </Link>
        </div>
      </div>
    </main>
  );
}
