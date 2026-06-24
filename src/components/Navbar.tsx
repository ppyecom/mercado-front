"use client";
import Link from "next/link";
import { logout, getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

const items = [
  ["/dashboard", "Dashboard"],
  ["/comerciantes", "Comerciantes"],
  ["/puestos", "Puestos"],
  ["/estibadores", "Estibadores"],
  ["/turnos", "Turnos"],
  ["/mercaderia", "Mercaderia"],
];

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => setUser(getUser()), []);
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="font-bold">SGM La Parada</div>
        <nav className="flex gap-4 text-sm">
          {items.map(([href, label]) => (
            <Link key={href} href={href} className="hover:underline">{label}</Link>
          ))}
        </nav>
        <div className="text-sm flex items-center gap-3">
          <span className="text-gray-600">{user?.email}</span>
          <button onClick={logout} className="px-3 py-1 bg-gray-800 text-white rounded">Salir</button>
        </div>
      </div>
    </header>
  );
}
