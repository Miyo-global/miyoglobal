"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { Doc } from "@/lib/content";
import { checkHealth } from "@/lib/health";
import type { Intent, PostInput } from "@/lib/post-schema";
import { parseCustomJsonLd, titleFor } from "@/lib/seo";
import { slugify } from "@/lib/slug";
import { checkLinksAction, deletePostAction, savePostAction } from "../../actions";
import { MediaPicker, type MediaItem } from "../../media-picker";

type Opt = { id: number; name: string };
type Props = {
  id: number;
  status: string;
  wasPublished: boolean;
  isAdmin: boolean;
  canDelete: boolean;
  initial: PostInput;
  authors: Opt[];
  categories: Opt[];
  tags: Opt[];
  media: MediaItem[];
  siblings: { title: string; slug: string; cluster: string }[];
};

const BodyImage = Image.extend({
  addAttributes() {
    return { ...this.parent?.(), width: { default: null }, height: { default: null } };
  },
});

const SERVICES = [
  { label: "Staffing solutions", href: "/staffing-solutions" },
  { label: "Digital solutions", href: "/digital-solutions" },
  { label: "Contact", href: "/contact" },
];

export function PostEditor(props: Props) {
  const [form, setForm] = useState<PostInput>(props.initial);
  const [status, setStatus] = useState(props.status);
  const [media, setMedia] = useState(props.media);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [broken, setBroken] = useState<string[] | null>(null);
  const [picker, setPicker] = useState<"cover" | "body" | null>(null);
  const [pending, start] = useTransition();
  const first = useRef(true);
  const live = status === "published" || status === "archived";

  const set = useCallback(<K extends keyof PostInput>(key: K, value: PostInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: false },
        underline: false,
        strike: false,
      }),
      BodyImage,
    ],
    content: props.initial.content,
    editorProps: { attributes: { class: "tiptap", "aria-label": "Post body" } },
    onUpdate: ({ editor: ed }) => set("content", ed.getJSON() as Record<string, unknown>),
  });

  const cover = media.find((m) => m.id === form.coverMediaId) ?? null;
  const issues = useMemo(
    () =>
      checkHealth({
        title: form.title,
        slug: form.slug,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        focusKeyword: form.focusKeyword,
        quickAnswer: form.quickAnswer,
        doc: form.content as Doc,
        coverAlt: cover?.alt ?? null,
        hasCover: !!cover,
      }),
    [form, cover],
  );
  const jsonLdError = form.customJsonLd ? (() => { const r = parseCustomJsonLd(form.customJsonLd); return r.ok ? "" : r.error; })() : "";

  const submit = useCallback(
    (intent: Intent, silent = false) =>
      start(async () => {
        setError("");
        const res = await savePostAction(props.id, JSON.stringify(form), intent);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        setStatus(res.status);
        setDirty(false);
        if (res.slug !== form.slug) setForm((f) => ({ ...f, slug: res.slug }));
        setNote(silent ? `Autosaved ${new Date().toLocaleTimeString()}` : `Saved as ${res.status}`);
      }),
    [form, props.id],
  );

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!dirty || live) return;
    const t = setTimeout(() => submit("save", true), 2000);
    return () => clearTimeout(t);
  }, [form, dirty, live, submit]);

  const link = (title: string, href: string) =>
    editor?.chain().focus().insertContent({ type: "text", text: title, marks: [{ type: "link", attrs: { href } }] }).run();

  const pick = (m: MediaItem) => {
    setMedia((list) => (list.some((x) => x.id === m.id) ? list : [m, ...list]));
    if (picker === "cover") set("coverMediaId", m.id);
    if (picker === "body") editor?.chain().focus().setImage({ src: m.url, alt: m.alt, width: m.width, height: m.height } as never).run();
    setPicker(null);
  };

  const btn = (label: string, active: boolean, on: () => void) => (
    <button type="button" className={active ? "on" : ""} onMouseDown={(e) => e.preventDefault()} onClick={on}>{label}</button>
  );

  const clusters = [...new Set(props.siblings.map((s) => s.cluster).filter(Boolean))];
  const related = props.siblings.filter((s) => form.cluster && s.cluster === form.cluster).slice(0, 6);
  const errors = issues.filter((i) => i.level === "error");

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Edit post <span className={`pill ${status}`}>{status}</span></h1>
        <span className="muted" role="status">{pending ? "Saving…" : dirty ? (live ? "Unsaved changes" : "Unsaved") : note}</span>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="editor-wrap">
        <div>
          <div className="card">
            <label>
              Title (H1)
              <input value={form.title} maxLength={120} onChange={(e) => set("title", e.target.value)} placeholder="Answer-first headline with the primary keyword" />
            </label>
            <label>
              Quick answer / TL;DR
              <textarea value={form.quickAnswer} maxLength={600} onChange={(e) => set("quickAnswer", e.target.value)} />
            </label>
            <div className="toolbar" role="toolbar" aria-label="Formatting">
              {btn("B", !!editor?.isActive("bold"), () => editor?.chain().focus().toggleBold().run())}
              {btn("I", !!editor?.isActive("italic"), () => editor?.chain().focus().toggleItalic().run())}
              {btn("H2", !!editor?.isActive("heading", { level: 2 }), () => editor?.chain().focus().toggleHeading({ level: 2 }).run())}
              {btn("H3", !!editor?.isActive("heading", { level: 3 }), () => editor?.chain().focus().toggleHeading({ level: 3 }).run())}
              {btn("• List", !!editor?.isActive("bulletList"), () => editor?.chain().focus().toggleBulletList().run())}
              {btn("1. List", !!editor?.isActive("orderedList"), () => editor?.chain().focus().toggleOrderedList().run())}
              {btn("Quote", !!editor?.isActive("blockquote"), () => editor?.chain().focus().toggleBlockquote().run())}
              {btn("Link", !!editor?.isActive("link"), () => {
                const href = window.prompt("Link URL (https://… or /path)", "");
                if (href === null) return;
                if (href === "") editor?.chain().focus().unsetLink().run();
                else editor?.chain().focus().setLink({ href }).run();
              })}
              {btn("Image", false, () => setPicker("body"))}
              {btn("Undo", false, () => editor?.chain().focus().undo().run())}
              {btn("Redo", false, () => editor?.chain().focus().redo().run())}
            </div>
            <EditorContent editor={editor} />
          </div>

          {picker && (
            <div className="card">
              <h2>{picker === "cover" ? "Choose cover image" : "Insert image"}</h2>
              <MediaPicker items={media} onPick={pick} />
              <button type="button" className="link" onClick={() => setPicker(null)}>Close</button>
            </div>
          )}

          <div className="card">
            <h2>Excerpt</h2>
            <textarea value={form.excerpt} maxLength={300} onChange={(e) => set("excerpt", e.target.value)} aria-label="Excerpt" />
          </div>

          <div className="card">
            <h2>Sources &amp; further reading</h2>
            {form.sources.map((s, i) => (
              <div className="row" key={i} style={{ marginBottom: 8 }}>
                <input aria-label="Source title" style={{ flex: 1, minWidth: 140 }} value={s.title} maxLength={200} onChange={(e) => set("sources", form.sources.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
                <input aria-label="Source URL" style={{ flex: 2, minWidth: 180 }} value={s.url} maxLength={500} onChange={(e) => set("sources", form.sources.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
                <button type="button" className="link" onClick={() => set("sources", form.sources.filter((_, j) => j !== i))}>remove</button>
              </div>
            ))}
            <button type="button" className="btn ghost" onClick={() => set("sources", [...form.sources, { title: "", url: "https://" }])}>Add source</button>
          </div>

          <div className="card">
            <h2>FAQ (emits FAQPage schema)</h2>
            {form.faq.map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <input aria-label="Question" value={f.q} maxLength={200} onChange={(e) => set("faq", form.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} placeholder="Question" />
                <textarea aria-label="Answer" value={f.a} maxLength={1000} onChange={(e) => set("faq", form.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} placeholder="Answer" />
                <button type="button" className="link" onClick={() => set("faq", form.faq.filter((_, j) => j !== i))}>remove</button>
              </div>
            ))}
            <button type="button" className="btn ghost" onClick={() => set("faq", [...form.faq, { q: "", a: "" }])}>Add question</button>
          </div>
        </div>

        <aside>
          <div className="card">
            <h2>Publish</h2>
            <div className="row">
              <button type="button" className="btn ghost" disabled={pending} onClick={() => submit("save")}>Save</button>
              <button type="button" className="btn gold" disabled={pending || errors.length > 0} onClick={() => submit("publish")}>
                {status === "published" ? "Update" : "Publish"}
              </button>
            </div>
            {errors.length > 0 && <p className="error">Fix {errors.length} error{errors.length > 1 ? "s" : ""} to publish</p>}
            <label style={{ marginTop: 12 }}>
              Schedule for
              <input type="datetime-local" onChange={(e) => set("scheduledAt", e.target.value ? new Date(e.target.value).toISOString() : null)} defaultValue={form.scheduledAt ? new Date(form.scheduledAt).toISOString().slice(0, 16) : ""} />
            </label>
            <div className="row">
              <button type="button" className="btn ghost" disabled={pending || errors.length > 0 || !form.scheduledAt} onClick={() => submit("schedule")}>Schedule</button>
              {status !== "draft" && <button type="button" className="btn ghost" disabled={pending} onClick={() => submit("draft")}>Unpublish</button>}
              {status !== "archived" && <button type="button" className="btn ghost" disabled={pending} onClick={() => submit("archive")}>Archive</button>}
            </div>
            {live && <p className="muted">Live posts are not autosaved. Use Update to publish changes.</p>}
            {props.canDelete && (
              <form action={deletePostAction.bind(null, props.id)} onSubmit={(e) => { if (!window.confirm("Delete this post permanently?")) e.preventDefault(); }} style={{ marginTop: 12 }}>
                <button className="btn danger">Delete post</button>
              </form>
            )}
          </div>

          <div className="card">
            <h2>URL slug</h2>
            <input value={form.slug} maxLength={96} onChange={(e) => set("slug", e.target.value.toLowerCase())} aria-label="Slug" />
            <button type="button" className="link" onClick={() => set("slug", slugify(form.title))}>Generate from title</button>
            {props.wasPublished && <p className="muted">Changing a published slug creates a 301 redirect from the old URL.</p>}
          </div>

          <div className="card">
            <h2>Taxonomy</h2>
            <label>Author
              <select value={form.authorId ?? ""} onChange={(e) => set("authorId", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {props.authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
            <label>Reviewed by (optional)
              <select value={form.reviewerId ?? ""} onChange={(e) => set("reviewerId", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {props.authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
            <label>Category
              <select value={form.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {props.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <fieldset style={{ border: 0, padding: 0 }}>
              <legend style={{ fontWeight: 600, fontSize: ".9rem" }}>Tags</legend>
              {props.tags.map((t) => (
                <label key={t.id} style={{ display: "flex", gap: 8, fontWeight: 400, marginBottom: 4 }}>
                  <input type="checkbox" style={{ width: "auto" }} checked={form.tagIds.includes(t.id)} onChange={(e) => set("tagIds", e.target.checked ? [...form.tagIds, t.id] : form.tagIds.filter((x) => x !== t.id))} />
                  {t.name}
                </label>
              ))}
            </fieldset>
          </div>

          <div className="card">
            <h2>Cover image</h2>
            {cover && <p className="muted">{cover.alt}</p>}
            <div className="row">
              <button type="button" className="btn ghost" onClick={() => setPicker("cover")}>{cover ? "Change" : "Choose"} cover</button>
              {cover && <button type="button" className="link" onClick={() => set("coverMediaId", null)}>remove</button>}
            </div>
          </div>

          <div className="card">
            <h2>SEO</h2>
            <label>Focus keyword
              <input value={form.focusKeyword} maxLength={80} onChange={(e) => set("focusKeyword", e.target.value)} />
            </label>
            <label>Cluster
              <input list="clusters" value={form.cluster} maxLength={80} onChange={(e) => set("cluster", e.target.value)} />
              <datalist id="clusters">{clusters.map((c) => <option key={c} value={c} />)}</datalist>
            </label>
            <label>Meta title
              <input value={form.metaTitle} maxLength={120} onChange={(e) => set("metaTitle", e.target.value)} />
              <span className={`counter ${form.metaTitle.length > 60 ? "bad" : ""}`}>{form.metaTitle.length}/60</span>
            </label>
            <label>Meta description
              <textarea value={form.metaDescription} maxLength={300} onChange={(e) => set("metaDescription", e.target.value)} />
              <span className={`counter ${form.metaDescription.length > 160 ? "bad" : ""}`}>{form.metaDescription.length}/160</span>
            </label>
            <div className="serp" aria-label="Search preview">
              <div className="t">{titleFor(form.metaTitle, form.title) || "Post title"}</div>
              <div className="u">miyoglobal.com › blog › {form.slug}</div>
              <div className="d">{form.metaDescription.slice(0, 160) || "Meta description appears here."}</div>
            </div>
            <label style={{ display: "flex", gap: 8, fontWeight: 400, marginTop: 12 }}>
              <input type="checkbox" style={{ width: "auto" }} checked={form.noindex} onChange={(e) => set("noindex", e.target.checked)} /> noindex (also hidden from sitemap)
            </label>
            <label style={{ display: "flex", gap: 8, fontWeight: 400 }}>
              <input type="checkbox" style={{ width: "auto" }} checked={form.nofollow} onChange={(e) => set("nofollow", e.target.checked)} /> nofollow
            </label>
          </div>

          <div className="card">
            <h2>Social (Open Graph / Twitter)</h2>
            <label>OG title<input value={form.ogTitle} maxLength={120} onChange={(e) => set("ogTitle", e.target.value)} /></label>
            <label>OG description<textarea value={form.ogDescription} maxLength={300} onChange={(e) => set("ogDescription", e.target.value)} /></label>
            <p className="muted">The 1200×630 image comes from the cover; posts without a cover get a generated one.</p>
          </div>

          {props.isAdmin && (
            <div className="card">
              <h2>Custom JSON-LD (admin)</h2>
              <textarea value={form.customJsonLd ?? ""} maxLength={8000} onChange={(e) => set("customJsonLd", e.target.value || null)} aria-label="Custom JSON-LD" />
              {jsonLdError && <p className="error">{jsonLdError}</p>}
              <p className="muted">Parsed and escaped on output. Product schema is rejected.</p>
            </div>
          )}

          <div className="card health">
            <h2>Content health</h2>
            <ul>
              {issues.map((i) => <li key={i.code} className={i.level === "error" ? "err" : "warn"}>{i.level === "error" ? "Error" : "Warning"}: {i.message}</li>)}
              {issues.length === 0 && <li className="ok">All checks pass</li>}
            </ul>
            <button type="button" className="btn ghost" disabled={pending} onClick={() => start(async () => { const r = await checkLinksAction(JSON.stringify(form.content)); setBroken(r.ok ? r.broken : null); if (!r.ok) setError(r.error); })}>Check links</button>
            {broken && (broken.length ? <ul>{broken.map((b) => <li key={b} className="err">Broken: {b}</li>)}</ul> : <p className="ok">No broken links</p>)}
            <h2 style={{ marginTop: 16 }}>Link suggestions</h2>
            <ul>
              {related.map((r) => <li key={r.slug}>{r.title || r.slug} <button type="button" className="link" onClick={() => link(r.title || r.slug, `/blog/${r.slug}`)}>insert</button></li>)}
              {SERVICES.map((s) => <li key={s.href}>{s.label} <button type="button" className="link" onClick={() => link(s.label, s.href)}>insert</button></li>)}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
