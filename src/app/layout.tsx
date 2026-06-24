import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SGM La Parada",
  description: "Sistema de Gestion y Formalizacion del Mercado Mayorista de La Parada",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <footer className="text-center text-xs text-gray-500 py-6">
          <a href="/reportar" className="underline">Reportar incidencia (publico, sin login)</a>
        </footer>
      </body>
    </html>
  );
}
