import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal";

export const metadata: Metadata = { title: "Terms of use" };

export default function Page() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Terms of use"
      sections={[
        ["Beta service", "This is a pre-release build provided for evaluation. Features may change or be removed, and it is not intended for real hiring decisions."],
        ["Accounts", "Demo accounts are shared and reset regularly. Do not upload personal information or real candidate data."],
        ["Fair use", "Do not try to identify blind candidates, scrape pitches, or contact people outside the platform before a match."],
        ["Payments", "All prices and payments in the beta are simulated. No money is charged."],
        ["Liability", "The beta is provided as is, without warranties of any kind, to the extent permitted by law."],
      ]}
    />
  );
}
