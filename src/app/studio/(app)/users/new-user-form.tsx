"use client";

import { useState, useTransition } from "react";
import { createUserAction } from "../actions";

export function NewUserForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    start(async () => {
      const res = await createUserAction(data);
      setMsg(res.ok ? { ok: true, text: "User created. They set up 2FA on first sign-in." } : { ok: false, text: res.error });
      if (res.ok) form.reset();
    });
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add user</h2>
      <label>Name<input name="name" required maxLength={80} /></label>
      <label>Email<input name="email" type="email" required maxLength={254} /></label>
      <label>Temporary password (12+ characters)<input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></label>
      <label>
        Role
        <select name="role" defaultValue="editor">
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
      </label>
      {msg && <p className={msg.ok ? "ok" : "error"} role="status">{msg.text}</p>}
      <button className="btn" disabled={pending}>Create user</button>
    </form>
  );
}
