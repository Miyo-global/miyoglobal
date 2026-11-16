"use client";

import { unstable_rethrow, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";

type Toast = { id: number; text: string; kind: "ok" | "error" };
type Ask = { text: string; confirmLabel: string; value?: string; resolve: (value: string | null) => void };
type Ui = {
  toast: (text: string, kind?: Toast["kind"]) => void;
  confirm: (text: string, confirmLabel?: string) => Promise<boolean>;
  prompt: (text: string, value?: string, confirmLabel?: string) => Promise<string | null>;
};

const UiContext = createContext<Ui>({ toast: () => {}, confirm: async (text) => window.confirm(text), prompt: async (text, value) => window.prompt(text, value) });

export const useUi = () => useContext(UiContext);

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ask, setAsk] = useState<Ask | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const seq = useRef(0);

  const toast = useCallback((text: string, kind: Toast["kind"] = "ok") => {
    const id = ++seq.current;
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const open = useCallback(
    (a: Omit<Ask, "resolve">) =>
      new Promise<string | null>((resolve) => {
        setAsk({ ...a, resolve });
        requestAnimationFrame(() => {
          dialog.current?.showModal();
          input.current?.select();
        });
      }),
    [],
  );
  const confirm = useCallback((text: string, confirmLabel = "Delete") => open({ text, confirmLabel }).then((v) => v !== null), [open]);
  const prompt = useCallback((text: string, value = "", confirmLabel = "Save") => open({ text, confirmLabel, value }), [open]);

  const close = (ok: boolean) => {
    ask?.resolve(ok ? (input.current?.value ?? "") : null);
    dialog.current?.close();
    setAsk(null);
  };
  const asking = ask?.value !== undefined;

  return (
    <UiContext.Provider value={{ toast, confirm, prompt }}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`}>{t.text}</div>
        ))}
      </div>
      <dialog ref={dialog} className="confirm" aria-labelledby="confirm-text" onCancel={() => close(false)}>
        <form onSubmit={(e) => { e.preventDefault(); close(true); }}>
          <p id="confirm-text">{ask?.text}</p>
          {asking && <input ref={input} className="confirm-input" defaultValue={ask?.value} aria-labelledby="confirm-text" />}
          <div className="row end">
            <button type="button" className="btn secondary" onClick={() => close(false)}>Cancel</button>
            <button type="submit" className={asking ? "btn primary" : "btn danger"} autoFocus={!asking}>{ask?.confirmLabel ?? "Delete"}</button>
          </div>
        </form>
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
  const router = useRouter();
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
        router.refresh();
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

/** Submit button for a plain `<form action={serverAction}>` that shows a pending label while the action runs. */
export function PendingButton({ className, pendingLabel, children }: { className?: string; pendingLabel: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
