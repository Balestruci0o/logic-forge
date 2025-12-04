import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Transistors",
      description:
        "Learn how transistors work as electronic switches - the foundation of all digital circuits.",
      color: "primary",
      icon: "⚡",
    },
    {
      title: "Logic Gates",
      description:
        "Master AND, OR, NOT, NAND, NOR, XOR, XNOR gates and understand Boolean algebra.",
      color: "secondary",
      icon: "🔲",
    },
    {
      title: "ALU Design",
      description:
        "Build an Arithmetic Logic Unit capable of performing mathematical and logical operations.",
      color: "accent",
      icon: "🧮",
    },
    {
      title: "Registers",
      description:
        "Create memory storage using flip-flops and registers for data retention.",
      color: "primary",
      icon: "💾",
    },
    {
      title: "Memory Systems",
      description:
        "Understand RAM, ROM, and how computers store and retrieve information.",
      color: "secondary",
      icon: "🗄️",
    },
    {
      title: "Binary Math",
      description:
        "Master binary addition, subtraction, and the two's complement system.",
      color: "accent",
      icon: "🔢",
    },
    {
      title: "Encoders & Decoders",
      description:
        "Convert between different data formats and control signal routing.",
      color: "primary",
      icon: "🔄",
    },
    {
      title: "CLI Computer",
      description:
        "Combine all components to build a working command-line interface computer.",
      color: "secondary",
      icon: "💻",
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll(".feature-card-item");

    if (cards) {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 60,
          rotateX: -15,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          border: "hover:border-primary/50",
          glow: "group-hover:shadow-[0_0_30px_hsl(180,100%,50%,0.3)]",
          text: "text-primary",
          bg: "bg-primary/10",
        };
      case "secondary":
        return {
          border: "hover:border-secondary/50",
          glow: "group-hover:shadow-[0_0_30px_hsl(160,100%,50%,0.3)]",
          text: "text-secondary",
          bg: "bg-secondary/10",
        };
      case "accent":
        return {
          border: "hover:border-accent/50",
          glow: "group-hover:shadow-[0_0_30px_hsl(60,100%,50%,0.3)]",
          text: "text-accent",
          bg: "bg-accent/10",
        };
      default:
        return {
          border: "hover:border-primary/50",
          glow: "group-hover:shadow-[0_0_30px_hsl(180,100%,50%,0.3)]",
          text: "text-primary",
          bg: "bg-primary/10",
        };
    }
  };

  return (
    <section id="features" ref={sectionRef} className="relative py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-xs font-mono font-semibold tracking-widest text-accent border border-accent/30 rounded-full uppercase mb-6">
            Learn Everything
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">What You'll</span>{" "}
            <span className="text-accent neon-text-yellow">Master</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            From fundamental concepts to building a complete computer, explore every
            aspect of digital electronics.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className={`feature-card-item group relative p-6 rounded-xl bg-card/50 border border-border/50 ${colors.border} ${colors.glow} transition-all duration-500 cursor-pointer`}
                style={{ perspective: "1000px" }}
              >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-primary/5" />

                {/* Icon */}
                <div
                  className={`relative z-10 w-14 h-14 rounded-lg ${colors.bg} flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="relative z-10 font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Corner accent */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                >
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <path
                      d="M64 0 L64 64 L0 64"
                      fill="none"
                      stroke={`hsl(var(--${feature.color}))`}
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
