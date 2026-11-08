import { createContext, useContext, useEffect, useRef } from 'react';
import type { MapHandle } from '../hooks/useSimulation';
import type { AlertPin } from '../types';

interface MapContextValue {
  labels: { a: string; b: string };
  pins: AlertPin[];
  awsLive: boolean | null;
  registerMap: (handle: MapHandle) => () => void;
}

export const MapContext = createContext<MapContextValue | null>(null);

function useMapContext() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('MapCard must be rendered inside <MapContext.Provider>');
  return ctx;
}

const ROUTE = 'M70 330 C 95 262, 150 275, 172 212 S 250 150, 292 72';
const SAFE_SPOTS: [number, number][] = [
  [130, 120],
  [318, 220],
  [112, 214],
];
const V_LINES = Array.from({ length: 36 }, (_, k) => (k - 14) * 56);
const H_LINES = Array.from({ length: 30 }, (_, k) => (k - 10) * 56);

function MapSvg() {
  const { labels, pins, registerMap } = useMapContext();
  const carRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  useEffect(
    () => registerMap({ car: carRef.current, trail: trailRef.current }),
    [registerMap],
  );

  return (
    <svg viewBox="0 0 360 400" role="img" aria-label="Sample route map from pickup A to destination B">
      <rect x="-700" y="-700" width="1800" height="1800" fill="#14161a" />
      <ellipse cx="260" cy="300" rx="62" ry="40" fill="#12231f" />
      <g transform="rotate(-18 180 200)" stroke="#23262c" strokeWidth="3">
        {V_LINES.map((x) => (
          <line key={`v${x}`} x1={x} y1={-700} x2={x} y2={1100} />
        ))}
        {H_LINES.map((y) => (
          <line key={`h${y}`} x1={-700} y1={y} x2={1100} y2={y} />
        ))}
      </g>
      <path d="M-500 405 L 860 5" stroke="#2c2f36" strokeWidth="10" fill="none" />
      <path
        d="M10 -300 L40 -10 C 120 140, 140 300, 230 410 L 330 700"
        stroke="#292c33"
        strokeWidth="7"
        fill="none"
      />
      <text x="22" y="355" fill="#5d626b" fontSize="10">
        {labels.a}
      </text>
      <text x="262" y="48" fill="#5d626b" fontSize="10">
        {labels.b}
      </text>
      <path
        d={ROUTE}
        fill="none"
        stroke="#1fd6a0"
        strokeOpacity=".28"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 9"
      />
      <path
        ref={trailRef}
        d={ROUTE}
        fill="none"
        stroke="#1fd6a0"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {SAFE_SPOTS.map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <circle r="12" fill="#14352c" stroke="#1fd6a0" strokeWidth="1.5" />
          <svg
            x="-7"
            y="-7"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1fd6a0"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <use href="#i-shield" />
          </svg>
        </g>
      ))}
      <g transform="translate(70 330)">
        <circle r="16" fill="#1fd6a0" />
        <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#04241b">
          A
        </text>
      </g>
      <g transform="translate(292 72)">
        <circle r="16" fill="#1fd6a0" />
        <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#04241b">
          B
        </text>
      </g>
      <g ref={carRef} className="group">
        <circle
          r="16"
          className="hidden animate-ring fill-none stroke-am stroke-[3] [transform-box:fill-box] origin-center group-data-[dev=true]:stroke-rd group-data-[dev=true]:block group-data-[stopped=true]:block"
        />
        <polygon
          points="0,-15 11,13 0,7 -11,13"
          fill="#fff"
          stroke="#0d0e10"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
      {pins.map((p) => (
        <g key={p.key} transform={`translate(${p.x} ${p.y})`}>
          <circle r="13" fill="#ff5c5c" fillOpacity=".3" stroke="#ff5c5c" strokeWidth="2.5" />
          <text y="-20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ff8a8a">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

interface MapCardProps {
  /** Caption shown until the AWS connection state is known. */
  defaultTag: string;
  className?: string;
}

export function MapCard({ defaultTag, className }: MapCardProps) {
  const { awsLive } = useMapContext();
  const tag =
    awsLive === null
      ? defaultTag
      : 'Sample map, not live GPS · ' + (awsLive ? 'AWS connected' : 'AWS offline');

  return (
    <div className={`relative mb-3 overflow-hidden rounded-3xl bg-[#14161a] ${className ?? ''}`}>
      <div className="desk:absolute desk:inset-0 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full [&>svg]:overflow-visible desk:[&>svg]:h-full">
        <MapSvg />
      </div>
      <span
        className={`absolute bottom-2.5 left-3 rounded-full bg-black/60 px-2 py-[3px] text-[10.5px] ${
          awsLive ? 'text-ac' : 'text-[#9aa0a8]'
        }`}
      >
        {tag}
      </span>
    </div>
  );
}
