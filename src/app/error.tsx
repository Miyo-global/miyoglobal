"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="wrap section stack" style={{ ["--gap" as string]: "24px", maxWidth: 720 }}>
      <p className="eyebrow">Error 500</p>
      <h1>Something broke on our side.</h1>
      <p className="lede">We&apos;ve logged it. Try again, or go back to the home page.</p>
      <div className="row">
        <button className="btn btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn">Go home</Link>
      </div>
    </main>
  );
}
