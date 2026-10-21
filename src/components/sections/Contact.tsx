"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MaskText, FadeUp, SectionLabel } from "../fx/Reveal";
import Magnetic from "../fx/Magnetic";
import ResumeButton from "../ResumeButton";
import ShaderField from "../fx/ShaderField";
import LiveClock from "../LiveClock";
import { person } from "@/lib/data";

const SOCIALS = [
  { label: "GitHub", href: person.links.github, handle: "princeakanerd" },
  { label: "LinkedIn", href: person.links.linkedin, handle: "prince-gajnani" },
  { label: "LeetCode", href: person.links.leetcode, handle: "Knight · 2000+" },
  { label: "Codeforces", href: person.links.codeforces, handle: "Specialist" },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <footer id="contact" className="relative isolate overflow-hidden pt-28 md:pt-40">
      {/* Mirrored shader bookend, dimmed so type stays legible over it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <ShaderField className="h-full w-full opacity-45" />
        <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-ink to-transparent" />
      </div>

      <div className="shell relative z-10">
        <SectionLabel index="(06)">Contact</SectionLabel>

        <div className="mt-14 md:mt-20">
          <MaskText as="h2" className="display-xl" text="Let's build" />
          <div className="flex flex-wrap items-baseline gap-x-8">
            <MaskText
              as="h2"
              className="display-xl text-ember"
              text="something fast."
              delay={0.12}
            />
          </div>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <FadeUp className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-ash">
              Open to software engineering roles and internships from 2027 — and
              always up for a conversation about systems, performance, or why
              your p99 looks like that.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={30}>
                <a
                  href={`mailto:${person.email}`}
                  data-cursor="Email"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ember px-7 py-4 font-mono text-xs tracking-[0.16em] text-ink uppercase"
                >
                  <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-600 ease-out-expo group-hover:translate-x-0" />
                  <span className="relative">Send an email</span>
                  <span className="relative transition-transform duration-400 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </Magnetic>

              <button
                onClick={copyEmail}
                data-cursor={copied ? "Copied" : "Copy"}
                className="rounded-full border border-line-strong px-6 py-4 font-mono text-xs tracking-[0.16em] uppercase transition-colors duration-400 hover:border-ember hover:text-ember"
              >
                {copied ? "Copied ✓" : "Copy address"}
              </button>

              <ResumeButton size="lg" />
            </div>

            <a
              href={`mailto:${person.email}`}
              className="mt-8 inline-block font-mono text-sm text-ash transition-colors hover:text-bone"
            >
              {person.email}
            </a>
            <p className="label mt-2">{person.phone}</p>
          </FadeUp>

          <div className="lg:col-span-6 lg:col-start-7">
            <FadeUp>
              <p className="label mb-2">Elsewhere</p>
            </FadeUp>
            <div className="border-t border-line">
              {SOCIALS.map((social, i) => (
                <FadeUp key={social.label} delay={i * 0.05}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="Visit"
                    className="group relative isolate flex items-center justify-between gap-6 overflow-hidden border-b border-line py-6"
                  >
                    <span className="absolute inset-0 z-0 origin-left scale-x-0 bg-ember transition-transform duration-600 ease-out-expo group-hover:scale-x-100" />
                    <span className="relative z-10 flex items-baseline gap-4 pl-0 transition-all duration-500 group-hover:pl-5">
                      <span className="label text-ember transition-colors group-hover:text-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-2xl font-semibold transition-colors group-hover:text-ink md:text-3xl">
                        {social.label}
                      </span>
                    </span>
                    <span className="label relative z-10 pr-0 transition-all duration-500 group-hover:pr-5 group-hover:text-ink/70">
                      {social.handle}
                    </span>
                  </a>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="mt-24 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line py-8 md:mt-32">
          <p className="label">
            © {new Date().getFullYear()} {person.first} {person.last}
          </p>
          <p className="label flex items-center gap-2">
            <span className="animate-ember-pulse inline-block h-1.5 w-1.5 rounded-full bg-ember" />
            {person.location} · <LiveClock /> {person.timezoneLabel}
          </p>
          <p className="label hidden md:block">Next.js · WebGL · Motion</p>
          <motion.a
            href="#top"
            data-cursor="Top"
            className="label transition-colors hover:text-ember"
            whileHover={{ y: -3 }}
          >
            Back to top ↑
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
