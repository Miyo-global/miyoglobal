"use client";

import { animated, type SpringValue } from "@react-spring/web";

import { ports } from "./content";

/**
 * Fathom's passage chart, re-skinned: a dashed drafting grid and one gold route
 * from Hyderabad to Ras Al Khaimah. Positions are an equirectangular projection
 * of the real coordinates, so the India delivery cities sit where they are.
 */
export const VIEW = { w: 1000, h: 600 };
const LON: [number, number] = [52, 84];
const LAT: [number, number] = [10, 30];
const PAD = { x: 80, y: 60 };

export const project = (lat: number, lon: number) => ({
  x: PAD.x + ((lon - LON[0]) / (LON[1] - LON[0])) * (VIEW.w - PAD.x * 2),
  y: VIEW.h - PAD.y - ((lat - LAT[0]) / (LAT[1] - LAT[0])) * (VIEW.h - PAD.y * 2),
});

export const FROM = project(ports.from.lat, ports.from.lon);
export const TO = project(ports.to.lat, ports.to.lon);
/** The route bows south over the Arabian Sea. */
const VIA = { x: (FROM.x + TO.x) / 2, y: Math.max(FROM.y, TO.y) + 110 };
export const ROUTE = `M${FROM.x.toFixed(1)} ${FROM.y.toFixed(1)} Q${VIA.x.toFixed(1)} ${VIA.y.toFixed(1)} ${TO.x.toFixed(1)} ${TO.y.toFixed(1)}`;

const ROWS = [100, 200, 300, 400, 500];
const COLS = [125, 250, 375, 500, 625, 750, 875];

/** A 4px-style port square with corner ticks. */
function Port({ x, y, label, anchor }: { x: number; y: number; label: string; anchor: "start" | "end" }) {
  const s = 5;
  const t = 9;
  return (
    <g>
      <rect x={x - s} y={y - s} width={s * 2} height={s * 2} className="fill-on-dark" />
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([dx, dy]) => (
        <path key={`${dx}${dy}`} d={`M${x + dx * t} ${y + dy * (t - 4)}V${y + dy * t}H${x + dx * (t - 4)}`} fill="none" strokeWidth={1} className="stroke-on-dark" />
      ))}
      <text x={x + (anchor === "start" ? 18 : -18)} y={y - 14} textAnchor={anchor} className="fill-on-dark font-sans text-[18px] font-medium tracking-[0.08em]">
        {label}
      </text>
    </g>
  );
}

export interface RouteChartProps {
  /** 0 → 1 share of the route drawn; a number draws it statically. */
  progress: SpringValue<number> | number;
  /** Show the secondary India delivery cities. */
  cities?: boolean;
  routeOpacity?: number;
  className?: string;
  preserve?: "meet" | "slice";
}

export function RouteChart({ progress, cities = false, routeOpacity = 1, className = "", preserve = "meet" }: RouteChartProps) {
  const offset = typeof progress === "number" ? 1 - progress : progress.to((v) => 1 - v);
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} preserveAspectRatio={`xMidYMid ${preserve}`} aria-hidden="true" className={className}>
      {ROWS.map((y) => (
        <line key={`r${y}`} x1={0} x2={VIEW.w} y1={y} y2={y} strokeWidth={1} strokeDasharray="4 6" className="stroke-rule-dark" />
      ))}
      {COLS.map((x) => (
        <line key={`c${x}`} y1={0} y2={VIEW.h} x1={x} x2={x} strokeWidth={1} strokeDasharray="4 6" className="stroke-rule-dark" />
      ))}
      <path d={ROUTE} fill="none" strokeWidth={1} strokeDasharray="2 7" className="stroke-rule-dark" />
      <animated.path d={ROUTE} fill="none" strokeWidth={2} pathLength={1} strokeDasharray="1" strokeDashoffset={offset} className="stroke-accent" style={{ opacity: routeOpacity }} />
      {cities &&
        ports.cities.map((city) => {
          const p = project(city.lat, city.lon);
          return (
            <g key={city.name}>
              <circle cx={p.x} cy={p.y} r={3} className="fill-on-dark" />
              <text x={"anchor" in city ? p.x - 10 : p.x + 10} y={p.y + 5} textAnchor={"anchor" in city ? "end" : "start"} className="fill-on-dark-muted font-sans text-[14px] uppercase tracking-[0.06em]">
                {city.name}
              </text>
            </g>
          );
        })}
      <Port x={FROM.x} y={FROM.y} label={ports.from.code} anchor="start" />
      <Port x={TO.x} y={TO.y} label={ports.to.code} anchor="end" />
    </svg>
  );
}
