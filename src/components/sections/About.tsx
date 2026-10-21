"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MaskText, FadeUp, SectionLabel, Stagger, StaggerItem } from "../fx/Reveal";
import Counter from "../fx/Counter";
import { person, stats } from "@/lib/data";

const SPEC = [
  { k: "Based in", v: "Gwalior, India" },
  { k: "Studying", v: "B.Tech + M.Tech, IT" },
  { k: "CGPA", v: "8.12 / 10" },
  { k: "Graduating", v: "June 2027" },
];

type Word = { text: string; em: boolean };

/** Splits on spaces; words between *asterisks* come back flagged for emphasis. */
function parseWords(text: string): Word[] {
  let open = false;
  return text.split(" ").map((raw) => {
    let word = raw;
    if (word.startsWith("*")) {
      open = true;
      word = word.slice(1);
    }
    const em = open;
    if (word.includes("*")) {
      open = false;
      word = word.replace("*", "");
    }
    return { text: word, em };
  });
}

/**
 * One chapter of the bio. Words light up as the paragraph crosses the
 * viewport; emphasised phrases turn ember and get an underline swipe, and the
 * gutter rule fills in step so the reader can see where they are.
 */
function LitParagraph({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });
  const words = parseWords(text);

  return (
    <div
      ref={ref}
      className="grid grid-cols-[2.5rem_1fr] gap-x-4 md:grid-cols-[3.5rem_1fr] md:gap-x-6"
      style={{ marginTop: index === 0 ? 0 : "3rem" }}
    >
      <div className="flex flex-col items-start gap-3 pt-2">
        <span className="font-mono text-xs tracking-[0.2em] text-ember">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="relative w-px flex-1 bg-line">
          <motion.span
            className="absolute inset-0 origin-top bg-ember"
            style={{ scaleY: scrollYProgress }}
          />
        </span>
      </div>

      {/* Real space characters between the word spans, rather than margin.
          Spacing the words with CSS alone leaves the text content as one
          run-on word for screen readers and for anyone copying the bio. */}
      <p className="text-2xl leading-[1.3] font-medium tracking-tight md:text-3xl lg:text-[2.15rem]">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Fragment key={i}>
              <LitWord progress={scrollYProgress} range={[start, end]} word={word} />{" "}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
}

function LitWord({
  progress,
  range,
  word,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  word: Word;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const lit = useTransform(progress, range, [0, 1]);
  const color = useTransform(lit, [0, 1], ["#f2ede7", "#ff4a1c"]);

  if (!word.em) {
    return (
      <motion.span style={{ opacity }} className="inline-block">
        {word.text}
      </motion.span>
    );
  }

  return (
    <motion.span style={{ opacity }} className="relative inline-block">
      <motion.span style={{ color }} className="font-serif text-[1.12em] font-normal italic">
        {word.text}
      </motion.span>
      <motion.span
        aria-hidden
        style={{ scaleX: lit }}
        className="absolute inset-x-0 bottom-[0.05em] h-0.5 origin-left bg-ember/70"
      />
    </motion.span>
  );
}

export default function About() {
  return (
    <section id="about" className="shell relative py-28 md:py-40">
      <SectionLabel index="(01)">About</SectionLabel>

      {/* The claim */}
      <div className="mt-12 max-w-5xl md:mt-16">
        <MaskText
          as="h2"
          className="display-lg"
          text="I care about the part of the system that only shows up under load."
        />
        <FadeUp delay={0.35} className="mt-6">
          <p className="font-serif text-2xl text-ember italic md:text-3xl">
            Everything is fast at n = 10.
          </p>
        </FadeUp>
      </div>

      {/* Copy + spec sheet */}
      <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7">
          {person.intro.map((para, i) => (
            <LitParagraph key={i} text={para} index={i} />
          ))}
        </div>

        <FadeUp className="lg:col-span-5" delay={0.1}>
          <div className="relative rounded-lg border border-line bg-ink-2/60 p-6 backdrop-blur-sm md:p-8">
            {/* corner ticks */}
            <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-ember" />
            <span className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-ember" />

            <p className="label mb-6">Spec sheet</p>
            <dl className="space-y-0">
              {SPEC.map((row) => (
                <div
                  key={row.k}
                  className="flex items-baseline gap-3 border-b border-line py-3 last:border-b-0"
                >
                  <dt className="font-mono text-[11px] tracking-[0.14em] whitespace-nowrap text-ash uppercase">
                    {row.k}
                  </dt>
                  <span className="h-px flex-1 bg-line" />
                  <dd className="font-mono text-xs text-bone md:text-[13px]">{row.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex items-center gap-3 rounded-md border border-ember/25 bg-ember/6 px-4 py-3">
              <span className="animate-ember-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
              <p className="font-mono text-[11px] leading-relaxed tracking-widest text-ember-soft uppercase">
                Open to software engineering roles from June 2027
              </p>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Numbers */}
      <Stagger className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem
            key={stat.label}
            className="group relative bg-ink px-5 py-8 transition-colors duration-500 hover:bg-ink-2 md:px-8 md:py-10"
          >
            <span className="absolute inset-x-0 top-0 h-px w-0 bg-ember transition-all duration-700 group-hover:w-full" />
            <div className="display-md tabular-nums">
              <Counter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </div>
            <p className="label mt-3 leading-relaxed">{stat.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
