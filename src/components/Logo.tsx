import { useEffect, useRef } from "react";
import gsap from "gsap";

const Logo = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div ref={logoRef} className="flex items-center gap-3 group cursor-pointer">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          {/* Outer glow */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
              <stop offset="100%" stopColor="hsl(160, 100%, 50%)" />
            </linearGradient>
          </defs>
          
          {/* Logic gate shape */}
          <path
            d="M5 10 L20 10 Q35 20 20 30 L5 30 Z"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            filter="url(#glow)"
            className="transition-all duration-300 group-hover:stroke-[3]"
          />
          
          {/* Input dots */}
          <circle cx="5" cy="15" r="2" fill="hsl(180, 100%, 50%)" filter="url(#glow)" />
          <circle cx="5" cy="25" r="2" fill="hsl(180, 100%, 50%)" filter="url(#glow)" />
          
          {/* Output dot */}
          <circle cx="32" cy="20" r="2" fill="hsl(160, 100%, 50%)" filter="url(#glow)" />
          
          {/* Connection lines */}
          <line x1="0" y1="15" x2="5" y2="15" stroke="hsl(60, 100%, 50%)" strokeWidth="1.5" />
          <line x1="0" y1="25" x2="5" y2="25" stroke="hsl(60, 100%, 50%)" strokeWidth="1.5" />
          <line x1="32" y1="20" x2="40" y2="20" stroke="hsl(120, 100%, 60%)" strokeWidth="1.5" />
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className="font-display text-lg font-bold tracking-wider text-foreground">
          Project_
        </span>
        <span className="font-display text-sm font-semibold tracking-widest text-primary neon-text">
          Logic-gates
        </span>
      </div>
    </div>
  );
};

export default Logo;
