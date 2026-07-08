import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "MIDFIELDER platform administration — stadium management, fan oversight, and AI analytics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar variant="admin" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar variant="admin" />
        <main
          id="admin-main"
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
