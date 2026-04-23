# PRD — Bright Smile Dental Care Website

## Project Overview
A professional, modern, and trustworthy dental clinic marketing website built in English.
Clean, elegant, premium design with white/soft blue/light gray palette.

## Architecture
- **Frontend**: React (CRA + CRACO) with Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB via Motor
- **Fonts**: Cormorant Garamond (headings) + Manrope (body) via Google Fonts
- **Icons**: lucide-react
- **Primary Color**: #2563EB (Blue 600)

## Business Details (Placeholders — update with real info)
- **Clinic Name**: Bright Smile Dental Care
- **Dentist**: Dr. Emily Carter, BDS MFDS RCS
- **Address**: 12 Harley Street, London W1G 9PG, UK
- **Phone**: +44 (0) 20 7123 4567
- **Email**: info@brightsmiledental.co.uk
- **Hours**: Mon–Fri 8:30am–6:00pm | Sat 9:00am–2:00pm | Sun Closed

## Pages Implemented
1. **Homepage** (`/`) — Hero, Stats, Intro, Services overview, Why Choose Us, Testimonials, CTA
2. **About** (`/about`) — Dr. Carter intro, Qualifications, Stats, Core Values, CTA
3. **Services** (`/services`) — 10 dental services with descriptions, benefits, Book CTAs
4. **FAQ** (`/faq`) — 10 accordion FAQ questions
5. **Contact** (`/contact`) — Contact info cards, contact form, Google Maps embed, emergency CTA

## Key Components
- `Header.jsx` — Fixed glassmorphic nav with mobile hamburger menu
- `Footer.jsx` — 4-column footer with social links
- `BookingModal.jsx` — Full booking form with validation → POST /api/appointments

## Backend API
- `POST /api/appointments` — Save appointment/contact form to MongoDB
- `GET /api/appointments` — Retrieve all appointments

## What's Been Implemented (April 2026 — v2 Update)
- [x] Full 5-page website
- [x] Appointment booking modal (name, email, phone, service, date, time, message)
- [x] Contact form with backend integration
- [x] SEO meta tags (title, description, keywords, OG tags)
- [x] Dynamic per-page document titles
- [x] Mobile responsive design
- [x] data-testid on all interactive elements
- [x] 100% test pass rate (backend + frontend)
- [x] **v2: Dr. Emily Carter professional photo on About page** (with credential chips, rating badge, 15+ badge)
- [x] **v2: "Meet Dr. Carter" premium dark-card section on Homepage**
- [x] **v2: Doctor quote section on About page** (signature blockquote)
- [x] **v2: Timeline-style qualifications section** on About page
- [x] **v2: Improved hero** with dot grid pattern, tighter layout, better composition
- [x] **v2: Improved testimonials** with colored avatar initials, overall rating badge
- [x] **v2: Why Choose Us** redesigned as split 2-column layout with feature grid
- [x] **SEO v2 (April 2026)**: Full SEO overhaul
  - `useSEO` hook — updates title, description, keywords, og:*, twitter:*, canonical per page
  - Unique keyword-rich meta description for every page
  - JSON-LD Dentist/LocalBusiness structured data in index.html
  - Twitter Card meta tags
  - og:url, og:image, og:locale, og:site_name
  - `robots.txt` (allows all, blocks /api/)
  - `sitemap.xml` (all 5 pages with priority weights)

## Prioritized Backlog
### P0 (User must update)
- Replace all placeholder business info with real clinic details
- Replace placeholder Google Maps iframe with real embed URL

### P1 (Quick Wins)
- Add real dentist/clinic photos to About page
- Add WhatsApp click-to-chat button
- Add Google Reviews integration
- Real-time appointment availability calendar

### P2 (Future)
- Admin dashboard to view/manage appointment requests
- Email notifications for new appointments (SendGrid/Resend)
- Patient login portal
- Blog/articles section for SEO
- Before/after gallery for cosmetic treatments
- Multi-language support
