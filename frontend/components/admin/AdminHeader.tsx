import type { ReactNode } from "react";

type AdminHeaderProps = {
  title: string;
  actions?: ReactNode;
};

export function AdminHeader({ title, actions }: AdminHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-6 py-4">
      <h1 className="text-lg font-semibold text-[var(--admin-text)]">{title}</h1>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
