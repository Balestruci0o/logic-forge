import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryItem } from "./types";

gsap.registerPlugin(ScrollTrigger);

interface GalleryGridProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
  prefersReducedMotion: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  onItemClick,
  prefersReducedMotion,
  isMuted,
  onToggleMute,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Setup intersection observer for video autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      observer.observe(video);
    });

    return () => observer.disconnect();
  }, [items]);

  // GSAP scroll animations
  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".gallery-card");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Add hover animations
    cards.forEach((card) => {
      const outline = card.querySelector(".neon-outline");
      
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 1.02, duration: 0.3, ease: "power2.out" });
        if (outline) {
          gsap.to(outline, { opacity: 1, duration: 0.3 });
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
        if (outline) {
          gsap.to(outline, { opacity: 0, duration: 0.3 });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [prefersReducedMotion, items]);

  const setVideoRef = useCallback((id: string, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(id, el);
    } else {
      videoRefs.current.delete(id);
    }
  }, []);

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      build: "bg-primary/20 text-primary border-primary/30",
      walkthrough: "bg-secondary/20 text-secondary border-secondary/30",
      demo: "bg-accent/20 text-accent border-accent/30",
      showcase: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
    };
    return colors[category] || colors.showcase;
  };

  // Skip first 5 items shown in hero slider
  const gridItems = items.slice(5);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {gridItems.map((item) => (
        <figure
          key={item.id}
          className="gallery-card relative group cursor-pointer rounded-xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300"
          onClick={() => onItemClick(item)}
        >
          {/* Neon outline effect */}
          <div className="neon-outline absolute inset-0 rounded-xl opacity-0 pointer-events-none border-2 border-primary shadow-[0_0_15px_hsl(180,100%,50%,0.3),inset_0_0_15px_hsl(180,100%,50%,0.1)]" />

          {/* Circuit trace decoration */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-20 pointer-events-none">
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <path d="M64 0v32h-16v16h-16v16" fill="none" stroke="hsl(180, 100%, 50%)" strokeWidth="1" />
              <circle cx="48" cy="32" r="2" fill="hsl(180, 100%, 50%)" />
              <circle cx="32" cy="48" r="2" fill="hsl(160, 100%, 50%)" />
            </svg>
          </div>

          {/* Media container */}
          <div className="aspect-[4/3] bg-grid-bg relative overflow-hidden">
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={`${item.title} - Project_Logic-gates ${item.category}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%232c323b'%3E%3Crect width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%233e454f' font-family='monospace' font-size='12'%3EImage Placeholder%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => setVideoRef(item.id, el)}
                  src={item.src}
                  poster={item.poster}
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label={`${item.title} video - ${item.description}`}
                  onError={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.style.display = "none";
                  }}
                />
                
                {/* Play indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Mute toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute();
                  }}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>

                {/* Duration badge */}
                {item.duration && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-mono bg-background/80 rounded text-foreground">
                    {item.duration}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          <figcaption className="p-4 bg-gradient-to-t from-card to-card/80">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryBadge(item.category)}`}>
                {item.category}
              </span>
            </div>
            <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default GalleryGrid;
