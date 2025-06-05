// Advanced animations and interactions
class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.initParallaxEffects();
    this.initTypewriterEffect();
    this.initParticleBackground();
    this.initHoverAnimations();
    this.initScrollTriggeredAnimations();
    this.initCursorEffect();
  }

  // Parallax scrolling effects
  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    if (parallaxElements.length === 0) return;

    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      parallaxElements.forEach((element) => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    // Use throttled scroll for better performance
    window.addEventListener("scroll", this.throttle(handleParallax, 16));
  }

  // Typewriter effect for hero text
  initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll(".typewriter");

    typewriterElements.forEach((element) => {
      const text = element.textContent;
      element.textContent = "";
      element.style.borderRight = "2px solid hsl(var(--primary))";

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          // Remove cursor after typing is complete
          setTimeout(() => {
            element.style.borderRight = "none";
          }, 1000);
        }
      };

      // Start typing after a delay
      setTimeout(typeWriter, 1000);
    });
  }

  // Animated particle background
  initParticleBackground() {
    const canvas = document.createElement("canvas");
    canvas.id = "particle-canvas";
    canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
        `;

    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(var(--primary) / ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      particles = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    createParticles();
    window.addEventListener("resize", createParticles);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(var(--primary) / ${
              0.1 * (1 - distance / 100)
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  // Enhanced hover animations
  initHoverAnimations() {
    // Service cards tilt effect
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
      });
    });

    // Portfolio items magnetic effect
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    portfolioItems.forEach((item) => {
      item.addEventListener("mousemove", (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        item.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });

      item.addEventListener("mouseleave", () => {
        item.style.transform = "translate(0, 0)";
      });
    });
  }

  // Scroll-triggered animations
  initScrollTriggeredAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.dataset.animation || "fadeIn";
          const delay = element.dataset.delay || 0;

          setTimeout(() => {
            element.classList.add(animationType);
          }, delay);

          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(
      ".service-card, .skill-item, .stat"
    );
    animatedElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.dataset.animation = "slideInUp";
      element.dataset.delay = index * 100;
      observer.observe(element);
    });
  }

  // Custom cursor effect
  initCursorEffect() {
    if (window.innerWidth < 768) return; // Skip on mobile devices

    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: hsl(var(--primary));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease-out;
        `;

    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      cursor.style.transform = `translate(${cursorX - 10}px, ${
        cursorY - 10
      }px)`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll(
      "a, button, .portfolio-item, .service-card"
    );
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.style.transform += " scale(1.5)";
        cursor.style.background = "hsl(var(--secondary))";
      });

      element.addEventListener("mouseleave", () => {
        cursor.style.transform = cursor.style.transform.replace(
          " scale(1.5)",
          ""
        );
        cursor.style.background = "hsl(var(--primary))";
      });
    });
  }

  // Utility function for throttling
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Text reveal animation
class TextRevealAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      duration: 1000,
      delay: 0,
      easing: "ease-out",
      ...options,
    };

    this.init();
  }

  init() {
    const text = this.element.textContent;
    this.element.innerHTML = "";

    const words = text.split(" ");
    words.forEach((word, index) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.overflow = "hidden";

      const letterSpan = document.createElement("span");
      letterSpan.textContent = word + " ";
      letterSpan.style.display = "inline-block";
      letterSpan.style.transform = "translateY(100%)";
      letterSpan.style.transition = `transform ${this.options.duration}ms ${this.options.easing}`;
      letterSpan.style.transitionDelay = `${
        this.options.delay + index * 100
      }ms`;

      wordSpan.appendChild(letterSpan);
      this.element.appendChild(wordSpan);
    });
  }

  reveal() {
    const letters = this.element.querySelectorAll("span span");
    letters.forEach((letter) => {
      letter.style.transform = "translateY(0)";
    });
  }
}

// Morphing shapes animation
class MorphingShapes {
  constructor(container) {
    this.container = container;
    this.shapes = [];
    this.init();
  }

  init() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;

    this.container.appendChild(svg);

    // Create morphing paths
    for (let i = 0; i < 3; i++) {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("fill", `hsla(var(--primary) / 0.1)`);
      path.setAttribute("d", this.generateRandomPath());

      svg.appendChild(path);
      this.shapes.push(path);
    }

    this.animate();
  }

  generateRandomPath() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    const points = [];
    for (let i = 0; i < 6; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
      });
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cp1x = points[i - 1].x + (Math.random() - 0.5) * 100;
      const cp1y = points[i - 1].y + (Math.random() - 0.5) * 100;
      const cp2x = points[i].x + (Math.random() - 0.5) * 100;
      const cp2y = points[i].y + (Math.random() - 0.5) * 100;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
    }
    path += " Z";

    return path;
  }

  animate() {
    setInterval(() => {
      this.shapes.forEach((shape) => {
        shape.style.transition = "d 2s ease-in-out";
        shape.setAttribute("d", this.generateRandomPath());
      });
    }, 3000);
  }
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize advanced animations on desktop
  if (window.innerWidth > 768) {
    new AnimationController();

    // Add text reveal to hero title
    const heroTitle = document.querySelector(".hero-name");
    if (heroTitle) {
      const textReveal = new TextRevealAnimation(heroTitle, {
        duration: 800,
        delay: 500,
      });

      setTimeout(() => {
        textReveal.reveal();
      }, 1000);
    }

    // Add morphing shapes to hero section
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      new MorphingShapes(heroSection);
    }
  }
});

// Add CSS for additional animations
const additionalStyles = `
    .slideInUp {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fadeInLeft {
        animation: fadeInLeft 0.8s ease-out forwards;
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .fadeInRight {
        animation: fadeInRight 0.8s ease-out forwards;
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .scaleIn {
        animation: scaleIn 0.6s ease-out forwards;
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AnimationController, TextRevealAnimation, MorphingShapes };
}
