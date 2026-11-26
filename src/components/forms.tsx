"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { adminLogIn, logIn, signUp, type FormState } from "@/app/actions";
import { Icon } from "./ui";

function Field({ id, label, type = "text", error, hint, ...rest }: { id: string; label: string; type?: string; error?: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} type={type} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} {...rest} />
      {hint && !error && <p id={`${id}-hint`} className="hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
    </div>
  );
}

function Password({ error, id = "password", label = "Password", autoComplete = "current-password", hint }: { error?: string; id?: string; label?: string; autoComplete?: string; hint?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <div className="row between">
        <label htmlFor={id}>{label}</label>
        <button type="button" className="btn-link small" onClick={() => setShow(!show)} aria-pressed={show}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <input id={id} name={id} type={show ? "text" : "password"} autoComplete={autoComplete} required aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} />
      {hint && !error && <p id={`${id}-hint`} className="hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
    </div>
  );
}

const err = (s: FormState, f: string) => (s.field === f ? s.error : undefined);

export function LogInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(logIn, {});
  return (
    <form action={action} className="stack" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <Field id="email" label="Work or personal email" type="email" autoComplete="email" required error={err(state, "email")} />
      <Password error={err(state, "password")} />
      <div className="row between small">
        <label className="check" style={{ padding: 0 }}>
          <input type="checkbox" name="remember" /> Keep me signed in
        </label>
        <Link href="/auth/forgot">Forgot password?</Link>
      </div>
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}

export function SignUpForm({ as }: { as: "candidate" | "company" }) {
  const [state, action, pending] = useActionState(signUp, {});
  return (
    <form action={action} className="stack" noValidate>
      <input type="hidden" name="as" value={as} />
      <Field id="name" label="Full name" autoComplete="name" required error={err(state, "name")} hint={as === "candidate" ? "Companies see only your first initial until you accept a match." : undefined} />
      <Field id="email" label={as === "company" ? "Work email" : "Email"} type="email" autoComplete="email" required error={err(state, "email")} hint={as === "company" ? "We verify your company from this domain." : undefined} />
      {as === "company" && <Field id="company" label="Company name" autoComplete="organization" />}
      <Password id="password" label="Create a password" autoComplete="new-password" hint="At least 8 characters." error={err(state, "password")} />
      <label className="check small">
        <input type="checkbox" name="terms" aria-invalid={state.field === "terms" ? true : undefined} />
        <span>
          I agree to the <Link href="/legal/terms">terms</Link> and have read the <Link href="/legal/privacy">privacy notice</Link>.
        </span>
      </label>
      {state.field === "terms" && <p className="field-error">{state.error}</p>}
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export function AdminLogInForm() {
  const [state, action, pending] = useActionState(adminLogIn, {});
  return (
    <div className="stack" style={{ ["--gap" as string]: "24px" }}>
      <form action={action} className="stack" noValidate>
        <Field id="email" label="Staff email" type="email" autoComplete="username" required error={err(state, "email")} />
        <Password error={err(state, "password")} />
        <Field id="code" label="Authenticator code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" hint="6 digits from your authenticator app." error={err(state, "code")} />
        <button className="btn btn-primary btn-block" disabled={pending}>
          <Icon name="lock" /> {pending ? "Verifying…" : "Sign in securely"}
        </button>
      </form>
      <div className="row" style={{ ["--gap" as string]: "12px", flexWrap: "nowrap" }}>
        <hr className="hr" style={{ flex: 1 }} />
        <span className="label">or</span>
        <hr className="hr" style={{ flex: 1 }} />
      </div>
      <form action={action}>
        <input type="hidden" name="passkey" value="1" />
        <button className="btn btn-block">
          <Icon name="key" /> Use a passkey
        </button>
      </form>
    </div>
  );
}
