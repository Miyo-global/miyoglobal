"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "../icons";
import { useUi } from "../ui";
import { deleteMediaAction, uploadMediaAction } from "./actions";

export type MediaItem = { id: number; url: string; alt: string; width: number; height: number };

export function MediaPicker({ items, onPick, canDelete = false }: { items: MediaItem[]; onPick?: (m: MediaItem) => void; canDelete?: boolean }) {
  const ui = useUi();
  const [list, setList] = useState(items);
  const [error, setError] = useState("");
  const router = useRouter();
  const [pending, start] = useTransition();
  const [op, setOp] = useState<number | "upload">("upload");
  const idp = onPick ? "pick" : "lib";

  function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setError("");
    setOp("upload");
    start(async () => {
      const res = await uploadMediaAction(data);
      if (!res.ok) return setError(res.error);
      setList((l) => [res.media, ...l]);
      form.reset();
      ui.toast("Image uploaded");
      onPick?.(res.media);
      router.refresh();
    });
  }

  async function remove(m: MediaItem) {
    if (!(await ui.confirm("Delete this image permanently? This cannot be undone."))) return;
    setError("");
    setOp(m.id);
    start(async () => {
      const res = await deleteMediaAction(m.id);
      if (!res.ok) return setError(res.error);
      setList((l) => l.filter((x) => x.id !== m.id));
      ui.toast("Image deleted");
      router.refresh();
    });
  }

  return (
    <div className="media">
      <form onSubmit={upload} className="upload">
        <div className="field">
          <label htmlFor={`${idp}-file`}>Image (JPEG, PNG, WebP or AVIF, min 1200px wide, max 4MB)</label>
          <input id={`${idp}-file`} name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required />
        </div>
        <div className="field">
          <label htmlFor={`${idp}-alt`}>Alt text (8-20 words describing the subject and context)</label>
          <textarea id={`${idp}-alt`} name="alt" required maxLength={200} rows={2} />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn primary" disabled={pending}><Icon name="upload" size={16} />{pending && op === "upload" ? "Uploading…" : "Upload"}</button>
      </form>
      {list.length ? (
        <div className="media-grid">
          {list.map((m) => (
            <figure key={m.id}>
              <Image src={m.url} alt={m.alt} width={320} height={240} unoptimized />
              <figcaption>
                <span className="small muted" title={m.alt}>{m.alt}</span>
                <span className="small muted">{m.width}×{m.height}</span>
              </figcaption>
              <div className="row">
                {onPick && (
                  <button type="button" className="btn secondary sm" onClick={() => onPick(m)}>
                    Use this image
                  </button>
                )}
                {canDelete && (
                  <button type="button" className="btn danger-ghost sm" disabled={pending} onClick={() => remove(m)}>
                    {pending && op === m.id ? "Deleting…" : "Delete"}
                  </button>
                )}
              </div>
            </figure>
          ))}
        </div>
      ) : (
        <div className="empty"><p><b>No images yet.</b> Upload one above.</p></div>
      )}
    </div>
  );
}
