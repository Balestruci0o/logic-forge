import { useEffect, useRef } from "react";
import gsap from "gsap";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".hero-animate",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.2 }
    );
  }, []);

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(hsl(215 12% 28%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 12% 28%) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundColor: 'hsl(215 18% 20%)'
      }} />

      {/* Animated dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.2}s`,
              boxShadow: '0 0 10px hsl(180, 100%, 50%)'
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="hero-animate mb-6">
          <span className="inline-block px-4 py-2 text-xs font-mono font-semibold tracking-widest text-secondary border border-secondary/30 rounded-full uppercase">
            Digital Logic Education Platform
          </span>
        </div>

        <h1 className="hero-animate font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="text-primary neon-text">Project_</span>
          <br />
          <span className="text-foreground">Logic-gates</span>
        </h1>

        <p className="hero-animate max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-body mb-10 leading-relaxed">
          Master digital electronics from the ground up. Build your understanding from
          transistors to logic gates, from ALUs to a complete CLI computer.
        </p>

        <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => scrollToSection("#demo")} className="btn-neon text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try Demo
            </span>
          </button>
          <button onClick={() => scrollToSection("#about")} className="btn-neon btn-neon-green text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="text-xs font-mono text-muted-foreground block mb-2">Scroll</span>
        <svg className="w-6 h-6 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
