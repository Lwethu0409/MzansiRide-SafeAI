import { useCallback, useEffect, useRef } from 'react';
import type { SimState } from '../types';

export interface MapHandle {
  car: SVGGElement | null;
  trail: SVGPathElement | null;
}

/**
 * Drives the simulated car along the route. Position is written straight to the
 * SVG elements each frame (no React re-render at 60fps), exactly like the
 * original requestAnimationFrame loop.
 */
export function useSimulation(onArrive: () => void) {
  const sim = useRef<SimState>({ p: 0, run: false, stopped: false, dev: false, off: 0, speed: 1 / 240000 });
  const curXY = useRef<[number, number] | null>(null);
  const maps = useRef<Set<MapHandle>>(new Set());
  const arriveRef = useRef(onArrive);
  arriveRef.current = onArrive;

  const registerMap = useCallback((handle: MapHandle) => {
    maps.current.add(handle);
    return () => {
      maps.current.delete(handle);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      const routeEl = [...maps.current].find((m) => m.trail)?.trail;
      if (!routeEl || !routeEl.getTotalLength) return;
      const s = sim.current;
      const len = routeEl.getTotalLength();
      const d = s.p * len;
      const a = routeEl.getPointAtLength(d);
      const b = routeEl.getPointAtLength(Math.min(len, d + 2));
      const dx = b.x - a.x || 0.001;
      const dy = b.y - a.y;
      const m = Math.hypot(dx, dy) || 1;
      const x = a.x - (dy / m) * s.off;
      const y = a.y + (dx / m) * s.off;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      curXY.current = [x, y];
      maps.current.forEach(({ car, trail }) => {
        if (car) {
          car.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(0)})`);
          car.dataset.stopped = String(s.stopped);
          car.dataset.dev = String(s.dev);
        }
        trail?.setAttribute('stroke-dasharray', `${d.toFixed(1)} 9999`);
      });
    };

    const frame = (t: number) => {
      const dt = t - last;
      last = t;
      const s = sim.current;
      if (s.run && !s.stopped && s.p < 1) {
        s.p = Math.min(1, s.p + dt * s.speed);
        if (s.p >= 1) {
          s.run = false;
          arriveRef.current();
        }
      }
      s.off += ((s.dev ? 46 : 0) - s.off) * Math.min(1, dt / 400);
      draw();
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { sim, curXY, registerMap };
}
