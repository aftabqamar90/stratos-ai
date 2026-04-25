"use client";

type ProjectFormProps = {
  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
  id?: string;
};

export function ProjectForm({ value, onChange, disabled, id }: ProjectFormProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id ?? "project-name"} className="block text-sm font-medium text-[var(--admin-text-muted)]">
        Name
      </label>
      <input
        id={id ?? "project-name"}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)] disabled:opacity-50"
        placeholder="Unique project name"
        autoComplete="off"
      />
    </div>
  );
}
