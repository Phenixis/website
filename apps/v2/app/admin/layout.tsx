import "./admin.css";
import { AdminShell } from "./_components/AdminShell";

export const metadata = {
  title: "Back-office · Maxime Duhamel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
