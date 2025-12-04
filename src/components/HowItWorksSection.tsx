import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "01",
      title: "Understand the Basics",
      description:
        "Start with transistors - the fundamental building blocks. Learn how a simple switch can become the foundation of all computing.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Build Logic Gates",
      description:
        "Combine transistors to create AND, OR, NOT, XOR, and more. Watch how binary decisions form the basis of digital logic.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h8l4 6-4 6H4V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M0 8h4M0 16h4" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Construct Complex Circuits",
      description:
        "Use gates to build adders, multiplexers, encoders, and decoders. See how simple components create powerful circuits.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Design the ALU",
      description:
        "Build the Arithmetic Logic Unit - the heart of any processor. Perform addition, subtraction, and logical operations.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6l3 5-3 5H9l-3-5 3-5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6" />
        </svg>
      ),
    },
    {
      number: "05",
      title: "Create Memory Systems",
      description:
        "Implement registers and latches. Store data and create the memory architecture that makes computing possible.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 9h16M4 14h16M9 4v16M14 4v16" />
        </svg>
      ),
    },
    {
      number: "06",
      title: "Build Your Computer",
      description:
        "Combine everything into a working CLI computer. Execute commands, run programs, and witness your creation come to life.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor">
          <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8M12 17v4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 8l3 2-3 2M11 12h4" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;

    if (section && timeline) {
      const items = timeline.querySelectorAll(".timeline-item");

      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: index % 2 === 0 ? -100 : 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate the connecting line
      const line = timeline.querySelector(".timeline-connector");
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 2,
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1,
            },
          }
        );
      }
    }
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-card/30"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 text-xs font-mono font-semibold tracking-widest text-secondary border border-secondary/30 rounded-full uppercase mb-6">
            The Journey
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="text-foreground">How It</span>{" "}
            <span className="text-secondary neon-text-green">Works</span>
          </h2>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Timeline connector */}
          <div className="timeline-connector absolute left-1/2 top-0 w-1 h-full -translate-x-1/2 origin-top bg-gradient-to-b from-primary via-secondary to-accent" />

          {/* Timeline items */}
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`timeline-item relative flex items-center gap-8 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`feature-card ${
                      index % 2 === 0 ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-4 mb-4 ${
                        index % 2 === 0 ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="font-mono text-4xl font-bold text-primary/30">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center node */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-card border-4 border-primary flex items-center justify-center animate-pulse-glow">
                  <div className="text-primary">{step.icon}</div>
                </div>

                {/* Spacer for alignment */}
                <div className="w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
