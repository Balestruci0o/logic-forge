/**
 * Project_Logic-gates - GSAP Animations
 * All scroll-triggered and interactive animations
 */

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  initAnimations();
}

function initAnimations() {
  // ========================================
  // Navigation Animation
  // ========================================
  gsap.from('#navigation', {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.2
  });

  // ========================================
  // Hero Section Animations
  // ========================================
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  heroTl.from('.hero-badge', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.5
  })
  .from('.hero-title', {
    opacity: 0,
    y: 50,
    duration: 1
  }, '-=0.4')
  .from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 0.8
  }, '-=0.5')
  .from('.hero-buttons', {
    opacity: 0,
    y: 20,
    duration: 0.6
  }, '-=0.3')
  .from('.scroll-indicator', {
    opacity: 0,
    y: 20,
    duration: 0.6
  }, '-=0.2');

  // Hero dots floating animation
  gsap.utils.toArray('.hero-dot').forEach((dot, i) => {
    gsap.to(dot, {
      y: 'random(-20, 20)',
      x: 'random(-10, 10)',
      duration: 'random(2, 4)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.1
    });
  });

  // ========================================
  // About Section Animations
  // ========================================
  gsap.from('.about-content > *', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: -50,
    duration: 0.8,
    stagger: 0.15
  });

  // Diagram animation
  gsap.from('.diagram-path', {
    scrollTrigger: {
      trigger: '.about-diagram',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    strokeDasharray: 500,
    strokeDashoffset: 500,
    duration: 1.5,
    stagger: 0.2,
    onComplete: function() {
      gsap.set('.diagram-path', { opacity: 1 });
    }
  });

  gsap.from('.diagram-node', {
    scrollTrigger: {
      trigger: '.about-diagram',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    delay: 0.5
  });

  // ========================================
  // How It Works Timeline Animations
  // ========================================
  gsap.from('.timeline-line', {
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1
    },
    scaleY: 0,
    transformOrigin: 'top center'
  });

  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    const isLeft = item.classList.contains('timeline-left');
    
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      x: isLeft ? -100 : 100,
      duration: 0.8
    });
  });

  // ========================================
  // Features Section Animations
  // ========================================
  gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 60,
      rotateX: -15,
      duration: 0.8,
      delay: i * 0.1,
      onComplete: function() {
        gsap.set(card, { clearProps: 'all' });
        card.style.opacity = 1;
        card.style.transform = 'none';
      }
    });
  });

  // ========================================
  // Gallery Section Animations
  // ========================================
  
  // Header animation
  gsap.from('#gallery .section-header > *', {
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15
  });

  // Horizontal gallery items with parallax
  gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      x: 100,
      rotateY: -15,
      duration: 0.8,
      delay: i * 0.15,
      onComplete: function() {
        gsap.set(item, { clearProps: 'all' });
        item.style.opacity = 1;
        item.style.transform = 'none';
      }
    });
  });

  // Gallery grid items
  gsap.utils.toArray('.gallery-grid-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.1,
      onComplete: function() {
        gsap.set(item, { clearProps: 'all' });
        item.style.opacity = 1;
        item.style.transform = 'none';
      }
    });
  });

  // Parallax effect on scroll for gallery items
  ScrollTrigger.create({
    trigger: '.gallery-horizontal',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const items = document.querySelectorAll('.gallery-item');
      items.forEach((item, i) => {
        const speed = 0.1 + (i * 0.02);
        gsap.to(item, {
          y: self.progress * -30 * speed,
          duration: 0.1
        });
      });
    }
  });

  // Background glow animations
  gsap.to('.glow-1', {
    x: 50,
    y: -30,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.glow-2', {
    x: -50,
    y: 30,
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 2
  });

  gsap.to('.glow-3', {
    scale: 1.2,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1
  });

  // ========================================
  // Calculator Section Animations
  // ========================================
  gsap.from('.calculator-wrapper', {
    scrollTrigger: {
      trigger: '#calculator',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 0.8
  });

  // ========================================
  // CTA Section Animations
  // ========================================
  gsap.from('.cta-content > *', {
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    scale: 0.95,
    duration: 0.8,
    stagger: 0.15
  });

  // CTA glows animation
  gsap.to('.cta-glow-1', {
    x: 100,
    y: -50,
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.cta-glow-2', {
    x: -100,
    y: 50,
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 3
  });

  // ========================================
  // Mascot Animation
  // ========================================
  const mascot = document.querySelector('.mascot');
  if (mascot) {
    gsap.to(mascot, {
      scrollTrigger: {
        trigger: '#about',
        start: 'top center',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      duration: 0.8
    });

    // Floating animation
    gsap.to(mascot, {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1
    });

    // Subtle rotation on scroll
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.to(mascot, {
          rotation: Math.sin(self.progress * Math.PI * 2) * 5,
          duration: 0.3
        });
      }
    });
  }

  // ========================================
  // Hover Animations for Feature Cards
  // ========================================
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  // ========================================
  // Gallery Item Hover Effects
  // ========================================
  document.querySelectorAll('.gallery-item').forEach(item => {
    const frame = item.querySelector('.gallery-frame');
    
    item.addEventListener('mouseenter', () => {
      gsap.to(frame, {
        borderColor: 'hsl(180, 100%, 50%)',
        boxShadow: 'inset 0 0 20px hsla(180, 100%, 50%, 0.2)',
        duration: 0.3
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(frame, {
        borderColor: 'transparent',
        boxShadow: 'none',
        duration: 0.3
      });
    });
  });

  // ========================================
  // Scroll Progress Indicator (Optional)
  // ========================================
  // You can add a progress bar at the top of the page
  
  // ========================================
  // Refresh ScrollTrigger on resize
  // ========================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
}

// Log initialization
console.log('Project_Logic-gates: GSAP animations initialized');