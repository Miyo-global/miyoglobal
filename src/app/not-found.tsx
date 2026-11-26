import Link from "next/link";
import { PublicPage } from "@/components/public";

export default function NotFound() {
  return (
    <PublicPage>
      <div className="wrap section stack" style={{ ["--gap" as string]: "24px", maxWidth: 720 }}>
        <p className="eyebrow">Error 404</p>
        <h1>This page isn&apos;t here.</h1>
        <p className="lede">The link may be old, or the share card may have expired. Check the address or start again from the home page.</p>
        <div className="row">
          <Link href="/" className="btn btn-primary">Go home</Link>
          <Link href="/states" className="btn">See system states</Link>
        </div>
      </div>
    </PublicPage>
  );
}
