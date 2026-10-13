import { ClientConfig } from '../types';

/**
 * Generate `config.js`
 */
export function generateConfigJs(config: ClientConfig): string {
  return `/**
 * MASTER CLIENT CONFIGURATION FILE
 * Auto-generated for: ${config.businessName}
 * Industry: ${config.industry}
 * 
 * Edit ONLY this file to update the entire website automatically!
 */

window.CONFIG = ${JSON.stringify(config, null, 2)};
`;
}

/**
 * Generate `client.json`
 */
export function generateClientJson(config: ClientConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Generate `styles.css` ($5,000 Agency Quality CSS)
 */
export function generateStylesCss(config: ClientConfig): string {
  return `/* ----------------------------------------------------
   $5,000 AGENCY GRADE LOCAL TRADE MASTER STYLESHEET
   Clean, Modern, Industrial, High-Converting & Mobile-First
---------------------------------------------------- */

:root {
  --primary: ${config.primaryColor || '#0F172A'};
  --accent: ${config.accentColor || '#2563EB'};
  --font-family: ${config.fontFamily || "'Inter', system-ui, sans-serif"};
  --bg-body: #F8FAFC;
  --bg-card: #FFFFFF;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --border-color: #E2E8F0;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.15);
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --max-width: 1280px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
  font-family: var(--font-family);
  color: var(--text-main);
  background-color: var(--bg-body);
  line-height: 1.6;
}

section[id] {
  scroll-margin-top: 5rem;
}

body {
  overflow-x: hidden;
  padding-bottom: 70px; /* Space for sticky mobile bar */
}

@media (min-width: 768px) {
  body {
    padding-bottom: 0;
  }
}

a {
  color: inherit;
  text-decoration: none;
}

button, input, select, textarea {
  font-family: inherit;
}

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* --- BUTTONS --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-weight: 700;
  font-size: 1rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  min-width: 0;
  max-width: 100%;
  text-align: center;
  text-decoration: none;
}

.btn-accent {
  background-color: var(--accent);
  color: #FFFFFF;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
}
.btn-accent:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}
.btn-outline:hover {
  background: var(--primary);
  color: #FFFFFF;
}

.btn-dark {
  background-color: var(--primary);
  color: #FFFFFF;
}

/* --- TOP NOTIFICATION BAR --- */
.top-bar {
  background-color: var(--primary);
  color: #F8FAFC;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.top-bar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.top-bar-badge {
  background: rgba(255,255,255,0.15);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
}
.top-bar-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* --- HEADER & STICKY NAV --- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  padding: 0.875rem 0;
}
.nav-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
}
.brand-logo img {
  height: 42px;
  width: auto;
  border-radius: 6px;
  object-fit: cover;
}
.nav-links {
  display: none;
  align-items: center;
  gap: 1.75rem;
  list-style: none;
  font-weight: 600;
  font-size: 0.95rem;
}
@media (min-width: 992px) {
  .nav-links { display: flex; }
}
.nav-links a:hover {
  color: var(--accent);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* --- HERO SECTION --- */
.hero-section {
  position: relative;
  background-color: var(--primary);
  color: #FFFFFF;
  padding: 3.5rem 0 4.5rem;
  overflow: hidden;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}
@media (min-width: 992px) {
  .hero-grid {
    grid-template-columns: 1.2fr 0.8fr;
  }
}
.hero-badge-row {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.12);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(255,255,255,0.2);
}
.hero-title {
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}
@media (min-width: 768px) {
  .hero-title { font-size: 3.25rem; }
}
.hero-subheadline {
  font-size: 1.125rem;
  color: #94A3B8;
  margin-bottom: 2rem;
  max-width: 600px;
}
.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* HERO DISPATCH TICKET CARD */
.dispatch-card {
  background: #FFFFFF;
  color: var(--text-main);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--accent);
}
.dispatch-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: var(--primary);
}
.dispatch-card p {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}
.dispatch-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #DCFCE7;
  color: #166534;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.dispatch-pulse-dot {
  width: 8px;
  height: 8px;
  background: #22C55E;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* --- STATS COUNTER BAR --- */
.stats-bar {
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-color);
  padding: 2rem 0;
  box-shadow: var(--shadow-sm);
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  text-align: center;
}
@media (min-width: 768px) {
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
}
.stat-val {
  font-size: 2rem;
  font-weight: 900;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 0.25rem;
}
.stat-lbl {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary);
}
.stat-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* --- SECTION COMMON --- */
.section {
  padding: 4.5rem 0;
}
.section-alt {
  background-color: #F1F5F9;
}
.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
}
.section-subtitle {
  color: var(--accent);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}
.section-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--primary);
  line-height: 1.2;
}

/* --- SERVICES GRID --- */
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}
@media (min-width: 768px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .services-grid { grid-template-columns: repeat(3, 1fr); }
}
.service-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}
.service-icon-box {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: rgba(37, 99, 235, 0.1);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
}
.service-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--primary);
}
.service-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}
.service-features-list {
  list-style: none;
  margin-bottom: 1.5rem;
}
.service-features-list li {
  font-size: 0.875rem;
  color: var(--text-main);
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* --- EMERGENCY CALLOUT BANNER --- */
.emergency-banner {
  background: linear-gradient(135deg, var(--primary), #1E293B);
  color: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}
.emergency-banner h2 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
}
.emergency-banner p {
  font-size: 1.1rem;
  color: #CBD5E1;
  max-width: 650px;
  margin: 0 auto 2rem;
}

/* --- REVIEWS & TESTIMONIALS --- */
.reviews-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .reviews-grid { grid-template-columns: repeat(3, 1fr); }
}
.review-card {
  background: var(--bg-card);
  padding: 1.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
.review-stars {
  color: #F59E0B;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
.review-comment {
  font-size: 0.95rem;
  color: var(--text-main);
  font-style: italic;
  margin-bottom: 1.25rem;
}
.review-author {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--primary);
}
.review-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* --- TRUST BADGES --- */
.trust-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}
@media (min-width: 992px) {
  .trust-grid { grid-template-columns: repeat(4, 1fr); }
}
.trust-item {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  text-align: center;
}

/* --- LEAD FORM & CONTACT --- */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 992px) {
  .contact-grid { grid-template-columns: 1fr 1fr; }
}
.lead-form-box {
  background: var(--bg-card);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}
.form-group {
  margin-bottom: 1.25rem;
}
.form-group label {
  display: block;
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 0.4rem;
  color: var(--primary);
}
.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  font-size: 1rem;
  background-color: #F8FAFC;
  transition: border-color 0.2s;
}
.form-control:focus {
  outline: none;
  border-color: var(--accent);
  background-color: #FFFFFF;
}

/* Hidden Spam Field */
.honeypot-field {
  display: none !important;
}

/* --- FOOTER --- */
.site-footer {
  background-color: var(--primary);
  color: #94A3B8;
  padding: 4rem 0 2rem;
  font-size: 0.9rem;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
}
.footer-title {
  color: #FFFFFF;
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 1rem;
}
.footer-links {
  list-style: none;
}
.footer-links li {
  margin-bottom: 0.5rem;
}
.footer-links a:hover {
  color: #FFFFFF;
}

/* --- STICKY MOBILE BAR --- */
.sticky-mobile-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background: #FFFFFF;
  border-top: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  display: flex;
  gap: 0.75rem;
  box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
}
@media (min-width: 768px) {
  .sticky-mobile-bar { display: none; }
}
.sticky-mobile-bar .btn {
  flex: 1;
  padding: 0.75rem 0.5rem;
  font-size: 0.9rem;
}
`;
}

/**
 * Generate `app.js` (Pure Vanilla JS dynamic renderer)
 */
export function generateAppJs(config: ClientConfig): string {
  return `/**
 * MASTER VANILLA JS HYDRATION & LOGIC ENGINE
 * Reads window.CONFIG and dynamically updates text, SEO, Lead Form & Interactions.
 */

(function () {
  const cfg = window.CONFIG;
  if (!cfg) {
    console.error("CONFIG object not found! Make sure config.js is loaded.");
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initDynamicContent();
    initSeoAndSchema();
    initLeadForm();
  });

  function initDynamicContent() {
    // Page Title & Meta
    document.title = cfg.seo.title || cfg.businessName;

    // Update text elements with data-cfg attributes
    document.querySelectorAll("[data-cfg]").forEach((el) => {
      const path = el.getAttribute("data-cfg");
      const val = getNestedValue(cfg, path);
      if (val !== undefined && val !== null) {
        if (el.tagName === "A" && el.hasAttribute("href")) {
          if (path.includes("phone")) el.href = "tel:" + cfg.phoneRaw;
          else if (path.includes("email")) el.href = "mailto:" + cfg.email;
          else el.textContent = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update Phone Links
    document.querySelectorAll(".phone-link").forEach((a) => {
      a.href = "tel:" + cfg.phoneRaw;
      a.textContent = cfg.phone;
    });

    // Update Primary Colors in CSS variables dynamically
    if (cfg.primaryColor) {
      document.documentElement.style.setProperty("--primary", cfg.primaryColor);
    }
    if (cfg.accentColor) {
      document.documentElement.style.setProperty("--accent", cfg.accentColor);
    }
  }

  function initSeoAndSchema() {
    // Inject JSON-LD Schema
    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": cfg.businessName,
      "image": cfg.heroImageUrl,
      "telephone": cfg.phone,
      "email": cfg.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": cfg.address,
        "addressLocality": cfg.cityStateZip
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": cfg.averageRating,
        "reviewCount": cfg.reviewCount
      },
      "priceRange": "$$"
    };
    schemaScript.textContent = JSON.stringify(schemaData, null, 2);
    document.head.appendChild(schemaScript);
  }

  function initLeadForm() {
    const form = document.getElementById("leadForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const honeypot = form.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        console.warn("Spam submission blocked.");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Submitting Request...";

      try {
        const formData = new FormData(form);
        const endpoint = cfg.formEndpoint ? cfg.formEndpoint.trim() : "";

        const payload = {
          clientId: cfg.clientId || 'client-' + (cfg.industry || 'trade').toLowerCase().replace(/[^a-z0-9]/g, '') + '-01',
          leadSource: cfg.leadSource || 'Google Business Profile / Local Search',
          businessName: cfg.businessName,
          timestamp: new Date().toISOString(),
          name: formData.get("name") || "",
          phone: formData.get("phone") || "",
          service: formData.get("service") || "",
          details: formData.get("details") || formData.get("message") || "No additional details provided.",
          address: formData.get("address") || cfg.cityStateZip || "",
        };

        // Simulate or post to endpoint
        if (!endpoint) {
          // Demo fallback
          await new Promise((r) => setTimeout(r, 800));
          console.log("Demo Lead Payload:", payload);
        } else {
          await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "text/plain;charset=utf-8"
            }
          });
        }

        form.reset();
        alert("Request received — we'll contact you shortly.");
      } catch (err) {
        alert("Something went wrong. Please call us directly.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }
})();
`;
}

/**
 * Generate standalone `index.html`
 */
export function generateIndexHtml(config: ClientConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.seo.title || config.businessName}</title>
  <meta name="description" content="${config.seo.metaDescription}" />
  <link rel="canonical" href="${config.seo.canonicalUrl || 'https://example.com'}" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="${config.seo.title}" />
  <meta property="og:description" content="${config.seo.metaDescription}" />
  <meta property="og:image" content="${config.heroImageUrl}" />

  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  ${config.sampleDataNoticeEnabled === true ? `
  <!-- SAMPLE DATA NOTICE -->
  <div style="background:#FEF3C7; color:#78350F; padding:0.5rem 1rem; font-size:0.75rem; border-bottom:1px solid #FDE68A;">
    <div class="container" style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; flex-wrap:wrap;">
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <span style="background:#FDE68A; color:#451A03; font-weight:800; padding:0.15rem 0.4rem; border-radius:4px; font-size:0.65rem; text-transform:uppercase;">Sample Data Notice</span>
        <span>Customer claims, reviews, ratings, and statistics are sample template placeholders. Replace with real client data prior to launch.</span>
      </div>
    </div>
  </div>
  ` : ''}

  <!-- TOP NOTIFICATION BAR -->
  <div class="top-bar">
    <div class="container">
      <div>
        ${config.heroStatusText && config.heroStatusText.trim() !== '' ? `<span class="top-bar-badge">${config.heroStatusText}</span>` : ''}
        ${config.emergencyAvailability ? `<span data-cfg="emergencyAvailability">${config.emergencyAvailability}</span>` : ''}
      </div>
      <div class="top-bar-info">
        ${config.cityStateZip ? `<span>📍 Servicing: <strong data-cfg="cityStateZip">${config.cityStateZip}</strong></span>` : ''}
        ${config.phone ? `<span>📞 Call Now: <a href="tel:${config.phoneRaw}" class="phone-link" style="color:#FFF; font-weight:800;">${config.phone}</a></span>` : ''}
      </div>
    </div>
  </div>

  <!-- SITE HEADER & NAV -->
  <header class="site-header">
    <div class="container nav-wrapper">
      <a href="#" class="brand-logo">
        ${(config.logoUrl || config.logo) ? `<img src="${config.logoUrl || config.logo}" alt="${config.businessName}" />` : ''}
        <span data-cfg="businessName">${config.businessName}</span>
      </a>
      <ul class="nav-links">
        ${config.services && config.services.length > 0 ? `<li><a href="#services">Services</a></li>` : ''}
        ${((config.whyUsItems && config.whyUsItems.length > 0) || (config.trustBadges && config.trustBadges.length > 0)) ? `<li><a href="#why-us">Why Choose Us</a></li>` : ''}
        ${config.testimonials && config.testimonials.length > 0 ? `<li><a href="#reviews">Reviews</a></li>` : ''}
        ${config.faqs && config.faqs.length > 0 ? `<li><a href="#faqs">FAQs</a></li>` : ''}
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div class="header-actions">
        ${config.phone ? `<a href="tel:${config.phoneRaw}" class="btn btn-accent phone-link">📞 ${config.phone}</a>` : ''}
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="hero-section">
    <div class="container hero-grid">
      <div>
        ${(config.heroEyebrow !== undefined ? (config.heroEyebrow.trim() !== '' ? `<div class="hero-badge-row"><span>${config.heroEyebrow}</span></div>` : '') : (config.testimonials && config.testimonials.length > 0 && config.averageRating ? `<div class="hero-badge-row"><span>⭐ ${config.averageRating} Rating</span> | <span>${config.reviewCount || 0}+ Verified Local Reviews</span></div>` : ''))}
        <h1 class="hero-title" data-cfg="heroTitle">
          ${config.heroTitle}
          ${config.heroTitleHighlight ? `<span style="display:block; color:#F59E0B;">${config.heroTitleHighlight}</span>` : ''}
          ${config.heroTitleEnd ? `<span>${config.heroTitleEnd}</span>` : ''}
        </h1>
        ${config.heroSubheadline ? `<p class="hero-subheadline" data-cfg="heroSubheadline">${config.heroSubheadline}</p>` : ''}

        <div class="hero-cta-group">
          ${(config.heroPrimaryCtaText === undefined ? true : config.heroPrimaryCtaText.trim() !== '') ? (config.phone ? `<a href="tel:${config.phoneRaw}" class="btn btn-accent phone-link">📞 ${config.heroPrimaryCtaText || `Call Now: ${config.phone}`}</a>` : `<a href="#contact" class="btn btn-accent">${config.heroPrimaryCtaText || 'Request Service'}</a>`) : ''}
          ${(config.heroSecondaryCtaText === undefined ? true : config.heroSecondaryCtaText.trim() !== '') ? `<a href="#contact" class="btn btn-outline" style="color:#FFF; border-color:#FFF;">${config.heroSecondaryCtaText || 'Request AC Service'}</a>` : ''}
        </div>

        ${config.heroTrustBadgesEnabled === true && ((config.trustBadges && config.trustBadges.length > 0) || (config.whyUsItems && config.whyUsItems.length > 0)) ? `
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.1); font-size:0.8rem;">
          ${config.trustBadges && config.trustBadges.length > 0 ? config.trustBadges.slice(0, 3).map(tb => `<div>🛡️ ${tb.title}</div>`).join('') : config.whyUsItems.slice(0, 3).map(w => `<div>🛡️ ${w.title}</div>`).join('')}
        </div>
        ` : ''}
      </div>

      <div class="dispatch-card">
        ${config.leadFormStatusText && config.leadFormStatusText.trim() !== '' ? `
        <div class="dispatch-status-badge">
          <span class="dispatch-pulse-dot"></span>
          <span>${config.leadFormStatusText}</span>
        </div>
        ` : ''}
        <h3>${config.finalCtaHeading || 'Request Instant Priority Dispatch'}</h3>
        <p>${config.finalCtaDescription || `Fill out this form for priority emergency booking${config.cityStateZip ? ` in ${config.cityStateZip}` : ''}.`}</p>
        
        <form id="leadForm">
          <input type="text" name="_gotcha" class="honeypot-field" tabindex="-1" autocomplete="off" />
          <div class="form-group">
            <input type="text" name="name" class="form-control" placeholder="Your Full Name *" required />
          </div>
          <div class="form-group">
            <input type="tel" name="phone" class="form-control" placeholder="Phone Number *" required />
          </div>
          <div class="form-group">
            <select name="service" class="form-control" required>
              <option value="">Select Service Needed...</option>
              ${config.services.map(s => `<option value="${s.title}">${s.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <textarea name="details" class="form-control" rows="2" placeholder="Describe problem or service details..."></textarea>
          </div>
          ${config.cityStateZip ? `
          <div class="form-group">
            <input type="text" name="address" class="form-control" placeholder="Street Address (${config.cityStateZip})" />
          </div>
          ` : ''}
          <button type="submit" class="btn btn-accent" style="width:100%;">${config.finalCtaButtonText || 'Dispatch Technician Now'}</button>
          ${config.leadFormTrustText && config.leadFormTrustText.trim() !== '' ? `
          <p style="font-size:0.75rem; text-align:center; color:#94A3B8; margin-top:0.5rem;">
            ${config.leadFormTrustText}
          </p>
          ` : ''}
        </form>
      </div>
    </div>
  </section>

  <!-- STATS BAR -->
  ${config.stats && config.stats.length > 0 ? `
  <section class="stats-bar">
    <div class="container stats-grid">
      ${config.stats.map(st => `
        <div>
          <div class="stat-val">${st.value}</div>
          <div class="stat-lbl">${st.label}</div>
          <div class="stat-sub">${st.sublabel}</div>
        </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  <!-- WHY CHOOSE US -->
  ${((config.whyUsItems && config.whyUsItems.length > 0) || (config.trustBadges && config.trustBadges.length > 0) || config.whyUsHeading) ? `
  <section id="why-us" class="section section-alt">
    <div class="container">
      <div class="section-header">
        ${(config.whyUsEyebrow === undefined || config.whyUsEyebrow.trim() !== '') ? `<div class="section-subtitle">${config.whyUsEyebrow || `Why Choose ${config.businessName}`}</div>` : ''}
        ${(config.whyUsHeading === undefined || config.whyUsHeading.trim() !== '') ? `<h2 class="section-title">${config.whyUsHeading || 'Why Customers Choose Our AC Services'}</h2>` : ''}
        ${config.whyUsDescription ? `<p style="margin-top:0.5rem; color:var(--text-muted);">${config.whyUsDescription}</p>` : ''}
      </div>

      <div class="services-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        ${config.whyUsItems && config.whyUsItems.length > 0 ? config.whyUsItems.map(item => `
        <div class="service-card">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
        `).join('') : (config.trustBadges && config.trustBadges.length > 0 ? config.trustBadges.slice(0, 3).map(b => `
        <div class="service-card">
          <h3>${b.title}</h3>
          <p>${b.subtitle}</p>
        </div>
        `).join('') : '')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- SERVICES SECTION -->
  <section id="services" class="section">
    <div class="container">
      <div class="section-header">
        ${(config.servicesEyebrow === undefined || config.servicesEyebrow.trim() !== '') ? `<div class="section-subtitle">${config.servicesEyebrow || 'Our Expertise'}</div>` : ''}
        ${(config.servicesHeading === undefined || config.servicesHeading.trim() !== '') ? `<h2 class="section-title">${config.servicesHeading || 'Professional Local Services'}</h2>` : ''}
        ${config.servicesDescription ? `<p style="margin-top:0.5rem; color:var(--text-muted);">${config.servicesDescription}</p>` : ''}
      </div>

      <div class="services-grid">
        ${config.services.map(s => `
          <div class="service-card">
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <ul class="service-features-list">
              ${s.features.map(f => `<li>✓ ${f}</li>`).join('')}
            </ul>
            ${config.phone ? `<a href="tel:${config.phoneRaw}" class="btn btn-dark" style="margin-top:auto;">Call For Service</a>` : `<a href="#contact" class="btn btn-dark" style="margin-top:auto;">Request Quote</a>`}
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- EMERGENCY BANNER -->
  ${(config.hasEmergencyService !== false && (Boolean(config.emergencyHeading) || Boolean(config.emergencyAvailability) || Boolean(config.emergencyDescription))) ? `
  <section class="section">
    <div class="container">
      <div class="emergency-banner">
        <h2>${config.emergencyHeading || 'Emergency Service Available'}</h2>
        <p>${config.emergencyDescription || 'Need urgent assistance? Call our dedicated hotline for immediate response.'}</p>
        ${config.phone ? `<a href="tel:${config.phoneRaw}" class="btn btn-accent phone-link">📞 ${config.emergencyCtaText || `Emergency Hotline: ${config.phone}`}</a>` : `<a href="#contact" class="btn btn-accent">${config.emergencyCtaText || 'Request Priority Dispatch'}</a>`}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- REVIEWS SECTION -->
  ${config.testimonials && config.testimonials.length > 0 ? `
  <section id="reviews" class="section section-alt">
    <div class="container">
      <div class="section-header">
        <div class="section-subtitle">${config.reviewsEyebrow || 'Real Customer Feedback'}</div>
        <h2 class="section-title">${config.reviewsHeading || 'What Our Customers Say'}</h2>
        ${config.reviewsDescription ? `<p style="margin-top:0.5rem; color:var(--text-muted);">${config.reviewsDescription}</p>` : ''}
      </div>

      <div class="reviews-grid">
        ${config.testimonials.map(t => `
          <div class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-comment">"${t.comment}"</p>
            <div class="review-author">${t.author}</div>
            <div class="review-meta">${t.location} • ${t.service}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- FAQS SECTION -->
  ${config.faqs && config.faqs.length > 0 ? `
  <section id="faqs" class="section">
    <div class="container">
      <div class="section-header">
        <div class="section-subtitle">Got Questions?</div>
        <h2 class="section-title">${config.faqHeading || 'Frequently Asked Questions'}</h2>
      </div>
      <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        ${config.faqs.map(faq => `
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
            <h4 style="font-weight: 800; font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--primary);">${faq.question}</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); leading-height: 1.5;">${faq.answer}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- SERVICE AREA SECTION -->
  ${((config.serviceAreas && config.serviceAreas.length > 0) || config.cityStateZip) ? `
  <section class="section section-alt">
    <div class="container">
      <div class="section-header">
        <div class="section-subtitle">Local Coverage</div>
        <h2 class="section-title">${config.serviceAreaHeading || `Servicing ${config.cityStateZip || config.businessName} & Surrounding Areas`}</h2>
        <p style="margin-top:0.5rem; color:var(--text-muted);">${config.serviceAreaDescription || 'Providing doorstep AC repair, servicing and installation across Ernakulam, Kochi and nearby areas.'}</p>
      </div>
      ${config.serviceAreas && config.serviceAreas.length > 0 ? `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem; margin-top:1.5rem;">
        ${config.serviceAreas.map(area => `<span style="background:var(--bg-card); border:1px solid var(--border-color); padding:0.5rem 1rem; border-radius:var(--radius-sm); font-size:0.875rem; font-weight:600;">📍 ${area}</span>`).join('')}
      </div>
      ` : ''}
    </div>
  </section>
  ` : ''}

  <!-- CONTACT & LEAD FORM -->
  <section id="contact" class="section">
    <div class="container">
      <div class="contact-grid">
        <div>
          <div class="section-subtitle">Get In Touch</div>
          <h2 class="section-title">Ready To Get Started?</h2>
          <p style="margin-bottom:1.5rem; color:var(--text-muted);">
            Contact our friendly local team today for prompt service, upfront estimates, or assistance.
          </p>
          ${config.phone ? `<p style="margin-bottom:0.75rem;"><strong>📞 Phone:</strong> <a href="tel:${config.phoneRaw}" class="phone-link">${config.phone}</a></p>` : ''}
          ${config.email ? `<p style="margin-bottom:0.75rem;"><strong>✉️ Email:</strong> ${config.email}</p>` : ''}
          ${config.address || config.cityStateZip ? `<p style="margin-bottom:0.75rem;"><strong>📍 Address:</strong> ${config.address ? config.address + ', ' : ''}${config.cityStateZip}</p>` : ''}
          ${config.businessHours ? `<p style="margin-bottom:0.75rem;"><strong>🕒 Hours:</strong> ${config.businessHours}</p>` : ''}
          ${config.websiteUrl ? `<p style="margin-bottom:0.75rem;"><strong>🌐 Website:</strong> <a href="${config.websiteUrl}" target="_blank" rel="noopener noreferrer">${config.websiteUrl}</a></p>` : ''}
        </div>

        <div class="lead-form-box">
          <h3 style="margin-bottom:0.5rem; font-size:1.5rem; font-weight:800;">${config.finalCtaHeading || 'Request A Free Quote'}</h3>
          ${config.finalCtaDescription ? `<p style="margin-bottom:1rem; font-size:0.875rem; color:var(--text-muted);">${config.finalCtaDescription}</p>` : ''}
          <form id="leadFormSecondary">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Service Needed *</label>
              <select name="service" class="form-control" required>
                ${config.services.map(s => `<option value="${s.title}">${s.title}</option>`).join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-accent" style="width:100%;">${config.finalCtaButtonText || 'Submit Request'}</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-title" data-cfg="businessName">${config.businessName}</div>
          <p data-cfg="tagline">${config.footerDescription !== undefined ? config.footerDescription : (config.tagline || '')}</p>
          ${(config.address || config.cityStateZip) ? `<p style="margin-top:0.75rem; color:#cbd5e1;">📍 ${config.address ? config.address + ', ' : ''}${config.cityStateZip || ''}</p>` : ''}
        </div>
        <div>
          <div class="footer-title">Contact Info</div>
          <ul class="footer-links">
            ${config.phone ? `<li>Phone: <a href="tel:${config.phoneRaw}">${config.phone}</a></li>` : ''}
            ${config.email ? `<li>Email: ${config.email}</li>` : ''}
            ${config.businessHours ? `<li>Hours: ${config.businessHours}</li>` : ''}
          </ul>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:1.5rem; text-align:center;">
        ${config.footerCopyrightText !== undefined ? config.footerCopyrightText : `© ${new Date().getFullYear()} <span data-cfg="businessName">${config.businessName}</span>. All rights reserved.`}
      </div>
    </div>
  </footer>

  <!-- STICKY MOBILE BOTTOM BAR -->
  <div class="sticky-mobile-bar">
    ${config.phone ? `<a href="tel:${config.phoneRaw}" class="btn btn-accent phone-link">📞 Call ${config.phone}</a>` : ''}
    <a href="#contact" class="btn btn-dark" style="flex:1;">${config.heroSecondaryCtaText || config.finalCtaButtonText || 'Request AC Service'}</a>
  </div>

  <script src="config.js"></script>
  <script src="app.js"></script>
</body>
</html>
`;
}

/**
 * Generate Google Apps Script Code.gs
 */
export function generateGoogleAppsScript(config: ClientConfig): string {
  return `/**
 * LOCAL LEAD CAPTURE SYSTEM & LEADPILOT BACKEND - GOOGLE APPS SCRIPT WEB APP
 * Client: ${config.businessName} (${config.clientId || 'client-01'})
 * 
 * Architecture Flow:
 * Client Landing Page -> Google Apps Script Web App -> Google Sheet -> LeadPilot
 */

const DEPLOYED_CLIENT_ID = "${config.clientId || 'client-01'}";

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads") || ss.getSheets()[0];
    if (sheet.getLastRow() <= 1) {
      return responseJSON({ status: "success", result: "success", leads: [] });
    }

    var requestedClientId = (e && e.parameter && e.parameter.clientId) ? e.parameter.clientId.toString().trim() : "";
    if (requestedClientId && requestedClientId !== "all" && requestedClientId !== DEPLOYED_CLIENT_ID) {
      return responseJSON({ status: "error", result: "error", message: "Unauthorized: Requested clientId does not match DEPLOYED_CLIENT_ID (" + DEPLOYED_CLIENT_ID + ")." });
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    var headerMap = {};
    for (var h = 0; h < headers.length; h++) {
      var hKey = headers[h].toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      headerMap[hKey] = h;
    }

    var leadIdIdx = headerMap['leadid'] !== undefined ? headerMap['leadid'] : 0;
    var timestampIdx = headerMap['timestamp'] !== undefined ? headerMap['timestamp'] : 1;
    var clientIdIdx = headerMap['clientid'] !== undefined ? headerMap['clientid'] : 2;
    var businessNameIdx = headerMap['businessname'] !== undefined ? headerMap['businessname'] : 3;
    var nameIdx = headerMap['name'] !== undefined ? headerMap['name'] : 4;
    var phoneIdx = headerMap['phone'] !== undefined ? headerMap['phone'] : 5;
    var serviceIdx = headerMap['service'] !== undefined ? headerMap['service'] : 6;
    var detailsIdx = headerMap['details'] !== undefined ? headerMap['details'] : 7;
    var addressIdx = headerMap['address'] !== undefined ? headerMap['address'] : 8;
    var leadSourceIdx = headerMap['leadsource'] !== undefined ? headerMap['leadsource'] : 9;
    var pageUrlIdx = headerMap['pageurl'] !== undefined ? headerMap['pageurl'] : 10;
    var statusIdx = headerMap['status'] !== undefined ? headerMap['status'] : 11;
    var notesIdx = headerMap['notes'] !== undefined ? headerMap['notes'] : 12;
    var followUpDateIdx = headerMap['followupdate'] !== undefined ? headerMap['followupdate'] : 13;

    var leads = [];
    var requestedClientId = (e && e.parameter && e.parameter.clientId) ? e.parameter.clientId.toString().trim() : "";

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var leadId = (row[leadIdIdx] || "").toString().trim();
      if (!leadId) continue;

      var rowClientId = (row[clientIdIdx] || "").toString().trim();
      if (requestedClientId && requestedClientId !== "all" && rowClientId !== requestedClientId) {
        continue;
      }

      var notesRaw = (row[notesIdx] || "").toString();
      var notesArray = [];
      var followUpDate = (followUpDateIdx < row.length && row[followUpDateIdx]) ? row[followUpDateIdx].toString().trim() : "";

      if (notesRaw) {
        try {
          var parsed = JSON.parse(notesRaw);
          if (Array.isArray(parsed)) {
            notesArray = parsed;
          } else if (typeof parsed === "object") {
            notesArray = parsed.notes || [];
            if (!followUpDate) followUpDate = parsed.followUpDate || "";
          }
        } catch (pErr) {
          var lines = notesRaw.split('\\n');
          for (var l = 0; l < lines.length; l++) {
            var line = lines[l].trim();
            if (!line) continue;
            var match = line.match(/^\\[(.*?)\\]\\s*(.*?):\\s*(.*)$/);
            if (match) {
              notesArray.push({ id: "note-" + i + "-" + l, createdAt: match[1], author: match[2], text: match[3] });
            } else {
              notesArray.push({ id: "note-" + i + "-" + l, createdAt: new Date().toISOString(), author: "System", text: line });
            }
          }
        }
      }

      var detailsStr = (row[detailsIdx] || "").toString();
      var emailVal = "";
      var emailMatch = detailsStr.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
      if (emailMatch) emailVal = emailMatch[0];

      leads.push({
        id: leadId,
        timestamp: (row[timestampIdx] || new Date().toISOString()).toString(),
        clientId: rowClientId,
        businessName: (row[businessNameIdx] || "").toString(),
        name: (row[nameIdx] || "").toString(),
        phone: (row[phoneIdx] || "").toString(),
        email: emailVal,
        service: (row[serviceIdx] || "").toString(),
        details: detailsStr,
        address: (row[addressIdx] || "").toString(),
        leadSource: (row[leadSourceIdx] || "Google Search").toString(),
        pageUrl: (row[pageUrlIdx] || "").toString(),
        status: (row[statusIdx] || "New").toString(),
        notes: notesArray,
        followUpDate: followUpDate
      });
    }

    return responseJSON({ status: "success", result: "success", count: leads.length, leads: leads });
  } catch (err) {
    return responseJSON({ status: "error", result: "error", message: err.toString() });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return responseJSON({ result: "error", message: "Server busy, please retry in a moment." });
  }

  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (jsonErr) { data = e.parameter || {}; }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var action = data.action || "createLead";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads") || ss.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Lead ID", "Timestamp", "Client ID", "Business Name",
        "Name", "Phone", "Service", "Details", "Address",
        "Lead Source", "Page URL", "Status", "Notes", "Follow-up Date"
      ]);
    }

    var allData = sheet.getDataRange().getValues();
    var headers = allData[0];
    var leadIdCol = 1, statusCol = 12, notesCol = 13, followUpCol = 14;

    for (var h = 0; h < headers.length; h++) {
      var hName = headers[h].toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      if (hName === 'leadid') leadIdCol = h + 1;
      if (hName === 'status') statusCol = h + 1;
      if (hName === 'notes') notesCol = h + 1;
      if (hName === 'followupdate') followUpCol = h + 1;
    }

    function findRowByLeadId(idToFind) {
      if (!idToFind) return -1;
      var targetId = idToFind.toString().trim();
      for (var r = 1; r < allData.length; r++) {
        var rowId = (allData[r][leadIdCol - 1] || "").toString().trim();
        if (rowId === targetId) return r + 1;
      }
      return -1;
    }

    function ensureFollowUpColumn() {
      if (headers.length < 14 || followUpCol > sheet.getLastColumn()) {
        sheet.getRange(1, 14).setValue("Follow-up Date").setFontWeight("bold");
        followUpCol = 14;
      }
    }

    if (action === "updateStatus") {
      var leadIdToUpdate = data.leadId, newStatus = data.status;
      var rowNum = findRowByLeadId(leadIdToUpdate);
      if (rowNum !== -1) {
        sheet.getRange(rowNum, statusCol).setValue(newStatus);
        var curNotes = (sheet.getRange(rowNum, notesCol).getValue() || "").toString().trim();
        var appendNote = "[" + new Date().toISOString() + "] System: Status updated to " + newStatus;
        sheet.getRange(rowNum, notesCol).setValue(curNotes ? (curNotes + "\\n" + appendNote) : appendNote);
        return responseJSON({ result: "success", action: "updateStatus", leadId: leadIdToUpdate, status: newStatus });
      }
      return responseJSON({ result: "error", message: "Lead ID not found: " + leadIdToUpdate });
    }

    if (action === "scheduleFollowUp") {
      var leadIdFu = data.leadId, fuDate = data.followUpDate || "";
      var rowNum = findRowByLeadId(leadIdFu);
      if (rowNum !== -1) {
        ensureFollowUpColumn();
        sheet.getRange(rowNum, statusCol).setValue("Follow-up");
        sheet.getRange(rowNum, followUpCol).setValue(fuDate);
        var curNotes = (sheet.getRange(rowNum, notesCol).getValue() || "").toString().trim();
        var appendNote = "[" + new Date().toISOString() + "] System: Scheduled follow-up for " + fuDate;
        sheet.getRange(rowNum, notesCol).setValue(curNotes ? (curNotes + "\\n" + appendNote) : appendNote);
        return responseJSON({ result: "success", action: "scheduleFollowUp", leadId: leadIdFu, followUpDate: fuDate });
      }
      return responseJSON({ result: "error", message: "Lead ID not found: " + leadIdFu });
    }

    if (action === "addNote") {
      var leadIdNote = data.leadId, noteText = data.text || data.note, author = data.author || "Agent";
      var rowNum = findRowByLeadId(leadIdNote);
      if (rowNum !== -1) {
        var curNotes = (sheet.getRange(rowNum, notesCol).getValue() || "").toString().trim();
        var appendNote = "[" + new Date().toISOString() + "] " + author + ": " + noteText;
        sheet.getRange(rowNum, notesCol).setValue(curNotes ? (curNotes + "\\n" + appendNote) : appendNote);
        return responseJSON({ result: "success", action: "addNote", leadId: leadIdNote, text: noteText });
      }
      return responseJSON({ result: "error", message: "Lead ID not found: " + leadIdNote });
    }

    if (action === "logContact") {
      var leadIdLog = data.leadId, method = data.method || "Call", customNote = data.customNote || "";
      var rowNum = findRowByLeadId(leadIdLog);
      if (rowNum !== -1) {
        var currentStatus = (sheet.getRange(rowNum, statusCol).getValue() || "").toString().trim();
        if (currentStatus === "New") sheet.getRange(rowNum, statusCol).setValue("Contacted");
        var curNotes = (sheet.getRange(rowNum, notesCol).getValue() || "").toString().trim();
        var appendNote = "[" + new Date().toISOString() + "] System: Outbound " + method + " contact initiated." + (customNote ? " Note: " + customNote : "");
        sheet.getRange(rowNum, notesCol).setValue(curNotes ? (curNotes + "\\n" + appendNote) : appendNote);
        return responseJSON({ result: "success", action: "logContact", leadId: leadIdLog, method: method });
      }
      return responseJSON({ result: "error", message: "Lead ID not found: " + leadIdLog });
    }

    var name = (data.name || data.Name || "").toString().trim();
    var phone = (data.phone || data.Phone || "").toString().trim();
    var service = (data.service || data.Service || "").toString().trim();
    var details = (data.details || data.Details || "").toString().trim();
    var address = (data.address || data.Address || "").toString().trim();
    var clientId = (data.clientId || DEPLOYED_CLIENT_ID).toString().trim();
    if (data.clientId && data.clientId.toString().trim() !== DEPLOYED_CLIENT_ID) {
      // Enforce DEPLOYED_CLIENT_ID for this script deployment
      clientId = DEPLOYED_CLIENT_ID;
    }
    var businessName = (data.businessName || "${config.businessName}").toString().trim();
    var leadSource = (data.leadSource || "${config.leadSource || 'Google Search'}").toString().trim();
    var pageUrl = (data.pageUrl || "").toString().trim();

    if (!name || !phone || !service) {
      return responseJSON({ result: "error", message: "Missing required fields: Name, Phone, Service." });
    }

    var cleanPhone = phone.replace(/\\D/g, "");
    var existingRowNum = data.leadId ? findRowByLeadId(data.leadId) : -1;

    if (existingRowNum === -1) {
      for (var k = 1; k < allData.length; k++) {
        var rowPhone = allData[k][5] ? allData[k][5].toString().replace(/\\D/g, "") : "";
        var rowService = allData[k][6] ? allData[k][6].toString().toLowerCase().trim() : "";
        if (rowPhone && rowPhone === cleanPhone && rowService === service.toLowerCase().trim()) {
          existingRowNum = k + 1;
          break;
        }
      }
    }

    if (existingRowNum !== -1) {
      var existingLeadId = sheet.getRange(existingRowNum, leadIdCol).getValue().toString();
      var oldDetails = sheet.getRange(existingRowNum, 8).getValue().toString();
      sheet.getRange(existingRowNum, 8).setValue(details ? (oldDetails + " | Update: " + details) : oldDetails);
      return responseJSON({ result: "success", action: "createLead", leadId: existingLeadId, message: "Existing lead record updated." });
    }

    var now = new Date();
    var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT", "yyyyMMdd");
    var rowCount = sheet.getLastRow();
    var leadNum = ("000" + rowCount).slice(-4);
    var leadId = data.leadId || ("LP-" + dateStr + "-" + leadNum);

    sheet.appendRow([
      leadId, now.toISOString(), clientId, businessName, name, phone, service, details, address, leadSource, pageUrl, "New", "", data.followUpDate || ""
    ]);

    return responseJSON({ result: "success", action: "createLead", leadId: leadId, message: "Lead created successfully." });
  } catch (error) {
    return responseJSON({ result: "error", message: "Error: " + error.toString() });
  } finally {
    lock.releaseLock();
  }
}
`;
}

/**
 * Generate step-by-step README.md
 */
export function generateReadmeMd(config: ClientConfig): string {
  return `# 🚀 LOCAL LEAD CAPTURE SYSTEM SETUP GUIDE

## Business: ${config.businessName}
## Client ID: ${config.clientId || 'client-hvac-dallas-01'}

---

### GOOGLE SHEETS & APPS SCRIPT SETUP (10 EASY STEPS):

- **STEP 1**: Create a new Google Sheet in Google Drive.
- **STEP 2**: Add these 13 column headers in Row 1:
  \`Lead ID\` | \`Timestamp\` | \`Client ID\` | \`Business Name\` | \`Name\` | \`Phone\` | \`Service\` | \`Details\` | \`Address\` | \`Lead Source\` | \`Page URL\` | \`Status\` | \`Notes\`
- **STEP 3**: Open **Extensions → Apps Script**.
- **STEP 4**: Paste the complete Apps Script code from \`Code.gs\`.
- **STEP 5**: Save the script file.
- **STEP 6**: Click **Deploy → New Deployment → Web App**.
- **STEP 7**: Set **Execute as**: \`Me\`.
- **STEP 8**: Set **Who has access**: \`Anyone\`.
- **STEP 9**: Click Deploy and copy the **Web App URL**.
- **STEP 10**: Put that URL into \`config.js\` under \`formEndpoint\`.

---

### LEAD PILOT FIELD MAPPING (FUTURE INTEGRATION):
- \`Name\` → Lead Name
- \`Phone\` → Phone Number
- \`Service\` → Requested Service
- \`Details\` → Notes
- \`Address\` → Service Address
- \`Client ID\` → Tenant/Client ID
- \`Lead Source\` → Lead Channel
- \`Timestamp\` → Created At
- \`Status\` → Lead Status (Default: \`New\`)
`;
}
