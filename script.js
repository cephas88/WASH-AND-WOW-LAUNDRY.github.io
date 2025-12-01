/**
 * WASH AND WOW LAUNDRY
 * Premium Interactive Features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSlideshow();
  initScrollReveal();
  initCounterAnimation();
  initSmoothScroll();
  initHeaderScroll();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * Hero Image Slideshow
 */
function initHeroSlideshow() {
  const heroImages = [
    'colourful.webp',
    'bucket.webp',
    'blanket.webp',
    'towel.webp',
    'suit.webp',
    'shoe.webp',
    'curtain.webp',
  ];

  const heroImg = document.getElementById('hero-slideshow');
  if (!heroImg) return;

  let currentIndex = 0;

  // Preload all images
  heroImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Start slideshow
  setInterval(() => {
    const nextIndex = (currentIndex + 1) % heroImages.length;
    
    // Fade out
    heroImg.style.opacity = '0';
    heroImg.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      heroImg.src = heroImages[nextIndex];
      // Fade in
      heroImg.style.opacity = '1';
      heroImg.style.transform = 'scale(1)';
      currentIndex = nextIndex;
    }, 500);
  }, 5000);
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.service-card, .feature-card, .offer-card, .section-header, .about-image, .about-content, .contact-info, .contact-cta'
  );

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach((element, index) => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        // Add staggered delay based on element index within its parent
        const siblings = element.parentElement?.children;
        const siblingIndex = siblings ? Array.from(siblings).indexOf(element) : 0;
        const delay = siblingIndex * 0.1;
        
        element.style.transitionDelay = `${delay}s`;
        element.classList.add('reveal', 'active');
      }
    });
  };

  // Initial check
  setTimeout(revealOnScroll, 100);
  
  // Check on scroll
  window.addEventListener('scroll', revealOnScroll, { passive: true });
}

/**
 * Counter Animation for Stats
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const animateCounters = () => {
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 50 && !hasAnimated) {
      hasAnimated = true;
      
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
      });
    }
  };

  window.addEventListener('scroll', animateCounters, { passive: true });
  // Check on load
  setTimeout(animateCounters, 500);
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Header Background Change on Scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial check
  handleScroll();
}

/**
 * Service Card Hover Effect Enhancement
 */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.zIndex = '10';
  });
  
  card.addEventListener('mouseleave', () => {
    setTimeout(() => {
      card.style.zIndex = '';
    }, 300);
  });
});

/**
 * Parallax Effect for Hero Background (subtle)
 */
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  
  if (hero && scrolled < window.innerHeight) {
    const heroContent = hero.querySelector('.hero-content');
    const heroVisual = hero.querySelector('.hero-visual');
    
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    if (heroVisual) {
      heroVisual.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
  }
}, { passive: true });

/**
 * Add touch-friendly interactions for mobile
 */
if ('ontouchstart' in window) {
  document.querySelectorAll('.service-card, .feature-card, .offer-card').forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.transform = 'translateY(-5px)';
    }, { passive: true });
    
    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.style.transform = '';
      }, 200);
    }, { passive: true });
  });
}

/**
 * Lazy load images that are below the fold
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Bubble animation enhancement - randomize on page load
 */
document.querySelectorAll('.bubble').forEach(bubble => {
  const randomDelay = Math.random() * 5;
  const randomDuration = 12 + Math.random() * 10;
  bubble.style.animationDelay = `${randomDelay}s`;
  bubble.style.animationDuration = `${randomDuration}s`;
});
