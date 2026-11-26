import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal";

export const metadata: Metadata = { title: "Privacy notice" };

export default function Page() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Privacy notice"
      sections={[
        ["Who we are", "MIYO Global operates this beta from desks in Hyderabad, India and Ras Al Khaimah, UAE. This beta uses fictional sample data only."],
        ["What we collect", "In the full product we collect your account details, your video pitch and transcript, the skills and certificates you add, and how you use the service. In this beta, nothing you type is stored beyond your browser session."],
        ["Blind by default", "Your surname, photo details and contact information are hidden from companies until you accept a match. You can withdraw consent at any time."],
        ["Your rights", "You can download or delete your data from Settings. We answer requests within 30 days, in line with India's Digital Personal Data Protection Act and UAE data protection law."],
        ["Cookies", "We use an essential cookie to keep you signed in. Measurement cookies are used only if you accept them in the cookie banner."],
        ["Contact", "Write to privacy@miyoglobal.com with any question about your data."],
      ]}
    />
  );
}
