import { describe, expect, it } from "vitest";
import { citiesOf, minYearsOf, normalizeJob, normalizeJobs, similarRoles, slugify } from "./jobs";

const raw = {
  jobId: "dm074",
  role: "CRMNEXT / BUSINESSNEXT QA Tester (Banking Domain)",
  location: "Bangalore - Koramangala",
  status: "Open",
  description: [
    "Job Title: CRMNEXT / BUSINESSNEXT QA Tester (Banking Domain)",
    "VMS ID: SECRET123",
    "Experience: 3–6 Years",
    "Notice Period: 15 Days Max",
    "CTC Budget: 12 LPA - 25 LPA",
    "Core Responsibilities",
    "• Manage BRDs and FSDs with user departments.",
    "• Execute functional test cases in UAT.",
    "Required Skills:",
    "Banking Domain: Prior exposure to retail assets or liabilities.",
  ].join("\n"),
};

describe("jobs", () => {
  it("normalises a sheet row into a role", () => {
    const r = normalizeJob(raw)!;
    expect(r.ref).toBe("DM074");
    expect(r.slug).toBe("crmnext-businessnext-qa-tester-banking-domain-dm074");
    expect(r.cities).toEqual(["Bengaluru"]);
    expect(r.experience).toBe("3–6 years");
    expect(r.minYears).toBe(3);
    expect(r.level).toBe("Mid-level");
    expect(r.fn).toBe("Enterprise Applications");
    expect(r.ctc).toBe("₹12–25 LPA");
    expect(r.notice).toBe("15 Days Max");
    expect(r.doing[0].bullets).toHaveLength(2);
    expect(r.bring[0].heading).toBe("Required Skills");
  });

  it("never exposes vendor or client identifiers", () => {
    expect(JSON.stringify(normalizeJob(raw))).not.toContain("SECRET123");
  });

  it("drops closed rows and keeps repeated jobIds unique", () => {
    const jobs = normalizeJobs([raw, { ...raw, role: "Other role" }, { ...raw, jobId: "DM1", status: "Closed" }]);
    expect(jobs.map((j) => j.ref)).toEqual(["DM074", "DM074-2"]);
    expect(new Set(jobs.map((j) => j.slug)).size).toBe(2);
  });

  it("parses locations and experience", () => {
    expect(citiesOf("Pune / Mumbai /TVM /Remote")).toEqual(["Pune", "Mumbai", "Thiruvananthapuram"]);
    expect(citiesOf("Kolkata (On-site)")).toEqual(["Kolkata"]);
    expect(minYearsOf("8+ yrs")).toBe(8);
    expect(minYearsOf("no number")).toBeNull();
    expect(slugify("Data Engineer _Golang & Kafka")).toBe("data-engineer-golang-and-kafka");
  });

  it("finds similar roles without the role itself", () => {
    const jobs = normalizeJobs([raw, { ...raw, jobId: "DM2", role: "Oracle FLEXCUBE Developer" }, { ...raw, jobId: "DM3", role: "Field Executive", description: "Sales." }]);
    const sim = similarRoles(jobs, jobs[0], 2);
    expect(sim.map((s) => s.ref)).toEqual(["DM2", "DM3"]);
  });
});
