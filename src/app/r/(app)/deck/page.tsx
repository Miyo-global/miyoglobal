import type { Metadata } from "next";
import { Deck } from "./deck";

export const metadata: Metadata = { title: "Swipe deck" };

export default async function DeckPage({ searchParams }: { searchParams: Promise<{ tilt?: string }> }) {
  const tilt = (await searchParams).tilt;
  return (
    <div className="dark-page dark">
      <h1 className="sr">Swipe deck</h1>
      <Deck tilt={tilt === "like" || tilt === "pass" ? tilt : undefined} />
    </div>
  );
}
