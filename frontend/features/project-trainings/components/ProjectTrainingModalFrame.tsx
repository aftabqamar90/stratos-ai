"use client";

import type { ReactNode } from "react";

type ProjectTrainingModalFrameProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
};

export function ProjectTrainingModalFrame({ title, onClose, children, footer }: ProjectTrainingModalFrameProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-training-modal-title"
        className="relative z-10 w-full max-w-md rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xl"
      >
        <h2 id="project-training-modal-title" className="mb-4 text-lg font-semibold text-[var(--admin-text)]">
          {title}
        </h2>
        {children}
        <div className="mt-6 flex justify-end gap-2">{footer}</div>
      </div>
    </div>
  );
}
