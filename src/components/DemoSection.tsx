import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogicSimulator from "./simulator/LogicSimulator";

gsap.registerPlugin(ScrollTrigger);

const DemoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-b from-background via-card/30 to-background"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-4 py-2 text-xs font-mono font-semibold tracking-widest text-primary border border-primary/30 rounded-full uppercase mb-6">
            Interactive Demo
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Logic Gate</span>{" "}
            <span className="text-primary neon-text">Simulator</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Build and test digital circuits in real-time. Drag components, connect ports,
            and watch signals flow through your designs.
          </p>
        </div>

        <div className="max-w-[1100px] mx-auto">
          <LogicSimulator />
        </div>

        {/* Quick tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: "🔌", tip: "Connect outputs to inputs by clicking ports" },
            { icon: "⚡", tip: "Double-click switches to toggle their state" },
            { icon: "🗑️", tip: "Select a component and press DELETE to remove it" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/30"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm text-muted-foreground">{item.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
