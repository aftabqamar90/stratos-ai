"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNav, isNavActive } from "../../config/adminNav";

export function AdminSidebar() {
  const pathname = usePathname() || "/";

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="border-b border-[var(--admin-border)] px-4 py-5">
        <span className="text-sm font-semibold tracking-tight text-[var(--admin-text)]">Stratos AI</span>
        <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">Admin</p>
      </div>
      <nav className="flex flex-col gap-0.5 p-2">
        {adminNav.map((item) => {
          const active = isNavActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--admin-surface-hover)] text-[var(--admin-text)]"
                  : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
