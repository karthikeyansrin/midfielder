import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Fan Dashboard",
  description: "Your personalised MIDFIELDER fan hub — live matches, rewards, and AI insights.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar variant="dashboard" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar variant="dashboard" />
        <main
          id="dashboard-main"
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
