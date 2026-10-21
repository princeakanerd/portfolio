"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { MaskText, SectionLabel } from "../fx/Reveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { sports } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Ball art — one per sport, keyed by index into `sports`.             */
/* `art` rotates as the ball rolls; the label layer stays upright.     */
/* ------------------------------------------------------------------ */

type BallSkin = {
  r: number;
  face: CSSProperties;
  art?: React.ReactNode;
  ink: string;
  /* Keeps the label legible over busy ball art. */
  shadow: string;
  /* Headline size in em; long headlines need a smaller one to stay inside. */
  head?: number;
};

const SKINS: BallSkin[] = [
  // Squash — black rubber, competition double yellow dot.
  {
    r: 112,
    ink: "#E8B64C",
    shadow: "0 1px 6px rgba(0,0,0,0.55)",
    face: { background: "radial-gradient(circle at 32% 28%, #3a3733 0%, #141210 45%, #050505 100%)" },
    art: (
      <>
        <span className="absolute top-[12%] left-[38%] h-[9%] w-[9%] rounded-full bg-[#F5D02B]" />
        <span className="absolute top-[12%] left-[52%] h-[9%] w-[9%] rounded-full bg-[#F5D02B]" />
      </>
    ),
  },
  // Table tennis — matte white with a moulding seam.
  {
    r: 82,
    ink: "#2B2F35",
    shadow: "0 0 6px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,0.9)",
    face: { background: "radial-gradient(circle at 32% 28%, #ffffff 0%, #ece8e1 55%, #b9b3aa 100%)" },
    art: <span className="absolute inset-x-0 top-1/2 h-px bg-black/15" />,
  },
  // Badminton — feather vanes around a cork.
  {
    r: 78,
    ink: "#080706",
    shadow: "0 0 6px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,0.9)",
    face: {
      background:
        "repeating-conic-gradient(from 0deg, #f4f1ec 0deg 14deg, #d9d4cc 14deg 15deg), #f4f1ec",
    },
    art: (
      <span className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff8256,#b32a08)] opacity-90" />
    ),
  },
  // Trekking — ember badge with two summits.
  {
    r: 94,
    head: 0.66,
    ink: "#f2ede7",
    shadow: "0 1px 6px rgba(0,0,0,0.55)",
    face: { background: "radial-gradient(circle at 32% 28%, #ff8256 0%, #ff4a1c 45%, #8a2006 100%)" },
    art: (
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-35">
        <path d="M0 78 L30 40 L44 56 L62 26 L100 78 Z" fill="#080706" />
        <path d="M62 26 L55 36 L62 33 L69 37 Z" fill="#f2ede7" />
      </svg>
    ),
  },
  // Marathon — running-track lanes.
  {
    r: 100,
    ink: "#f2ede7",
    shadow: "0 1px 6px rgba(0,0,0,0.55)",
    face: {
      background:
        "repeating-radial-gradient(circle, #b32a08 0 9px, #c9380f 9px 10px), #b32a08",
    },
    art: (
      <span className="absolute inset-[30%] rounded-full bg-[#2f6b3a] shadow-[inset_0_0_12px_rgba(0,0,0,0.5)]" />
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Physics                                                             */
/* ------------------------------------------------------------------ */

type Body = { x: number; y: number; vx: number; vy: number; r: number; a: number };
type Drag = { i: number; ox: number; oy: number; px: number; py: number; t: number; moved: number };

const GRAVITY = 2400;
const BOUNCE = 0.7;
const MAX_THROW = 3200;

/* Mutations live outside the component so the hooks linter doesn't read
   pointer handlers as render-time writes. */
function moveHeld(b: Body, d: Drag, x: number, y: number, t: number) {
  const dt = Math.max(0.008, (t - d.t) / 1000);
  b.x = x - d.ox;
  b.y = y - d.oy;
  // Smoothed so the release velocity reflects the last few frames.
  b.vx = b.vx * 0.4 + ((x - d.px) / dt) * 0.6;
  b.vy = b.vy * 0.4 + ((y - d.py) / dt) * 0.6;
  d.moved += Math.abs(x - d.px) + Math.abs(y - d.py);
  d.px = x;
  d.py = y;
  d.t = t;
}

function release(b: Body, d: Drag) {
  const speed = Math.hypot(b.vx, b.vy);
  if (speed > MAX_THROW) {
    b.vx *= MAX_THROW / speed;
    b.vy *= MAX_THROW / speed;
  }
  // A click, not a throw: give it a little hop so it still feels alive.
  if (d.moved < 6) b.vy = -900;
}

function bat(list: Body[], x: number, y: number, vx: number, vy: number) {
  for (const b of list) {
    if (Math.hypot(b.x - x, b.y - y) < b.r + 4) {
      b.vx += Math.max(-1400, Math.min(1400, vx * 0.35));
      b.vy += Math.max(-1400, Math.min(1400, vy * 0.35)) - 120;
    }
  }
}

function hop(b: Body | undefined, vy: number) {
  if (b) b.vy = vy;
}

function hold(b: Body) {
  b.vx = 0;
  b.vy = 0;
}

export default function Sports() {
  const reduced = usePrefersReducedMotion();
  const arenaRef = useRef<HTMLDivElement>(null);
  const ballRefs = useRef<(HTMLDivElement | null)[]>([]);
  const artRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const drag = useRef<Drag | null>(null);
  const cursor = useRef({ x: 0, y: 0, t: 0 });
  const inView = useInView(arenaRef, { once: true, margin: "0px 0px -20% 0px" });
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena || !inView) return;

    let w = arena.clientWidth;
    let h = arena.clientHeight;
    const scale = () => Math.min(1, Math.max(0.5, w / 820));

    const s = scale();
    bodies.current = SKINS.map((skin, i) => {
      const r = skin.r * s;
      const x = w * (0.12 + (0.76 * i) / (SKINS.length - 1));
      return reduced
        ? { x, y: h - r, vx: 0, vy: 0, r, a: 0 }
        : { x, y: -r - i * 160, vx: (i % 2 ? -1 : 1) * 120, vy: 0, r, a: 0 };
    });

    const ro = new ResizeObserver(() => {
      w = arena.clientWidth;
      h = arena.clientHeight;
      const k = scale();
      bodies.current.forEach((b, i) => (b.r = SKINS[i].r * k));
    });
    ro.observe(arena);

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const list = bodies.current;
      const held = drag.current?.i ?? -1;

      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        if (i !== held) {
          b.vy += GRAVITY * dt;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
        }
        if (b.y + b.r > h) {
          b.y = h - b.r;
          b.vy = Math.abs(b.vy) < 60 ? 0 : -b.vy * BOUNCE;
          b.vx *= 0.985; // rolling friction
        }
        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx = Math.abs(b.vx) * BOUNCE;
        } else if (b.x + b.r > w) {
          b.x = w - b.r;
          b.vx = -Math.abs(b.vx) * BOUNCE;
        }
        b.a += (b.vx * dt) / b.r;
      }

      // Circle-circle collisions. A held ball has infinite mass.
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const p = list[i];
            const q = list[j];
            const dx = q.x - p.x;
            const dy = q.y - p.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const overlap = p.r + q.r - dist;
            if (overlap <= 0) continue;

            const nx = dx / dist;
            const ny = dy / dist;
            const ip = i === held ? 0 : 1 / (p.r * p.r);
            const iq = j === held ? 0 : 1 / (q.r * q.r);
            const sum = ip + iq || 1;

            p.x -= nx * overlap * (ip / sum);
            p.y -= ny * overlap * (ip / sum);
            q.x += nx * overlap * (iq / sum);
            q.y += ny * overlap * (iq / sum);

            const rel = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
            if (rel < 0) {
              const jmp = (-(1 + BOUNCE) * rel) / sum;
              p.vx -= jmp * ip * nx;
              p.vy -= jmp * ip * ny;
              q.vx += jmp * iq * nx;
              q.vy += jmp * iq * ny;
            }
          }
        }
      }

      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        const el = ballRefs.current[i];
        const art = artRefs.current[i];
        if (!el) continue;
        el.style.width = el.style.height = `${b.r * 2}px`;
        el.style.fontSize = `${b.r * 0.4}px`;
        el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
        el.style.opacity = "1";
        if (art) art.style.transform = `rotate(${b.a}rad)`;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView, reduced]);

  const local = (e: PointerEvent) => {
    const r = arenaRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onBallDown = (i: number, e: PointerEvent<HTMLDivElement>) => {
    const b = bodies.current[i];
    if (!b) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = local(e);
    drag.current = { i, ox: x - b.x, oy: y - b.y, px: x, py: y, t: e.timeStamp, moved: 0 };
    hold(b);
    setActive(i);
    setTouched(true);
  };

  const onBallMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const { x, y } = local(e);
    moveHeld(bodies.current[d.i], d, x, y, e.timeStamp);
  };

  const onBallUp = () => {
    const d = drag.current;
    if (!d) return;
    release(bodies.current[d.i], d);
    drag.current = null;
  };

  // Swiping the cursor through a resting ball bats it.
  const onArenaMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current || e.pointerType !== "mouse") return;
    const { x, y } = local(e);
    const c = cursor.current;
    const dt = Math.max(0.008, (e.timeStamp - c.t) / 1000);
    cursor.current = { x, y, t: e.timeStamp };
    if (dt > 0.1) return;
    bat(bodies.current, x, y, (x - c.x) / dt, (y - c.y) / dt);
  };

  const sport = sports[active];

  return (
    <section className="relative py-28 md:py-36">
      <div className="shell">
        <SectionLabel index="(05)">Off the keyboard</SectionLabel>

        <div className="mt-12 flex flex-col gap-6 md:mt-16 md:flex-row md:items-end md:justify-between">
          <MaskText as="h2" className="display-lg max-w-3xl" text="Same discipline, different arena." />
          <p className="max-w-xs leading-relaxed text-ash">
            Every ball here is a result. Grab one, throw it, knock them into each
            other.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* Arena */}
          <div
            ref={arenaRef}
            onPointerMove={onArenaMove}
            className="relative h-[clamp(380px,62vh,560px)] touch-pan-y overflow-hidden rounded-2xl border border-line bg-ink-2/60 select-none lg:col-span-8"
            style={{
              backgroundImage:
                "linear-gradient(rgba(242,237,231,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(242,237,231,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            <span className="label pointer-events-none absolute top-5 left-5 z-0 text-ash-dim">
              Arena · {sports.length} balls
            </span>
            <AnimatePresence>
              {!touched && (
                <motion.span
                  className="label pointer-events-none absolute top-5 right-5 z-0 flex items-center gap-2 text-ember"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ← Grab &amp; throw
                </motion.span>
              )}
            </AnimatePresence>

            {sports.map((s, i) => {
              const skin = SKINS[i];
              const on = i === active;
              return (
                <div
                  key={s.event}
                  ref={(el) => {
                    ballRefs.current[i] = el;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${s.event}: ${s.note}`}
                  aria-pressed={on}
                  data-cursor="Throw"
                  onPointerDown={(e) => onBallDown(i, e)}
                  onPointerMove={onBallMove}
                  onPointerUp={onBallUp}
                  onPointerCancel={onBallUp}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(i);
                      hop(bodies.current[i], -1100);
                    }
                  }}
                  className="absolute top-0 left-0 z-10 cursor-grab touch-none rounded-full opacity-0 outline-none active:cursor-grabbing"
                  style={{ willChange: "transform" }}
                >
                  <div
                    className={`absolute inset-0 rounded-full transition-shadow duration-300 ${
                      on
                        ? "shadow-[0_0_0_3px_#080706,0_0_0_5px_#ff4a1c,0_20px_50px_-10px_rgba(255,74,28,0.6)]"
                        : "shadow-[0_18px_40px_-14px_rgba(0,0,0,0.8)]"
                    }`}
                  />
                  <div
                    ref={(el) => {
                      artRefs.current[i] = el;
                    }}
                    className="absolute inset-0 overflow-hidden rounded-full"
                    style={skin.face}
                  >
                    {skin.art}
                  </div>
                  {/* Specular highlight + upright label */}
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.35),transparent_40%)]" />
                  <div
                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
                    style={{ color: skin.ink, textShadow: skin.shadow }}
                  >
                    <span className="font-mono text-[max(9px,0.24em)] font-semibold tracking-[0.18em] uppercase opacity-85">
                      {s.event}
                    </span>
                    <span
                      style={{ fontSize: `${skin.head ?? 0.92}em` }}
                      className="mt-[0.18em] -skew-x-10 leading-none font-bold tracking-tight whitespace-nowrap tabular-nums">
                      {s.ball.head}
                    </span>
                    <span className="mt-[0.4em] font-mono text-[max(9px,0.22em)] font-semibold tracking-[0.12em] whitespace-nowrap uppercase opacity-85">
                      {s.ball.sub}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Readout */}
          <div className="relative min-h-[22rem] overflow-hidden rounded-2xl border border-line bg-ink-2/60 p-6 md:p-8 lg:col-span-4">
            <div className="flex items-center justify-between">
              <span className="label text-ember">Now showing</span>
              <span className="label font-mono text-ash-dim">
                {String(active + 1).padStart(2, "0")} / {String(sports.length).padStart(2, "0")}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={sport.event}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } }}
                className="mt-10"
              >
                <p className="-skew-x-10 text-[clamp(3.5rem,7vw,6rem)] leading-[0.85] font-bold tracking-tight text-ember tabular-nums">
                  {sport.result}
                </p>
                <p className="label mt-4 text-bone">{sport.note}</p>
                <h3 className="display-md mt-8 uppercase">{sport.event}</h3>
                <p className="mt-3 text-lg leading-relaxed text-bone/75">{sport.story}</p>
                <p className="label mt-6 text-ash">{sport.meet}</p>
                {sport.streak && (
                  <div className="mt-4 flex gap-2">
                    {Array.from({ length: sport.streak }, (_, k) => (
                      <motion.span
                        key={k}
                        className="block h-3 w-3 rounded-full bg-[#E8B64C] shadow-[0_0_12px_rgba(232,182,76,0.7)]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.2 + k * 0.12 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Direct picks — readable index, and the way in on touch/keyboard */}
        <div className="mt-4 flex flex-wrap gap-2">
          {sports.map((s, i) => (
            <button
              key={s.event}
              type="button"
              onClick={() => {
                setActive(i);
                hop(bodies.current[i], -1100);
              }}
              className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ${
                i === active
                  ? "border-ember bg-ember text-ink"
                  : "border-line text-ash hover:border-line-strong hover:text-bone"
              }`}
            >
              {s.event} · {s.result}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
