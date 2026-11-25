import { cx } from "./cx";

const control =
  "w-full min-h-12 rounded-control border border-rule-strong bg-surface px-4 py-3 text-body text-ink placeholder:text-muted transition-colors duration-150 ease-brand hover:border-ink focus:border-ink focus:outline-2 focus:outline-offset-0 focus:outline-accent-text aria-invalid:border-error";

type Base = { id: string; label: string; hint?: string; error?: string; optional?: boolean; className?: string };

function Wrap({ id, label, hint, error, optional, className, children }: Base & { children: React.ReactNode }) {
  return (
    <div className={cx("grid content-start gap-2", className)}>
      <label htmlFor={id} className="text-small font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-small text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-small text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = ({ id, hint, error }: Base) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

/** Labelled input with hint and error wiring (aria-describedby, aria-invalid). */
export function Field(props: Base & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id">) {
  const { id, label, hint, error, optional, className, ...input } = props;
  return (
    <Wrap {...{ id, label, hint, error, optional, className }}>
      <input id={id} className={control} aria-invalid={error ? true : undefined} aria-describedby={describedBy(props)} required={!optional} {...input} />
    </Wrap>
  );
}

export function TextArea(props: Base & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id">) {
  const { id, label, hint, error, optional, className, ...input } = props;
  return (
    <Wrap {...{ id, label, hint, error, optional, className }}>
      <textarea id={id} className={cx(control, "min-h-32 resize-y")} aria-invalid={error ? true : undefined} aria-describedby={describedBy(props)} required={!optional} {...input} />
    </Wrap>
  );
}

export function Select(props: Base & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> & { children: React.ReactNode }) {
  const { id, label, hint, error, optional, className, children, ...input } = props;
  return (
    <Wrap {...{ id, label, hint, error, optional, className }}>
      <select id={id} className={control} aria-invalid={error ? true : undefined} aria-describedby={describedBy(props)} required={!optional} {...input}>
        {children}
      </select>
    </Wrap>
  );
}

/** Checkbox with its label to the right, for consent lines. */
export function Check({ id, children, className, ...input }: { id: string; children: React.ReactNode; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type">) {
  return (
    <div className={cx("flex items-start gap-3 text-small text-muted", className)}>
      <input id={id} type="checkbox" className="mt-1 size-4 shrink-0 accent-ink" {...input} />
      <label htmlFor={id}>{children}</label>
    </div>
  );
}
