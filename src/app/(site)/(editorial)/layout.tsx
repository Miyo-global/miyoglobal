import { editorialFonts } from "@/lib/fonts";
import "@/styles/editorial.css";

/** Jobs and referrals share the editorial type and tokens; the site header and footer still come from the (site) layout. */
export default function EditorialLayout({ children }: { children: React.ReactNode }) {
  return <div className={`ed ${editorialFonts}`}>{children}</div>;
}
