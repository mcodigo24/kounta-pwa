"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

interface ShellProps {
  title: string;
  onDismiss: () => void;
  children: ReactNode;
  actions: ReactNode;
}

function DialogShell({ title, onDismiss, children, actions }: ShellProps) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onDismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6"
      onPointerDown={(e) => e.target === e.currentTarget && onDismiss()}
    >
      <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-sm rounded-[28px] bg-variant p-6 shadow-2xl">
        <h2 id={titleId} className="text-2xl leading-8 font-normal text-strong">
          {title}
        </h2>
        <div className="mt-4 text-sm leading-5 text-muted">{children}</div>
        <div className="mt-6 flex justify-end gap-2">{actions}</div>
      </div>
    </div>
  );
}

const TextButton = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
  <button type="button" onClick={onClick} className="rounded-full px-3 py-2 text-sm font-medium text-primary active:bg-primary/15">
    {children}
  </button>
);

interface ConfirmProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: ConfirmProps) {
  return (
    <DialogShell
      title={title}
      onDismiss={onCancel}
      actions={
        <>
          <TextButton onClick={onCancel}>Cancelar</TextButton>
          <TextButton onClick={onConfirm}>{confirmLabel}</TextButton>
        </>
      }
    >
      {message}
    </DialogShell>
  );
}

interface TextInputProps {
  title: string;
  initialValue: string;
  placeholder: string;
  maxLength: number;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export function TextInputDialog({ title, initialValue, placeholder, maxLength, onSave, onCancel }: TextInputProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <DialogShell
      title={title}
      onDismiss={onCancel}
      actions={
        <>
          <TextButton onClick={onCancel}>Cancelar</TextButton>
          <TextButton onClick={() => onSave(value)}>Guardar</TextButton>
        </>
      }
    >
      <input
        autoFocus
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSave(value)}
        className="w-full rounded-lg border border-line-focus bg-transparent px-3 py-3 text-base text-strong outline-none placeholder:text-muted focus:border-primary"
      />
    </DialogShell>
  );
}
