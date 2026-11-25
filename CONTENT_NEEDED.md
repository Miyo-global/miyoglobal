# Content needed

The redesign uses only content MIYO Global has already published. These are the gaps where real material would replace a typographic stand-in. Nothing below has been invented on the site in the meantime.

## Photography

| Where | What is needed | Stand-in today |
|---|---|---|
| Home hero, About masthead | Real photographs of the Hyderabad office and team at work (landscape, at least 2400px wide) | Typographic hero with the live "Open mandates" card; no photo |
| Contact, About (offices) | Exterior or reception of Trendz Trinity, Madhapur, Hyderabad, and of the RAK DAO Business Centre office | Address cards only |
| Case studies | One image per engagement (physician review, radiology, AI data), or a cleared client environment shot | Image-free dossiers with metrics |
| Referrals hero | A photo that shows a real MIYO hire or recruiter | `/images/process.jpg` is not used; typographic hero |

`public/images/hero.jpg` and `public/images/about.jpg` are the same file (identical bytes), and every image in `public/images/` is stock. None of them are used on the redesigned pages; they are kept only because the production site still references them.

## People

- Portraits of the leadership: Prudvidhar Reddy (Managing Director), Sudheer Reddy (Chief Executive Officer), Biswajit Sircar (Senior Director, HR), and advisors Kalyan Reddy (Consultant, Digital Solutions) and Sushanth Reddy, MBBS (Consultant, Healthcare & Life Sciences). Square or 4:3, neutral background, consistent lighting. They replace the navy monogram cards on Home and About.
- A named recruiter (name, title, photo, email, phone) for the "talent desk" card on each job page.
- A real author profile for the journal. Posts by the "MIYO Admin" account are currently attributed to MIYO Global (the organisation).

## Proof

- Client logos cleared for public use. The logo strip shows the compliance credentials until then.
- Client quotes with a name and role, cleared for use. The `Quote` component is built but unused.
- Any additional outcome figures beyond those already published (11 physicians, 2 weeks, 3 months; 45 radiologists, 3,750 reports, 40 minutes; 100+ contributors, 95%+, 4 label types; 5 hubs, 4 models, 120+ languages).

## Jobs sheet

- `createdDate` is empty for every role, so no page shows a posting date and `JobPosting` has no `datePosted` (Google requires it for job rich results).
- A closing-date column, for `validThrough`.
- Pay, work mode and contract type as columns. Today they are only parsed from free-text descriptions, where present.

## Addresses

- Ras Al Khaimah: confirm the postal code (none is published), so the UAE `PostalAddress` can include it.
