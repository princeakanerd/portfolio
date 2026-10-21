"use client";

import { MaskText, SectionLabel, Stagger, StaggerItem } from "../fx/Reveal";
import Marquee from "../fx/Marquee";
import { achievements } from "@/lib/data";

const SPAN = {
  lg: "md:col-span-6 lg:col-span-6 md:row-span-2",
  md: "md:col-span-6 lg:col-span-3",
  sm: "md:col-span-3 lg:col-span-3",
  third: "md:col-span-4 lg:col-span-4",
} as const;

export default function Achievements() {
  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <SectionLabel index="(04)">Proof of work</SectionLabel>

        <div className="mt-12 md:mt-16">
          <MaskText
            as="h2"
            className="display-lg max-w-4xl"
            text="1,900 problems, and the ones that counted."
          />
        </div>

        <Stagger
          className="mt-16 grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-3 md:grid-cols-12"
          amount={0.1}
        >
          {achievements.map((item) => {
            const isHero = item.weight === "lg";
            const Wrapper = item.href ? "a" : "div";
            return (
              <StaggerItem
                key={item.title}
                className={`${SPAN[item.weight]} min-w-0`}
              >
                <Wrapper
                  {...(item.href
                    ? {
                        href: item.href,
                        target: "_blank",
                        rel: "noreferrer",
                        "data-cursor": "Profile",
                      }
                    : {})}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border p-6 transition-all duration-500 md:p-8 ${
                    isHero
                      ? "border-ember/35 bg-ember/7 hover:bg-ember/11"
                      : "border-line bg-ink-2/50 hover:-translate-y-1 hover:border-line-strong hover:bg-ink-3/60"
                  }`}
                >
                  {isHero && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,74,28,0.5), transparent 70%)",
                      }}
                    />
                  )}

                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className={`label ${isHero ? "text-ember" : "text-ash"}`}
                    >
                      {item.tag}
                    </span>
                    {item.href && (
                      <span className="text-ash transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember">
                        ↗
                      </span>
                    )}
                  </div>

                  <div className={`relative ${isHero ? "mt-10 flex-1" : "mt-6"}`}>
                    <p
                      className={`tabular-nums transition-colors duration-500 ${
                        isHero
                          ? "text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.85] font-bold tracking-[-0.045em] text-ember"
                          : "display-md text-bone group-hover:text-ember"
                      }`}
                    >
                      {item.figure}
                    </p>
                    {"figureLabel" in item && item.figureLabel && (
                      <p className="mt-5 font-serif text-2xl text-bone/80 italic md:text-3xl">
                        {item.figureLabel}
                      </p>
                    )}
                  </div>

                  <div className={`relative ${isHero ? "mt-10" : "mt-5"}`}>
                    <h3
                      className={
                        isHero
                          ? "display-md text-balance"
                          : "text-lg font-semibold text-balance text-bone"
                      }
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mt-1.5 leading-relaxed text-bone/65 ${
                        isHero ? "text-base md:text-lg" : "text-sm"
                      }`}
                    >
                      {item.detail}
                    </p>
                  </div>
                </Wrapper>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      {/* Counter-scrolling texture band */}
      <div className="mt-24 space-y-3 border-y border-line py-8 md:mt-32">
        <Marquee
          duration={46}
          items={["ICPC", "Codeforces Specialist", "LeetCode Knight", "CodeChef 4★", "GATE CSE", "IICPC Codefest"].map(
            (t) => (
              <span
                key={t}
                className="display-md whitespace-nowrap text-ash-dim/50"
              >
                {t}
              </span>
            ),
          )}
        />
        <Marquee
          duration={54}
          reverse
          items={["Rust", "Tokio", "Actix-Web", "PostgreSQL", "Redis Streams", "Kubernetes", "Socket.io", "AWS Bedrock"].map(
            (t) => (
              <span
                key={t}
                className="display-md whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgba(242,237,231,0.22)]"
              >
                {t}
              </span>
            ),
          )}
        />
      </div>
    </section>
  );
}
