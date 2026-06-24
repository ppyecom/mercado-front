import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </ProtectedRoute>
  );
}
