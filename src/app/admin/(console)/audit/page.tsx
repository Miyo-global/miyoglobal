import type { Metadata } from "next";
import { Icon, PageHead, Sample } from "@/components/ui";
import { audit } from "@/data/fixtures";

export const metadata: Metadata = { title: "Audit log" };

export default function Audit() {
  const csv = ["timestamp,actor,action,target,ip", ...audit.map((a) => [a.at, a.actor, a.action, a.target, a.ip].map((v) => `"${v}"`).join(","))].join("\n");
  return (
    <div>
      <PageHead eyebrow="Compliance" title="Audit log" lede="Append-only record of every admin and system action.">
        <a className="btn" download="miyo-audit-26-nov-2026.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}><Icon name="download" /> Export CSV</a>
      </PageHead>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Target</th><th>IP</th></tr></thead>
          <tbody>
            {audit.map((a) => (
              <tr key={a.at + a.action}>
                <td className="mono">{a.at}</td><td>{a.actor}</td><td className="mono">{a.action}</td><td>{a.target}</td><td className="mono">{a.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Sample />
    </div>
  );
}
