import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Fan Dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
