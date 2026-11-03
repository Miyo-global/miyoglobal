"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { uploadMediaAction } from "./actions";

export type MediaItem = { id: number; url: string; alt: string; width: number; height: number };

export function MediaPicker({ items, onPick }: { items: MediaItem[]; onPick?: (m: MediaItem) => void }) {
  const [list, setList] = useState(items);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setError("");
    start(async () => {
      const res = await uploadMediaAction(data);
      if (!res.ok) return setError(res.error);
      setList([res.media, ...list]);
      form.reset();
      onPick?.(res.media);
    });
  }

  return (
    <div>
      <form onSubmit={upload}>
        <label>
          Image (JPEG, PNG, WebP or AVIF, min 1200px wide, max 10MB)
          <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required />
        </label>
        <label>
          Alt text (8-20 words describing the subject and context)
          <textarea name="alt" required maxLength={200} rows={2} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={pending}>{pending ? "Uploading…" : "Upload"}</button>
      </form>
      <div className="media-grid" style={{ marginTop: 16 }}>
        {list.map((m) => (
          <figure key={m.id}>
            <Image src={m.url} alt={m.alt} width={320} height={240} unoptimized />
            {onPick && (
              <button type="button" className="link" onClick={() => onPick(m)}>
                Use this image
              </button>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
