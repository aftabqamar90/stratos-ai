"use client";

type ProjectTrainingFormProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function ProjectTrainingForm({ id, value, onChange, disabled = false }: ProjectTrainingFormProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--admin-text)]">
        Training name
      </label>
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter training name"
        className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none ring-[var(--admin-accent)]/40 transition focus:ring"
      />
    </div>
  );
}
