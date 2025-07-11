// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Contact form animation (fake submission)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#27ae60';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
        this.reset();
      }, 2000);
    }, 1500);
  });
}

// Service item image hover effect
document.querySelectorAll('.service-item img').forEach(img => {
  img.addEventListener('mouseenter', () => {
    img.style.transform = 'scale(1.12) rotate(-2deg)';
    img.style.transition = 'transform 0.3s';
  });
  img.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
});

// Hero image slideshow only
const heroImages = [
  'colourful.webp',
  'bucket.webp',
  'blanket.webp',
  'towel.webp',
  'suit.webp',
  'shoe.webp',
  'curtain.webp',
];
let heroIndex = 0;
const heroImg = document.getElementById('hero-slideshow');
if (heroImg) {
  setInterval(() => {
    heroImg.style.opacity = 0;
    setTimeout(() => {
      heroIndex = (heroIndex + 1) % heroImages.length;
      heroImg.src = heroImages[heroIndex];
      heroImg.style.opacity = 1;
    }, 1000);
  }, 5000);
}
