"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import NextImage from "next/image";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { Doc } from "@/lib/content";
import { checkHealth } from "@/lib/health";
import type { Intent, PostInput } from "@/lib/post-schema";
import { fromIstInput, toIstInput } from "@/lib/ist";
import { parseCustomJsonLd, titleFor } from "@/lib/seo";
import { slugify } from "@/lib/slug";
import { checkLinksAction, deletePostAction, savePostAction } from "../../actions";
import { useUi } from "../../../ui";
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
  const ui = useUi();
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
        coverWidth: cover?.width,
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
        if (intent === "draft") setForm((f) => ({ ...f, scheduledAt: null }));
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

  const remove = async () => {
    if (!(await ui.confirm("Delete this post permanently? This cannot be undone."))) return;
    start(() => deletePostAction(props.id));
  };

  const btn = (label: string, active: boolean, on: () => void) => (
    <button type="button" className={active ? "on" : ""} aria-pressed={active} onMouseDown={(e) => e.preventDefault()} onClick={on}>{label}</button>
  );

  const clusters = [...new Set(props.siblings.map((s) => s.cluster).filter(Boolean))];
  const related = [...props.siblings].sort((a, b) => Number(b.cluster === form.cluster) - Number(a.cluster === form.cluster)).slice(0, 6);
  const errors = issues.filter((i) => i.level === "error");
  const saveState = pending ? "saving" : dirty ? "dirty" : note ? "saved" : "idle";

  return (
    <>
      <div className="editor-bar">
        <div className="editor-title">
          <h1>Edit post <span className={`pill ${status}`}>{status}</span></h1>
          <span className={`save-state ${saveState}`} role="status">
            {pending ? "Saving…" : dirty ? (live ? "Unsaved changes" : "Unsaved") : note || "No changes"}
          </span>
        </div>
        <div className="row nowrap">
          <a className="btn ghost sm" href={`/preview/${props.id}`} target="_blank" rel="noopener">Preview</a>
          <button type="button" className="btn secondary" disabled={pending} onClick={() => submit("save")}>Save</button>
          <button type="button" className="btn primary" disabled={pending || errors.length > 0} onClick={() => submit("publish")}>
            {status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>
      {error && <p className="error banner" role="alert">{error}</p>}
      {errors.length > 0 && <p className="hint">Fix {errors.length} error{errors.length > 1 ? "s" : ""} in Content health to publish.</p>}
      <div className="editor-wrap">
        <div className="editor-main">
          <section className="card">
            <div className="field">
              <label htmlFor="post-title">Title (H1)</label>
              <input id="post-title" name="title" className="title-input" value={form.title} maxLength={120} onChange={(e) => set("title", e.target.value)} placeholder="Answer-first headline with the primary keyword" />
            </div>
            <div className="field">
              <label htmlFor="post-quick">Quick answer / TL;DR</label>
              <textarea id="post-quick" name="quickAnswer" value={form.quickAnswer} maxLength={600} onChange={(e) => set("quickAnswer", e.target.value)} />
            </div>
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
          </section>

          {picker && (
            <section className="card picker">
              <div className="card-head">
                <h2>{picker === "cover" ? "Choose cover image" : "Insert image"}</h2>
                <button type="button" className="btn ghost sm" onClick={() => setPicker(null)}>Close</button>
              </div>
              <MediaPicker items={media} onPick={pick} />
            </section>
          )}

          <section className="card">
            <h2><label htmlFor="post-excerpt">Excerpt</label></h2>
            <textarea id="post-excerpt" name="excerpt" value={form.excerpt} maxLength={300} onChange={(e) => set("excerpt", e.target.value)} />
          </section>

          <section className="card">
            <h2>Sources &amp; further reading</h2>
            {form.sources.map((s, i) => (
              <div className="row repeat" key={i}>
                <input name={`sources.${i}.title`} aria-label="Source title" placeholder="Title" className="grow" value={s.title} maxLength={200} onChange={(e) => set("sources", form.sources.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
                <input name={`sources.${i}.url`} aria-label="Source URL" placeholder="https://" className="grow-2" value={s.url} maxLength={500} onChange={(e) => set("sources", form.sources.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
                <button type="button" className="btn danger-ghost sm" onClick={() => set("sources", form.sources.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn secondary sm" onClick={() => set("sources", [...form.sources, { title: "", url: "https://" }])}>Add source</button>
          </section>

          <section className="card">
            <h2>FAQ <span className="muted small">(emits FAQPage schema)</span></h2>
            {form.faq.map((f, i) => (
              <div key={i} className="faq-item">
                <input name={`faq.${i}.q`} aria-label="Question" value={f.q} maxLength={200} onChange={(e) => set("faq", form.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} placeholder="Question" />
                <textarea name={`faq.${i}.a`} aria-label="Answer" value={f.a} maxLength={1000} onChange={(e) => set("faq", form.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} placeholder="Answer" />
                <button type="button" className="btn danger-ghost sm" onClick={() => set("faq", form.faq.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn secondary sm" onClick={() => set("faq", [...form.faq, { q: "", a: "" }])}>Add question</button>
          </section>
        </div>

        <aside className="editor-side">
          <section className="card">
            <h2>Publish</h2>
            <div className="field">
              <label htmlFor="post-schedule">Schedule for (IST)</label>
              <input id="post-schedule" name="scheduledAt" type="datetime-local" value={toIstInput(form.scheduledAt)} onChange={(e) => set("scheduledAt", fromIstInput(e.target.value))} />
            </div>
            <div className="row">
              <button type="button" className="btn secondary sm" disabled={pending || errors.length > 0 || !form.scheduledAt} onClick={() => submit("schedule")}>Schedule</button>
              {live && <button type="button" className="btn secondary sm" disabled={pending} onClick={() => submit("draft")}>Unpublish</button>}
              {status === "scheduled" && <button type="button" className="btn secondary sm" disabled={pending} onClick={() => submit("draft")}>Cancel schedule</button>}
              {status !== "archived" && <button type="button" className="btn secondary sm" disabled={pending} onClick={() => submit("archive")}>Archive</button>}
            </div>
            {live && <p className="muted small">Live posts are not autosaved. Use Update to publish changes.</p>}
            {props.canDelete && (
              <div className="danger-zone">
                <button type="button" className="btn danger sm" disabled={pending} onClick={remove}>Delete post</button>
              </div>
            )}
          </section>

          <section className="card">
            <h2>URL slug</h2>
            <input name="slug" value={form.slug} maxLength={96} onChange={(e) => set("slug", e.target.value.toLowerCase())} aria-label="Slug" />
            <button type="button" className="btn ghost sm" onClick={() => set("slug", slugify(form.title))}>Generate from title</button>
            {props.wasPublished && <p className="muted small">Changing a published slug creates a 301 redirect from the old URL.</p>}
          </section>

          <section className="card">
            <h2>Organise</h2>
            <div className="field">
              <label htmlFor="post-category">Category</label>
              <select id="post-category" name="categoryId" value={form.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {props.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <fieldset className="bare field">
              <legend>Tags</legend>
              {props.tags.length ? (
                <div className="chips">
                  {props.tags.map((t) => (
                    <label key={t.id} className="chip">
                      <input type="checkbox" name="tagIds" value={t.id} checked={form.tagIds.includes(t.id)} onChange={(e) => set("tagIds", e.target.checked ? [...form.tagIds, t.id] : form.tagIds.filter((x) => x !== t.id))} />
                      {t.name}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="muted small">No tags yet. Add them under Categories &amp; Tags.</p>
              )}
            </fieldset>
            <div className="field">
              <label htmlFor="post-author">Author</label>
              <select id="post-author" name="authorId" value={form.authorId ?? ""} onChange={(e) => set("authorId", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {props.authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="post-reviewer">Reviewed by (optional)</label>
              <select id="post-reviewer" name="reviewerId" value={form.reviewerId ?? ""} onChange={(e) => set("reviewerId", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {props.authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </section>

          <section className="card">
            <h2>Cover image</h2>
            {cover ? (
              <figure className="cover">
                <NextImage src={cover.url} alt={cover.alt} width={320} height={180} unoptimized />
                <figcaption className="muted small">{cover.alt}</figcaption>
              </figure>
            ) : (
              <p className="muted small">No cover yet. Posts without one get a generated social image.</p>
            )}
            <div className="row">
              <button type="button" className="btn secondary sm" onClick={() => setPicker("cover")}>{cover ? "Change" : "Choose"} cover</button>
              {cover && <button type="button" className="btn danger-ghost sm" onClick={() => set("coverMediaId", null)}>Remove</button>}
            </div>
          </section>

          <section className="card">
            <h2>SEO</h2>
            <div className="field">
              <label htmlFor="post-keyword">Focus keyword</label>
              <input id="post-keyword" name="focusKeyword" value={form.focusKeyword} maxLength={80} onChange={(e) => set("focusKeyword", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="post-cluster">Cluster</label>
              <input id="post-cluster" name="cluster" list="clusters" value={form.cluster} maxLength={80} onChange={(e) => set("cluster", e.target.value)} />
              <datalist id="clusters">{clusters.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="field">
              <label htmlFor="post-meta-title">Meta title</label>
              <input id="post-meta-title" name="metaTitle" value={form.metaTitle} maxLength={120} onChange={(e) => set("metaTitle", e.target.value)} />
              <span className={`counter ${form.metaTitle.length > 60 ? "bad" : ""}`}>{form.metaTitle.length}/60</span>
            </div>
            <div className="field">
              <label htmlFor="post-meta-desc">Meta description</label>
              <textarea id="post-meta-desc" name="metaDescription" value={form.metaDescription} maxLength={300} onChange={(e) => set("metaDescription", e.target.value)} />
              <span className={`counter ${form.metaDescription.length > 160 ? "bad" : ""}`}>{form.metaDescription.length}/160</span>
            </div>
            <div className="serp" aria-label="Search preview">
              <div className="t">{titleFor(form.metaTitle, form.title) || "Post title"}</div>
              <div className="u">miyoglobal.com › blog › {form.slug}</div>
              <div className="d">{form.metaDescription.slice(0, 160) || "Meta description appears here."}</div>
            </div>
            <label className="check">
              <input type="checkbox" name="noindex" checked={form.noindex} onChange={(e) => set("noindex", e.target.checked)} /> noindex (also hidden from sitemap)
            </label>
            <label className="check">
              <input type="checkbox" name="nofollow" checked={form.nofollow} onChange={(e) => set("nofollow", e.target.checked)} /> nofollow
            </label>
          </section>

          <section className="card">
            <h2>Social (Open Graph / Twitter)</h2>
            <div className="field">
              <label htmlFor="post-og-title">OG title</label>
              <input id="post-og-title" name="ogTitle" value={form.ogTitle} maxLength={120} onChange={(e) => set("ogTitle", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="post-og-desc">OG description</label>
              <textarea id="post-og-desc" name="ogDescription" value={form.ogDescription} maxLength={300} onChange={(e) => set("ogDescription", e.target.value)} />
            </div>
            <p className="muted small">The 1200×630 image comes from the cover; posts without a cover get a generated one.</p>
          </section>

          {props.isAdmin && (
            <section className="card">
              <h2><label htmlFor="post-jsonld">Custom JSON-LD (admin)</label></h2>
              <textarea id="post-jsonld" name="customJsonLd" className="mono" value={form.customJsonLd ?? ""} maxLength={8000} onChange={(e) => set("customJsonLd", e.target.value || null)} />
              {jsonLdError && <p className="error">{jsonLdError}</p>}
              <p className="muted small">Parsed and escaped on output. Product schema is rejected.</p>
            </section>
          )}

          <section className="card health">
            <h2>Content health</h2>
            <ul>
              {issues.map((i) => <li key={i.code} className={i.level === "error" ? "err" : "warn"}>{i.level === "error" ? "Error" : "Warning"}: {i.message}</li>)}
              {issues.length === 0 && <li className="ok">All checks pass</li>}
            </ul>
            <button type="button" className="btn secondary sm" disabled={pending} onClick={() => start(async () => { const r = await checkLinksAction(JSON.stringify(form.content)); setBroken(r.ok ? r.broken : null); if (!r.ok) setError(r.error); })}>Check links</button>
            {broken && (broken.length ? <ul>{broken.map((b) => <li key={b} className="err">Broken: {b}</li>)}</ul> : <p className="ok">No broken links</p>)}
            <h2 className="mt">Link suggestions</h2>
            <ul className="suggest">
              {related.map((r) => <li key={r.slug}><span>{r.title || r.slug}</span> <button type="button" className="btn ghost sm" onClick={() => link(r.title || r.slug, `/blog/${r.slug}`)}>Insert</button></li>)}
              {SERVICES.map((s) => <li key={s.href}><span>{s.label}</span> <button type="button" className="btn ghost sm" onClick={() => link(s.label, s.href)}>Insert</button></li>)}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
