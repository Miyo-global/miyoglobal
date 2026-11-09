import type { Metadata } from "next";
import { can } from "@/lib/roles";
import { requireStaff } from "@/server/guards";
import { listMedia } from "@/server/services/media";
import { MediaPicker } from "../media-picker";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const me = await requireStaff();
  const items = await listMedia();
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Media library</h1>
          <p className="muted">Images are converted to WebP and AVIF on upload.</p>
        </div>
      </div>
      <div className="card">
        <MediaPicker items={items.map((m) => ({ id: m.id, url: m.url, alt: m.alt, width: m.width, height: m.height }))} canDelete={can(me.role, "deletePosts")} />
      </div>
    </>
  );
}
