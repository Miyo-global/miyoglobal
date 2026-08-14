/* MIYO Global — Referral Policy 2026 (branded PDF document)
 *
 * Brand: navy + gold, matching the website. Georgia (headings) + Outfit (body).
 * Rule inherited from the source document: no hyphen or dash characters in visible text.
 *
 * Writes referral-policy.html with the logo embedded as base64, then prints it to
 * ../../documents/MIYO_Global_Referral_Policy_2026.pdf with headless Chrome.
 *
 *   node tools/referral-policy/build.js
 *
 * The values here are the same ones referrals.html shows in the policy summary table.
 * Change both together, or the page and the PDF will disagree.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const SITE = path.resolve(HERE, "..", "..");
const OUT_DIR = path.join(SITE, "documents");
const OUT_PDF = path.join(OUT_DIR, "MIYO_Global_Referral_Policy_2026.pdf");
const OUT_HTML = path.join(HERE, "referral-policy.html");

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const logo = fs.readFileSync(path.join(HERE, "logo-mark.png")).toString("base64");

const facts = [
  ["Reward Amount", "&#8377;15,000 (subject to TDS)"],
  ["Profile Validity", "90 days from submission"],
  ["Payout Timeline", "45 days from onboarding"],
  ["Payment Mode", "NEFT or IMPS bank transfer"],
  ["Manager Approval", "Required before payout"],
];

const sections = [
  ["1", "Referral Reward Program", `
    <p>MIYO Global is pleased to offer a referral program that rewards everyone whose referral
    successfully joins the organisation. The referral reward is <strong>&#8377;15,000 per successful candidate</strong>,
    subject to applicable Tax Deducted at Source (TDS) as per the Income Tax Act, 1961.</p>`],

  ["2", "Eligibility Criteria", `
    <p><span class="lead">Who can refer.</span> Any current employee or external contact of MIYO Global may
    refer candidates for open positions. There is no limit on the number of referrals per person.</p>
    <p><span class="lead">Eligible referees.</span> Any member of the general public can be referred. Referees
    must meet the job requirements and complete the standard recruitment evaluation.</p>`],

  ["3", "Referral Submission Process", `
    <p><span class="lead">How to refer.</span> Submit referrals through the MIYO Global Referrals page at
    <span class="link">miyoglobal.com/referrals.html</span>.</p>
    <p><span class="lead">Required information.</span> Referrer's name, email and contact number; candidate's full
    name, email and phone number; target job position; and the candidate's resume (PDF or DOCX, maximum 10MB).</p>
    <p><span class="lead">Submission timeline.</span> Referrals must be submitted within 30 days of the candidate
    coming under consideration. Retroactive referrals more than 30 days old will be rejected.</p>`],

  ["4", "Evaluation and Approval", `
    <p><span class="lead">Candidate evaluation.</span> All referred candidates go through our standard recruitment
    process. Being referred does not guarantee selection or expedited processing.</p>
    <p><span class="lead">Manager approval.</span> The hiring manager must explicitly approve the referral payout.
    Approval is contingent on the candidate completing 45 days of employment, satisfactory performance during the
    probation period, and verification of all submitted documents.</p>`],

  ["5", "Payout Details", `
    <div class="paygrid">
      <div class="paycell"><div class="pk">Payout Amount</div><div class="pv">&#8377;15,000 before TDS deduction</div></div>
      <div class="paycell"><div class="pk">Payment Method</div><div class="pv">NEFT or IMPS bank transfer only, no cheques or cash</div></div>
      <div class="paycell"><div class="pk">TDS Compliance</div><div class="pv">Deducted as per applicable Income Tax regulations</div></div>
    </div>`],

  ["6", "Disqualification Triggers", `
    <p>Referral rewards will be withheld or cancelled in the following scenarios.</p>
    <ol class="triggers">
      <li><strong>Retroactive submission.</strong> Referral submitted more than 30 days after the candidate applied.</li>
      <li><strong>Early exit within 45 days.</strong> Candidate leaves the organisation within 45 days of joining.</li>
      <li><strong>Fraudulent submission.</strong> False information or fake documents submitted.</li>
      <li><strong>Missing documents.</strong> Required documents not submitted within 30 days of request.</li>
      <li><strong>Duplicate referral.</strong> Multiple referrals for the same candidate (earliest timestamp wins).</li>
      <li><strong>Expired profile.</strong> Referral profile not submitted within 90 days of the initial discussion.</li>
      <li><strong>Manager rejection.</strong> The hiring manager denies approval for any reason.</li>
    </ol>`],

  ["7", "Dispute Resolution", `
    <p><span class="lead">Duplicate claims.</span> Where there are duplicate referrals for the same candidate, the
    referral with the earliest timestamp will be honoured.</p>
    <p><span class="lead">Dispute filing.</span> All disputes must be filed within 15 days of notification. After
    15 days, all decisions are final.</p>`],

  ["8", "General Terms", `
    <p>MIYO Global reserves the right to modify this policy at any time with 30 days notice. This referral
    program is not an employment contract or a promise of future employment. All referred candidates must comply
    with MIYO Global's hiring and background verification standards.</p>`],
];

const sectionHTML = sections.map(([n, title, body]) => `
  <section class="sec">
    <div class="sechead"><span class="badge">${n}</span><h2>${title}</h2></div>
    <div class="secbody">${body}</div>
  </section>`).join("\n");

const factRows = facts.map(([k, v], i) => `
  <div class="frow${i % 2 ? " alt" : ""}"><div class="fk">${k}</div><div class="fv">${v}</div></div>`).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>MIYO Global — Referral Policy 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --navy:#0B192F; --gold:#E0B458; --goldl:#FBE8AE;
    --ink:#0B192F; --body:#3E4B5B; --mute:#73808F; --panel:#F6F8FB;
    --line:#E3E8EF;
  }
  @page{ size:A4; margin:11mm 0 11mm 0; }
  *{ box-sizing:border-box; }
  html,body{ margin:0; padding:0; }
  body{
    font-family:"Outfit", Arial, sans-serif; color:var(--body);
    font-size:10pt; line-height:1.42; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  .page{ padding:0 16mm; }
  h1,h2,h3{ font-family:Georgia,"Times New Roman",serif; color:var(--ink); }

  /* ---- hero ---- */
  .hero{
    background:var(--navy); color:#fff; border-radius:12px; padding:18px 24px 19px;
    position:relative; overflow:hidden; margin-bottom:13px;
  }
  .hero::after{ content:""; position:absolute; top:0; right:0; width:8px; height:100%; background:var(--gold); }
  .hero .logo{ height:34px; margin-bottom:11px; }
  .eyebrow{ font-size:8.2pt; letter-spacing:3px; font-weight:700; color:var(--gold); text-transform:uppercase; }
  .hero h1{ color:#fff; font-size:25pt; line-height:1.06; margin:6px 0 4px; }
  .hero h1 .amt{ color:var(--gold); }
  .hero p{ color:#D8E0EC; font-size:10pt; margin:5px 0 0; max-width:122mm; }

  /* ---- facts card ---- */
  .facts{ border:1px solid var(--line); border-radius:10px; overflow:hidden; margin-bottom:15px; box-shadow:0 2px 10px rgba(11,25,47,.06); }
  .facts .ftitle{ background:var(--navy); color:var(--goldl); font-family:Georgia,serif; font-weight:700;
    font-size:11pt; padding:7px 16px; border-bottom:3px solid var(--gold); }
  .frow{ display:flex; padding:6.5px 16px; align-items:center; }
  .frow.alt{ background:var(--panel); }
  .frow .fk{ flex:0 0 42%; font-weight:700; color:var(--ink); font-size:9.6pt; }
  .frow .fv{ flex:1; color:var(--body); font-size:9.6pt; }

  /* ---- sections ---- */
  .sec{ margin:0 0 11px; page-break-inside:avoid; }
  .sechead{ display:flex; align-items:center; gap:10px; margin-bottom:5px; }
  .badge{ flex:0 0 auto; width:24px; height:24px; border-radius:50%; background:var(--navy);
    color:var(--goldl); font-family:Georgia,serif; font-weight:700; font-size:11pt;
    display:flex; align-items:center; justify-content:center; border:1.5px solid var(--gold); }
  .sechead h2{ font-size:13.5pt; margin:0; }
  .secbody{ border-left:3px solid var(--gold); padding-left:13px; margin-left:11px; }
  .secbody p{ margin:0 0 5px; }
  .lead{ font-weight:700; color:var(--ink); }
  .link{ color:#8F6B14; font-weight:600; }

  .triggers{ margin:6px 0 0; padding-left:18px; }
  .triggers li{ margin:0 0 5px; padding-left:4px; }
  .triggers li::marker{ color:var(--gold); font-weight:700; }
  .triggers strong{ color:var(--ink); }

  .paygrid{ display:flex; gap:10px; }
  .paycell{ flex:1; background:var(--panel); border:1px solid var(--line); border-top:3px solid var(--gold);
    border-radius:8px; padding:10px 12px; }
  .pk{ font-family:Georgia,serif; font-weight:700; color:var(--ink); font-size:10.5pt; margin-bottom:3px; }
  .pv{ font-size:9.6pt; color:var(--body); }

  /* ---- footer band ---- */
  .footer{ margin-top:8px; border-top:1px solid var(--line); padding-top:8px;
    display:flex; justify-content:space-between; font-size:8.2pt; color:var(--mute); }
  .footer .b{ color:var(--ink); font-weight:700; }
  .footer .g{ color:#8F6B14; font-weight:700; }
</style>
</head>
<body>
  <div class="page">
    <div class="hero">
      <img class="logo" src="data:image/png;base64,${logo}" alt="MIYO Global">
      <div class="eyebrow">Referral Policy 2026</div>
      <h1>Refer a candidate and earn <span class="amt">&#8377;15,000</span></h1>
      <p>A simple, transparent reward for helping MIYO Global find great people. Submit a referral, and earn when your candidate successfully joins the team.</p>
    </div>

    <div class="facts">
      <div class="ftitle">Policy at a glance</div>
      ${factRows}
    </div>

    ${sectionHTML}

    <div class="footer">
      <div><span class="g">MIYO Global</span> &nbsp;Referral Policy v2026</div>
      <div>Miyo Global Private Limited &nbsp;&bull;&nbsp; Hyderabad, India</div>
      <div>Last updated <span class="b">August 2026</span></div>
    </div>
  </div>
</body>
</html>`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_HTML, html);
console.log("WROTE " + path.relative(SITE, OUT_HTML));

if (!fs.existsSync(CHROME)) {
  console.error(
    "Chrome not found at " + CHROME + ". Set CHROME_PATH and rerun to produce the PDF."
  );
  process.exit(1);
}

execFileSync(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=" + OUT_PDF,
    // Give the webfont time to load; without it Chrome prints in the fallback face.
    "--virtual-time-budget=8000",
    "file://" + OUT_HTML,
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);

console.log("WROTE " + path.relative(SITE, OUT_PDF));
