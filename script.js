/**
 * WASH AND WOW LAUNDRY
 * Premium Interactive Features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSlideshow();
  initReviewsSection();
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
    '.service-card, .feature-card, .offer-card, .section-header, .about-image, .about-content, .review-form-card, .reviews-marquee, .contact-info, .contact-cta'
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
 * Reviews section with custom defaults + user submissions
 */
function initReviewsSection() {
  const reviewsTrack = document.getElementById('reviews-track');
  const reviewForm = document.getElementById('review-form');
  const nameInput = document.getElementById('review-name');
  const reviewInput = document.getElementById('review-text');
  const overallRating = document.getElementById('overall-rating');
  const formMessage = document.getElementById('review-form-message');

  if (!reviewsTrack || !reviewForm || !nameInput || !reviewInput || !formMessage || !overallRating) return;

  const storageKey = 'washandwow-user-reviews';
  const baseReviews = [
    { name: 'Amina', rating: 5, review: 'Fast pickup and my clothes came back smelling fresh and neatly folded. Great service!' },
    { name: 'Kevin', rating: 5, review: 'Very professional team. My white shirts were spotless and perfectly ironed.' },
    { name: 'Faith', rating: 4, review: 'I loved the communication and timely delivery. Definitely using Wash & Wow again.' },
    { name: 'Brian', rating: 5, review: 'They handled my suits with excellent care. Looked brand new after cleaning.' },
    { name: 'Diana', rating: 4, review: 'Affordable prices and quality work. The free delivery made it super convenient.' },
    { name: 'Peter', rating: 5, review: 'The duvet cleaning service was amazing. It came back fluffy and very clean.' },
    { name: 'Mercy', rating: 5, review: 'Customer service was friendly and helpful. Clothes were ready exactly when promised.' },
    { name: 'Samuel', rating: 5, review: 'Best laundry experience I have had in Thika. Highly recommended to everyone.' },
    { name: 'Joan', rating: 4, review: 'My kids clothes were cleaned gently and still smelled fantastic. Thank you!' },
    { name: 'Daniel', rating: 5, review: 'Quick turnaround and no missing items. Everything returned in perfect condition.' },
    { name: 'Lucy', rating: 5, review: 'I use them every week now. Consistent quality and excellent finishing.' },
    { name: 'James', rating: 4, review: 'Great stain removal on my work uniforms. Impressed with the results.' },
    { name: 'Ruth', rating: 5, review: 'The team is polite and dependable. Pickup and drop off were very smooth.' },
    { name: 'Dennis', rating: 4, review: 'Shoe cleaning was top notch. My sneakers looked fresh and bright again.' },
    { name: 'Grace', rating: 5, review: 'Very clean packaging and neat folding. You can tell they pay attention to detail.' },
    { name: 'Esther', rating: 5, review: 'Laundry was handled with care and delivered on time. Wonderful service overall.' },
    { name: 'Alex', rating: 4, review: 'Fair pricing and premium results. I appreciate the reliability every single time.' },
    { name: 'Caroline', rating: 5, review: 'The ironing quality is excellent. My outfits were ready for work immediately.' },
    { name: 'John', rating: 4, review: 'Friendly staff and easy booking process through phone. Super convenient service.' },
    { name: 'Naomi', rating: 5, review: 'Excellent neighborhood laundry partner. Clean, fresh, and always professional.' }
  ];

  const escapeHtml = (text) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const loadUserReviews = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        item =>
          item &&
          typeof item.name === 'string' &&
          typeof item.review === 'string' &&
          Number.isInteger(item.rating) &&
          item.rating >= 1 &&
          item.rating <= 5
      );
    } catch (error) {
      return [];
    }
  };

  const saveUserReviews = (reviews) => {
    localStorage.setItem(storageKey, JSON.stringify(reviews));
  };

  let userReviews = loadUserReviews();

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const updateOverallRating = (reviews) => {
    const totalReviews = reviews.length;
    const totalScore = reviews.reduce((sum, item) => sum + item.rating, 0);
    const average = totalReviews ? (totalScore / totalReviews).toFixed(1) : '0.0';
    overallRating.textContent = `Overall rating: ${average}/5 (${totalReviews} reviews)`;
  };

  const renderReviews = () => {
    const allReviews = [...baseReviews, ...userReviews];
    const duplicated = [...allReviews, ...allReviews];

    updateOverallRating(allReviews);

    reviewsTrack.innerHTML = duplicated
      .map(({ name, review, rating }) => `
        <article class="review-card">
          <div class="review-header">
            <span class="review-name">${escapeHtml(name)}</span>
            <span class="review-stars">${renderStars(rating)}</span>
          </div>
          <p class="review-text">${escapeHtml(review)}</p>
        </article>
      `)
      .join('');
  };

  renderReviews();

  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cleanName = nameInput.value.trim().split(/\s+/)[0];
    const cleanReview = reviewInput.value.trim();

    const validName = /^[a-zA-Z]{2,30}$/.test(cleanName);
    if (!validName) {
      formMessage.textContent = 'Please enter your first name only (letters only).';
      return;
    }

    if (cleanReview.length < 10) {
      formMessage.textContent = 'Please enter at least 10 characters for your review.';
      return;
    }

    const selectedRating = reviewForm.querySelector('input[name="rating"]:checked');
    const ratingValue = selectedRating ? parseInt(selectedRating.value, 10) : NaN;
    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      formMessage.textContent = 'Please select a star rating.';
      return;
    }

    const newReview = { name: cleanName, rating: ratingValue, review: cleanReview };
    userReviews = [...userReviews, newReview];
    saveUserReviews(userReviews);
    renderReviews();

    reviewForm.reset();
    formMessage.textContent = 'Thanks! Your review is now posted publicly.';
  });
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
