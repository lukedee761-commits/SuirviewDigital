# SuirViewDigital — Agency Website

The flagship website for **SuirViewDigital** (SuirViewDigital.ie) — Luke Richard's premium web-design business, County Tipperary.

## Overview
- **Type:** Static site — HTML + CSS + vanilla JS. No build step.
- **Design:** Premium/luxury. Near-black + midnight-blue foundation, royal-blue signature, restrained soft-gold accent. Fraunces (serif display) + Inter (body).
- **Audience:** Broader / higher-end clients — portfolio-forward.

## Structure
```
index.html            Single-page site (all sections)
css/styles.css        Full design system
js/main.js            Nav, scroll-reveal, contact form
assets/logo.svg       Full logo lockup (emblem + wordmark)
assets/favicon.svg    Emblem-only favicon
robots.txt            Allows indexing (this is a real public site)
sitemap.xml           Single-page sitemap
vercel.json           Clean URLs + security headers
serve.ps1             Local preview server (no Node/Python needed)
```

## Sections (in order)
Hero → Who We Design For → Services → Selected Work → About → Process → Pricing (call-only) → Contact → Footer.

## Selected Work showcased
Three different client industries, each linking to the live demo:
- **Dentist** — Andrew Kelly, Nenagh → https://andrew-nenagh-dentist.vercel.app
- **GP** — Kyle Court Clinic, Tipperary Town → https://kylecourt-clinic.vercel.app
- **Chiropody** — Paula's Foot Clinic, Tralee → https://paulas-footclinic.vercel.app

## Preview locally
```
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8088
→ http://localhost:8088
```

## Deploy
Push to a GitHub repo, import to Vercel (auto-deploys on every push), then point the SuirViewDigital.ie domain (Blacknight) at it and put Cloudflare in front.

## To-do before going fully live
- [ ] **Wire up the contact form** — currently front-end only. Create a free Formspree account and set the endpoint (see the `TODO` in `js/main.js`).
- [ ] **Testimonials** — add real client quotes once available.
- [ ] **Confirm final copy** — headline/tagline are a strong starting point; tweak to taste.
- [ ] Optional: real screenshots of the demo sites in the Selected Work cards (currently elegant styled mockups + live links).

## Pricing note
No prices shown on the site by design — "price upon call". The two plans (€50 + €200/mo, or €1,799 one-time with 24 months care) are discussed on the phone.

_Built with intensive care at every stage. Custom, not templated._
