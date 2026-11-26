import type { Metadata } from "next";
import { ResetForm } from "./reset";

export const metadata: Metadata = { title: "Choose a new password" };

export default function Reset() {
  return <ResetForm />;
}
