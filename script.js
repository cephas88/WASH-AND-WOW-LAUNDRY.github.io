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
    '.service-card, .feature-card, .offer-card, .section-header, .about-image, .about-content, .review-form-card, .reviews-marquee, .contact-info, .contact-cta, .faq-item, .map-container'
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
  // Genuine reviews only — these load live from Firestore as real customers submit them.
  // No seeded or template reviews. An empty state shows until the first real review arrives.
  const baseReviews = [];

  const escapeHtml = (text) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const normalizeReview = (item) => {
    if (!item || typeof item.name !== 'string' || typeof item.review !== 'string') return null;
    if (!Number.isInteger(item.rating) || item.rating < 1 || item.rating > 5) return null;
    const date = typeof item.date === 'string' && item.date ? item.date : new Date().toISOString();
    return { name: item.name, review: item.review, rating: item.rating, date };
  };

  const loadUserReviews = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeReview).filter(Boolean);
    } catch (error) {
      return [];
    }
  };

  const saveUserReviews = (reviews) => {
    localStorage.setItem(storageKey, JSON.stringify(reviews));
  };

  let userReviews = loadUserReviews();
  const firebaseConfig = window.WASH_AND_WOW_FIREBASE || null;
  const hasFirebaseSdk = typeof window.firebase !== 'undefined' && typeof window.firebase.initializeApp === 'function';
  let firestore = null;
  let isRemoteMode = false;

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const formatReviewDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const updateOverallRating = (reviews) => {
    const totalReviews = reviews.length;
    if (!totalReviews) {
      overallRating.textContent = 'Be the first to review us!';
      return;
    }
    const totalScore = reviews.reduce((sum, item) => sum + item.rating, 0);
    const average = (totalScore / totalReviews).toFixed(1);
    const label = totalReviews === 1 ? 'review' : 'reviews';
    overallRating.textContent = `Overall rating: ${average}/5 (${totalReviews} ${label})`;
  };

  const renderReviews = () => {
    const allReviews = [...baseReviews, ...userReviews];

    updateOverallRating(allReviews);

    // Genuine empty state: no reviews yet.
    if (!allReviews.length) {
      reviewsTrack.style.animation = 'none';
      reviewsTrack.innerHTML = `
        <article class="review-card review-card--empty">
          <div class="review-header">
            <span class="review-name">No reviews yet</span>
            <span class="review-stars">☆☆☆☆☆</span>
          </div>
          <p class="review-text">Be the first to share your experience with Wash &amp; Wow. Use the form to leave a genuine review — it appears here right away.</p>
        </article>
      `;
      return;
    }

    const cardHtml = ({ name, review, rating, date }) => `
        <article class="review-card">
          <div class="review-header">
            <span class="review-name">${escapeHtml(name)}</span>
            <span class="review-stars">${renderStars(rating)}</span>
          </div>
          <p class="review-date">${escapeHtml(formatReviewDate(date))}</p>
          <p class="review-text">${escapeHtml(review)}</p>
        </article>
      `;

    // With a single review the marquee has nothing to scroll; show it static.
    if (allReviews.length === 1) {
      reviewsTrack.style.animation = 'none';
      reviewsTrack.innerHTML = cardHtml(allReviews[0]);
      return;
    }

    // Duplicate cards for a smooth continuous marquee once there are enough real reviews.
    reviewsTrack.style.animation = '';
    const duplicated = [...allReviews, ...allReviews];
    reviewsTrack.innerHTML = duplicated.map(cardHtml).join('');
  };

  const restartMarquee = () => {
    reviewsTrack.style.animation = 'none';
    // Force reflow so animation restarts from the beginning.
    void reviewsTrack.offsetWidth;
    reviewsTrack.style.animation = '';
  };

  renderReviews();

  if (firebaseConfig && hasFirebaseSdk) {
    try {
      const app = window.firebase.apps.length
        ? window.firebase.app()
        : window.firebase.initializeApp(firebaseConfig);
      firestore = window.firebase.firestore(app);
      isRemoteMode = true;

      firestore
        .collection('reviews')
        .orderBy('createdAt', 'desc')
        .limit(300)
        .onSnapshot(
          (snapshot) => {
            const remoteReviews = snapshot.docs
              .map((doc) => {
                const data = doc.data();
                const date = data.createdAt && typeof data.createdAt.toDate === 'function'
                  ? data.createdAt.toDate().toISOString()
                  : new Date().toISOString();
                return normalizeReview({
                  name: data.name,
                  review: data.review,
                  rating: data.rating,
                  date
                });
              })
              .filter(Boolean);

            userReviews = remoteReviews;
            renderReviews();
            restartMarquee();
          },
          () => {
            isRemoteMode = false;
          }
        );
    } catch (error) {
      isRemoteMode = false;
    }
  }

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

    const newReview = {
      name: cleanName,
      rating: ratingValue,
      review: cleanReview,
      date: new Date().toISOString()
    };
    // Put latest review first so it appears immediately in the moving stream.
    userReviews = [newReview, ...userReviews];
    renderReviews();
    restartMarquee();

    if (isRemoteMode && firestore) {
      firestore.collection('reviews').add({
        name: cleanName,
        rating: ratingValue,
        review: cleanReview,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      }).catch(() => {
        saveUserReviews(userReviews);
      });
    } else {
      saveUserReviews(userReviews);
    }

    reviewForm.reset();
    const waShareText = encodeURIComponent(`I just left a review for Wash & Wow Laundry in Thika! Great service — check them out on WhatsApp: wa.me/254742690291`);
    formMessage.innerHTML = `Thanks! Your review is live. <a href="https://wa.me/?text=${waShareText}" target="_blank" rel="noopener noreferrer" style="color:var(--color-accent);font-weight:600;text-decoration:underline;">Share on WhatsApp &rarr;</a>`;
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
        const suffix = counter.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current) + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + suffix;
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
  if (window.innerWidth <= 900) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const heroContent = hero.querySelector('.hero-content');
    const heroVisual = hero.querySelector('.hero-visual');
    if (heroContent) heroContent.style.transform = '';
    if (heroVisual) heroVisual.style.transform = '';
    return;
  }

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
