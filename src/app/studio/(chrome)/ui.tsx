"use client";

import { unstable_rethrow } from "next/navigation";
import { createContext, useCallback, useContext, useRef, useState, useTransition } from "react";

type Toast = { id: number; text: string; kind: "ok" | "error" };
type Ask = { text: string; confirmLabel: string; resolve: (ok: boolean) => void };
type Ui = { toast: (text: string, kind?: Toast["kind"]) => void; confirm: (text: string, confirmLabel?: string) => Promise<boolean> };

const UiContext = createContext<Ui>({ toast: () => {}, confirm: async (text) => window.confirm(text) });

export const useUi = () => useContext(UiContext);

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ask, setAsk] = useState<Ask | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const seq = useRef(0);

  const toast = useCallback((text: string, kind: Toast["kind"] = "ok") => {
    const id = ++seq.current;
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const confirm = useCallback(
    (text: string, confirmLabel = "Delete") =>
      new Promise<boolean>((resolve) => {
        setAsk({ text, confirmLabel, resolve });
        requestAnimationFrame(() => dialog.current?.showModal());
      }),
    [],
  );

  const close = (ok: boolean) => {
    ask?.resolve(ok);
    dialog.current?.close();
    setAsk(null);
  };

  return (
    <UiContext.Provider value={{ toast, confirm }}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`}>{t.text}</div>
        ))}
      </div>
      <dialog ref={dialog} className="confirm" aria-labelledby="confirm-text" onCancel={() => close(false)}>
        <p id="confirm-text">{ask?.text}</p>
        <div className="row end">
          <button type="button" className="btn secondary" onClick={() => close(false)}>Cancel</button>
          <button type="button" className="btn danger" onClick={() => close(true)} autoFocus>{ask?.confirmLabel ?? "Delete"}</button>
        </div>
      </dialog>
    </UiContext.Provider>
  );
}

/** Wraps a server-action form with an optional confirm dialog and success/error toasts. */
export function ActionForm({
  action,
  success,
  confirm,
  confirmLabel,
  reset,
  className,
  children,
}: {
  action: (form: FormData) => Promise<unknown>;
  success?: string;
  confirm?: string;
  confirmLabel?: string;
  reset?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ui = useUi();
  const [pending, start] = useTransition();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (confirm && !(await ui.confirm(confirm, confirmLabel))) return;
    start(async () => {
      try {
        await action(data);
        if (success) ui.toast(success);
        if (reset) form.reset();
      } catch (err) {
        unstable_rethrow(err);
        ui.toast("Something went wrong. Check the fields and try again.", "error");
      }
    });
  }

  return (
    <form className={className} onSubmit={submit} aria-busy={pending}>
      <fieldset className="bare" disabled={pending}>{children}</fieldset>
    </form>
  );
}
