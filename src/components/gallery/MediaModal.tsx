import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GalleryItem } from "./types";

interface MediaModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  isMuted: boolean;
  onClose: () => void;
  onNavigate: (direction: "next" | "prev") => void;
  onToggleMute: () => void;
  prefersReducedMotion: boolean;
}

const MediaModal: React.FC<MediaModalProps> = ({
  item,
  isOpen,
  isMuted,
  onClose,
  onNavigate,
  onToggleMute,
  prefersReducedMotion,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Animation on open/close
  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;

    if (isOpen) {
      if (prefersReducedMotion) {
        gsap.set(modalRef.current, { display: "flex", opacity: 1 });
        gsap.set(contentRef.current, { scale: 1, opacity: 1 });
      } else {
        gsap.set(modalRef.current, { display: "flex" });
        gsap.fromTo(
          modalRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
        gsap.fromTo(
          contentRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
        );
      }
    } else {
      if (prefersReducedMotion) {
        gsap.set(modalRef.current, { display: "none" });
      } else {
        gsap.to(contentRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.2,
        });
        gsap.to(modalRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.set(modalRef.current, { display: "none" });
          },
        });
      }
    }
  }, [isOpen, prefersReducedMotion]);

  // Play video when modal opens
  useEffect(() => {
    if (isOpen && item?.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, item]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!item) return null;

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
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 items-center justify-center hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Electric pulse background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl shadow-[0_0_50px_hsl(180,100%,50%,0.2)]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons */}
        <button
          onClick={() => onNavigate("prev")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Previous item"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => onNavigate("next")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Next item"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Media */}
        <div className="aspect-video bg-grid-bg relative">
          {item.type === "image" ? (
            <img
              src={item.src}
              alt={`${item.title} - Project_Logic-gates ${item.category}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={item.src}
                poster={item.poster}
                muted={isMuted}
                loop
                controls
                playsInline
                className="w-full h-full object-contain"
                aria-label={`${item.title} video - ${item.description}`}
              />
              
              {/* Mute overlay button */}
              <button
                onClick={onToggleMute}
                className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="p-6 bg-gradient-to-t from-card to-card/90">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded border ${getCategoryBadge(item.category)}`}>
              {item.category}
            </span>
            {item.type === "video" && item.duration && (
              <span className="text-xs font-mono text-muted-foreground">
                Duration: {item.duration}
              </span>
            )}
          </div>
          <h2 id="modal-title" className="font-display text-2xl font-bold text-foreground mb-2">
            {item.title}
          </h2>
          <p className="text-muted-foreground">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
