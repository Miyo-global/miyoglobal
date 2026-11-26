import type { Metadata } from "next";
import { PageHead, Sample } from "@/components/ui";
import { VideoReview } from "./review";

export const metadata: Metadata = { title: "Video review" };

export default function Videos() {
  return (
    <div>
      <PageHead eyebrow="Moderation" title="Video review queue" lede="Every pitch is reviewed by a person within 24 hours." />
      <VideoReview />
      <Sample />
    </div>
  );
}
