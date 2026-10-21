import { IntroProvider } from "@/components/fx/IntroProvider";
import Preloader from "@/components/fx/Preloader";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import Grain from "@/components/fx/Grain";
import ScrollProgress from "@/components/fx/ScrollProgress";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Path from "@/components/sections/Path";
import Achievements from "@/components/sections/Achievements";
import Sports from "@/components/sections/Sports";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <IntroProvider>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Grain />
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <About />
        <Work />
        <Path />
        <Achievements />
        <Sports />
        <Contact />
      </main>
    </IntroProvider>
  );
}
