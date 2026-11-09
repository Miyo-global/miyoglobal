"use client";

import { useState, useTransition } from "react";
import { useUi } from "../../ui";
import { createUserAction } from "../actions";

export function NewUserForm() {
  const ui = useUi();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setError("");
    start(async () => {
      const res = await createUserAction(data);
      if (!res.ok) return setError(res.error);
      ui.toast("User created.");
      form.reset();
    });
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add user</h2>
      <div className="grid-2">
        <div className="field"><label htmlFor="nu-name">Name</label><input id="nu-name" name="name" required maxLength={80} autoComplete="off" /></div>
        <div className="field"><label htmlFor="nu-email">Email</label><input id="nu-email" name="email" type="email" required maxLength={254} autoComplete="off" /></div>
        <div className="field"><label htmlFor="nu-pass">Temporary password (12+ characters)</label><input id="nu-pass" name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></div>
        <div className="field">
          <label htmlFor="nu-role">Role</label>
          <select id="nu-role" name="role" defaultValue="editor">
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn primary" disabled={pending}>Create user</button>
    </form>
  );
}
