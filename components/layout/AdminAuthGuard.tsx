"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Don't guard the login page itself
    if (pathname === "/admin/login") {
      setIsAuthed(true);
      return;
    }

    const authed = localStorage.getItem("midfielder_admin_auth");
    if (authed === "true") {
      setIsAuthed(true);
    } else {
      router.push("/admin/login");
    }
  }, [router, pathname]);

  if (!isAuthed) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-base)] absolute inset-0 z-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border-default)] border-t-[var(--accent-red)]" />
      </div>
    );
  }

  return <>{children}</>;
}
