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
    { name: 'Amina', rating: 5, date: '2026-03-01T10:15:00.000Z', review: 'Fast pickup and my clothes came back smelling fresh and neatly folded. Great service!' },
    { name: 'Kevin', rating: 5, date: '2026-03-02T11:40:00.000Z', review: 'Very professional team. My white shirts were spotless and perfectly ironed.' },
    { name: 'Faith', rating: 4, date: '2026-03-03T08:20:00.000Z', review: 'I loved the communication and timely delivery. Definitely using Wash & Wow again.' },
    { name: 'Brian', rating: 5, date: '2026-03-04T14:10:00.000Z', review: 'They handled my suits with excellent care. Looked brand new after cleaning.' },
    { name: 'Diana', rating: 4, date: '2026-03-05T09:35:00.000Z', review: 'Affordable prices and quality work. The free delivery made it super convenient.' },
    { name: 'Peter', rating: 5, date: '2026-03-06T13:05:00.000Z', review: 'The duvet cleaning service was amazing. It came back fluffy and very clean.' },
    { name: 'Mercy', rating: 5, date: '2026-03-07T15:45:00.000Z', review: 'Customer service was friendly and helpful. Clothes were ready exactly when promised.' },
    { name: 'Samuel', rating: 5, date: '2026-03-08T12:30:00.000Z', review: 'Best laundry experience I have had in Thika. Highly recommended to everyone.' },
    { name: 'Joan', rating: 4, date: '2026-03-09T16:25:00.000Z', review: 'My kids clothes were cleaned gently and still smelled fantastic. Thank you!' },
    { name: 'Daniel', rating: 5, date: '2026-03-10T10:55:00.000Z', review: 'Quick turnaround and no missing items. Everything returned in perfect condition.' },
    { name: 'Lucy', rating: 5, date: '2026-03-11T09:10:00.000Z', review: 'I use them every week now. Consistent quality and excellent finishing.' },
    { name: 'James', rating: 4, date: '2026-03-12T17:05:00.000Z', review: 'Great stain removal on my work uniforms. Impressed with the results.' },
    { name: 'Ruth', rating: 5, date: '2026-03-13T07:50:00.000Z', review: 'The team is polite and dependable. Pickup and drop off were very smooth.' },
    { name: 'Dennis', rating: 4, date: '2026-03-14T13:15:00.000Z', review: 'Shoe cleaning was top notch. My sneakers looked fresh and bright again.' },
    { name: 'Grace', rating: 5, date: '2026-03-15T11:25:00.000Z', review: 'Very clean packaging and neat folding. You can tell they pay attention to detail.' },
    { name: 'Esther', rating: 5, date: '2026-03-16T14:40:00.000Z', review: 'Laundry was handled with care and delivered on time. Wonderful service overall.' },
    { name: 'Alex', rating: 4, date: '2026-03-17T10:05:00.000Z', review: 'Fair pricing and premium results. I appreciate the reliability every single time.' },
    { name: 'Caroline', rating: 5, date: '2026-03-18T12:45:00.000Z', review: 'The ironing quality is excellent. My outfits were ready for work immediately.' },
    { name: 'John', rating: 4, date: '2026-03-19T08:55:00.000Z', review: 'Friendly staff and easy booking process through phone. Super convenient service.' },
    { name: 'Naomi', rating: 5, date: '2026-03-20T15:20:00.000Z', review: 'Excellent neighborhood laundry partner. Clean, fresh, and always professional.' }
  ];

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
    const totalScore = reviews.reduce((sum, item) => sum + item.rating, 0);
    const average = totalReviews ? (totalScore / totalReviews).toFixed(1) : '0.0';
    overallRating.textContent = `Overall rating: ${average}/5 (${totalReviews} reviews)`;
  };

  const renderReviews = () => {
    const allReviews = [...baseReviews, ...userReviews];
    const duplicated = [...allReviews, ...allReviews];

    updateOverallRating(allReviews);

    reviewsTrack.innerHTML = duplicated
      .map(({ name, review, rating, date }) => `
        <article class="review-card">
          <div class="review-header">
            <span class="review-name">${escapeHtml(name)}</span>
            <span class="review-stars">${renderStars(rating)}</span>
          </div>
          <p class="review-date">${escapeHtml(formatReviewDate(date))}</p>
          <p class="review-text">${escapeHtml(review)}</p>
        </article>
      `)
      .join('');
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
