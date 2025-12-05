import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GalleryItem } from "./types";

interface GalleryHeroSliderProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
  prefersReducedMotion: boolean;
}

const GalleryHeroSlider: React.FC<GalleryHeroSliderProps> = ({
  items,
  onItemClick,
  prefersReducedMotion,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const highlightItems = items.slice(0, 5);

  useEffect(() => {
    if (prefersReducedMotion || !sliderRef.current) return;

    const slides = sliderRef.current.querySelectorAll(".hero-slide");
    
    gsap.fromTo(
      slides,
      { opacity: 0, x: 100, rotateY: -15 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }
    );
  }, [prefersReducedMotion]);

  const handleSlideChange = (index: number) => {
    if (prefersReducedMotion) {
      setActiveIndex(index);
      return;
    }

    const slides = sliderRef.current?.querySelectorAll(".hero-slide");
    if (!slides) return;

    gsap.to(slides[activeIndex], {
      scale: 0.9,
      opacity: 0.5,
      duration: 0.3,
    });

    gsap.to(slides[index], {
      scale: 1,
      opacity: 1,
      duration: 0.3,
    });

    setActiveIndex(index);
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      build: "bg-primary/20 text-primary border-primary/30",
      walkthrough: "bg-secondary/20 text-secondary border-secondary/30",
      demo: "bg-accent/20 text-accent border-accent/30",
      showcase: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
    };
    return colors[category] || colors.showcase;
  };

  return (
    <div className="relative mb-12">
      {/* Parallax background layer */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0v40" fill="none" stroke="hsl(215 12% 28%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      {/* Slider container */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {highlightItems.map((item, index) => (
          <div
            key={item.id}
            className={`hero-slide flex-shrink-0 w-[350px] md:w-[450px] snap-center cursor-pointer group
              ${index === activeIndex ? "scale-100" : "scale-95 opacity-70"}`}
            onClick={() => {
              handleSlideChange(index);
              onItemClick(item);
            }}
            onMouseEnter={() => handleSlideChange(index)}
          >
            <div className="relative rounded-xl overflow-hidden border border-border/50 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-[0_0_30px_hsl(180,100%,50%,0.2)]">
              {/* Media */}
              <div className="aspect-video bg-grid-bg relative overflow-hidden">
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt={`${item.title} - Project_Logic-gates ${item.category}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='450' height='253' fill='%232c323b'%3E%3Crect width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%233e454f' font-family='monospace' font-size='14'%3EImage Placeholder%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={item.poster || item.src.replace(".mp4", "_poster.png")}
                      alt={`${item.title} thumbnail`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='450' height='253' fill='%232c323b'%3E%3Crect width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%233e454f' font-family='monospace' font-size='14'%3EVideo Placeholder%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_hsl(180,100%,50%,0.5)]">
                        <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {item.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-1 text-xs font-mono bg-background/80 rounded text-foreground">
                        {item.duration}
                      </span>
                    )}
                  </div>
                )}

                {/* Circuit decoration overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`slideGrad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(180, 100%, 50%)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(160, 100%, 50%)" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#slideGrad-${item.id})`} />
                  </svg>
                </div>
              </div>

              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryBadge(item.category)}`}>
                    {item.category}
                  </span>
                  {item.type === "video" && (
                    <span className="text-[10px] font-mono text-muted-foreground">VIDEO</span>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-4">
        {highlightItems.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-primary w-8 shadow-[0_0_10px_hsl(180,100%,50%)]"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryHeroSlider;
