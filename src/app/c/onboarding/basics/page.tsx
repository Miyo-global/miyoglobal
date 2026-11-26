import type { Metadata } from "next";
import { StepNav } from "@/components/step-nav";

export const metadata: Metadata = { title: "Profile basics" };

export default function Basics() {
  return (
    <div className="wrap section" style={{ maxWidth: 760 }}>
      <form className="stack" style={{ ["--gap" as string]: "24px" }}>
        <header className="stack">
          <p className="eyebrow">Step 1 of 5</p>
          <h1>Profile basics</h1>
          <p className="muted">Companies see only your first initial, role and city until you accept a match.</p>
        </header>
        <div className="cols-2">
          <div className="field"><label htmlFor="first">First name</label><input id="first" defaultValue="Ananya" autoComplete="given-name" /></div>
          <div className="field"><label htmlFor="last">Surname</label><input id="last" defaultValue="Rao" autoComplete="family-name" aria-describedby="last-h" /><p id="last-h" className="hint">Hidden until you accept a match.</p></div>
        </div>
        <div className="field"><label htmlFor="title">Current role</label><input id="title" defaultValue="Senior React Developer" /></div>
        <div className="cols-2">
          <div className="field">
            <label htmlFor="city">City</label>
            <select id="city" defaultValue="Hyderabad"><option>Hyderabad</option><option>Bengaluru</option><option>Dubai</option><option>Ras Al Khaimah</option><option>Abu Dhabi</option></select>
          </div>
          <div className="field">
            <label htmlFor="years">Years of experience</label>
            <input id="years" type="number" min={0} max={45} defaultValue={7} />
          </div>
        </div>
        <div className="cols-2">
          <div className="field">
            <label htmlFor="notice">Notice period</label>
            <select id="notice" defaultValue="30 days"><option>Immediate</option><option>15 days</option><option>30 days</option><option>60 days</option><option>90 days</option></select>
          </div>
          <div className="field">
            <label htmlFor="pay">Expected pay (per year)</label>
            <input id="pay" defaultValue="₹38,00,000" inputMode="numeric" aria-describedby="pay-h" />
            <p id="pay-h" className="hint">Shown to companies only as In-Band, Stretch or Out-of-Band.</p>
          </div>
        </div>
        <fieldset className="stack" style={{ ["--gap" as string]: "0" }}>
          <legend>Open to work in</legend>
          <label className="check"><input type="checkbox" defaultChecked /> India</label>
          <label className="check"><input type="checkbox" defaultChecked /> United Arab Emirates</label>
        </fieldset>
        <StepNav back="/c/onboarding" next="/c/onboarding/skills" />
      </form>
    </div>
  );
}
