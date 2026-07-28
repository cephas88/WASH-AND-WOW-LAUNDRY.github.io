# Wash & Wow Laundry

Business website for Wash & Wow Laundry, a laundry and dry-cleaning service in Thika Section 2, Kenya. Built with vanilla HTML, CSS, and JavaScript, with a Firebase/Firestore backend powering a live, genuine customer-review system.

🔗 **Live:** https://washandwowlaundry.com/

## Features
- Responsive single-page site: services, pricing, offers, about, FAQ, and contact
- Free pickup & delivery info with WhatsApp ordering integration
- Animated stat counters and scroll reveal effects
- **Genuine reviews only** — reviews load live from Firestore as real customers submit them, update in real time, and show an empty state until the first real review arrives. No seeded or template reviews.
- Local SEO: geo meta tags, keywords, and JSON-LD LocalBusiness structured data

## Tech Stack
HTML5 · CSS3 · JavaScript (ES6+) · Firebase / Firestore · Netlify

## Reviews Setup (Firestore)
Reviews use a Firebase project. Config lives in `index.html` (`window.WASH_AND_WOW_FIREBASE`).
1. Create a Firebase project and enable Firestore.
2. Deploy the security rules: `firebase deploy --only firestore:rules`
3. Reviews are stored in the `reviews` collection; the rules validate name, review text, and rating on submit.

If Firebase is unavailable, the form falls back to storing a review locally in the visitor's own browser (not shared) — so a working Firebase project is required for reviews to be public.

## Run Locally
```bash
git clone https://github.com/cephas88/washandwowlaundry.git
cd washandwowlaundry
python3 -m http.server 8000   # then open http://localhost:8000
```
Note: reviews load only when Firebase is configured and online; locally you'll see the empty state.

## Author
**Cephas Nyamai Mutisya** — Software Developer
Portfolio: https://cephasmutisyaportfolio.netlify.app/ · GitHub: https://github.com/cephas88
