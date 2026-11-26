import type { Metadata } from "next";
import { PageHead, Sample } from "@/components/ui";
import { Board } from "./board";

export const metadata: Metadata = { title: "Shortlist pipeline" };

export default function Pipeline() {
  return (
    <div>
      <PageHead eyebrow="Pipeline" title="Shortlist" lede="Names reveal from the Matched stage onwards. Move cards with the stage menu." />
      <Board />
      <Sample />
    </div>
  );
}
