import { ports } from "./content";

/**
 * Static HYD ↔ RAK route chart (equirectangular, 52°E to 84°E, 8°N to 32°N), drawn from the real coordinates.
 * It is the version every visitor gets first: mobile, reduced motion, no WebGL, and crawlers. The 3D globe replaces it on
 * desktop once loaded.
 */
const W = 640;
const H = 480;
const x = (lon: number) => ((lon - 52) / 32) * W;
const y = (lat: number) => ((32 - lat) / 24) * H;

export function RouteMap({ className }: { className?: string }) {
  const a = { x: x(ports.to.lon), y: y(ports.to.lat) };
  const b = { x: x(ports.from.lon), y: y(ports.from.lat) };
  const c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 150 };
  const lons = [56, 60, 64, 68, 72, 76, 80];
  const lats = [12, 16, 20, 24, 28];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="route-title route-desc" className={className}>
      <title id="route-title">Route from Hyderabad, India to Ras Al Khaimah, UAE</title>
      <desc id="route-desc">Delivery hubs in Hyderabad and Ras Al Khaimah, with Indian delivery cities Bangalore, Pune, Noida and Chennai.</desc>
      <g stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" fill="none">
        {lons.map((l) => (
          <line key={`x${l}`} x1={x(l)} x2={x(l)} y1="0" y2={H} />
        ))}
        {lats.map((l) => (
          <line key={`y${l}`} y1={y(l)} y2={y(l)} x1="0" x2={W} />
        ))}
      </g>
      <path d={`M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" />
      {ports.cities.map((p) => (
        <g key={p.name}>
          <circle cx={x(p.lon)} cy={y(p.lat)} r="3" fill="currentColor" fillOpacity="0.5" />
          <text x={x(p.lon) - 8} y={y(p.lat) + 4} textAnchor="end" fontSize="12" fill="currentColor" fillOpacity="0.7" fontFamily="var(--face-sans)">
            {p.name}
          </text>
        </g>
      ))}
      {[
        { p: a, code: ports.to.code, name: ports.to.name },
        { p: b, code: ports.from.code, name: ports.from.name },
      ].map(({ p, code, name }) => (
        <g key={code}>
          <circle cx={p.x} cy={p.y} r="12" fill="var(--accent)" fillOpacity="0.18" />
          <circle cx={p.x} cy={p.y} r="5" fill="var(--accent)" />
          <text x={p.x + 16} y={p.y - 10} fontSize="14" fill="currentColor" fontFamily="var(--face-mono)" letterSpacing="1.5">
            {code}
          </text>
          <text x={p.x + 16} y={p.y + 8} fontSize="12" fill="currentColor" fillOpacity="0.7" fontFamily="var(--face-sans)">
            {name}
          </text>
        </g>
      ))}
    </svg>
  );
}
