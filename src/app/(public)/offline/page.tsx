import type { Metadata } from "next";
import Link from "next/link";
import { Empty } from "@/components/ui";

export const metadata: Metadata = { title: "You're offline" };

export default function Offline() {
  return (
    <div className="wrap section">
      <Empty icon="wifiOff" title="You're offline" body="We couldn't reach MIYO. Your draft pitch is saved on this device and will upload when you're back online.">
        <Link href="/" className="btn btn-primary">Try again</Link>
      </Empty>
    </div>
  );
}
