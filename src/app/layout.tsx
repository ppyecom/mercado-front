import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SGM La Parada",
  description: "Sistema de Gestion y Formalizacion del Mercado Mayorista de La Parada",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
