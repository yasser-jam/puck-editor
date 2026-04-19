# Software Requirements Specification

## for

# SOOQ — Unified E-Commerce & Mobile App Builder for the Syrian Market

**Version 9.8**

**Prepared by** SOOQ Project Team

**Organization** SOOQ Platform

**Date** 2026-04-06

---


| Field                | Value                                                                     |
| -------------------- | ------------------------------------------------------------------------- |
| **Document Version** | 9.8                                                                       |
| **Tech Stack**       | Spring Boot · Flutter · React (TS) · PostgreSQL · Docker · GitHub Actions |
| **Primary Market**   | Syria & Arabic-speaking region                                            |
| **Target Users**     | Non-technical SME merchants, customers (shoppers), delivery drivers       |


---

## Table of Contents

1. [Introduction](#1-introduction)
  - 1.1 Purpose
  - 1.2 Document Conventions
  - 1.3 Intended Audience and Reading Suggestions
  - 1.4 Product Scope
  - 1.5 References
2. [Overall Description](#2-overall-description)
  - 2.1 Product Perspective
  - 2.2 Product Functions
  - 2.3 User Classes and Characteristics
  - 2.3a Customer Relationship Strategy
  - 2.4 Operating Environment
  - 2.5 Design and Implementation Constraints
  - 2.6 User Documentation
  - 2.7 Assumptions and Dependencies
  - 2.8 Key Partners & Strategic Dependencies
  - 2.9 Revenue Streams & Pricing Model
  - 2.10 Cost Structure & Business Economics
3. [External Interface Requirements](#3-external-interface-requirements)
  - 3.1 User Interfaces
  - 3.2 Hardware Interfaces
  - 3.3 Software Interfaces
  - 3.4 Communications Interfaces
4. [System Features](#4-system-features) *(21 modules — 219 functional requirements; P3 scope removed)*
  - **Core Platform:** 4.1 AUTH · 4.2 DSN · 4.3 PRD · 4.4 ORD · 4.5 RET · 4.6 PAY
  - **Mobile & Storefront:** 4.7 APP · 4.8 WEB
  - **Logistics & Customers:** 4.9 SHP · 4.10 CUS · 4.11 NTF
  - **Growth & Marketing:** 4.12 ANL · 4.13 SEO · 4.14 GEO · 4.15 CUR · 4.16 TAX/LEG
  - **Merchant Operations:** 4.17 STR · 4.18 MED · 4.19 ADM · 4.20 IMP
  - **Integrations & AI:** 4.21 AI
  - **Marketplace Features:** 4.22 Category Gallery (GAL)
  - 4.23 Requirement Count Summary
5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
  - 5.1 Performance Requirements
  - 5.2 Safety Requirements (14 requirements)
  - 5.3 Security Requirements (15 requirements)
  - 5.4 Software Quality Attributes (Reliability, Scalability, Maintainability, Operations)
  - 5.5 Business Rules (9 rules)
6. [Other Requirements](#6-other-requirements)
  - 6.1 Localization · 6.2 Accessibility · 6.3 Data Portability · 6.4 Caching · 6.5 UX States · 6.6 Inventory Audit · 6.7 GEO Performance

- [Appendix A: Glossary](#appendix-a-glossary) (38 terms)
- [Appendix B: Analysis Models](#appendix-b-analysis-models) (Use Case Diagram, **62 Detailed Use Case Specifications**, ER Diagram, Order State Machine, Data Models, Auth Model, RLS Lifecycle)
- [Appendix C: To Be Determined List](#appendix-c-to-be-determined-list) (9 items)

---

## Revision History


| Name | Date       | Reason For Changes                                                                                                                                                                                                                                                                                                                                                              | Version          |
| ---- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Team | 2026-02-23 | Initial draft: basic Shopify/Salla benchmarking, market analysis                                                                                                                                                                                                                                                                                                                | 1.0              |
| Team | 2026-02-26 | Complete rewrite: 212 Shopify features, 98 Salla features, 192 SOOQ requirements with IDs and acceptance criteria                                                                                                                                                                                                                                                               | 2.0              |
| Team | 2026-02-28 | Major expansion from 192 to 284 requirements; 7 new functional modules and 4 new NFR categories                                                                                                                                                                                                                                                                                 | 3.0              |
| Team | 2026-03-08 | Integrated Shopify/Salla App Store extensibility references as appendices                                                                                                                                                                                                                                                                                                       | 4.0              |
| Team | 2026-03-11 | Strategic gap analysis; 12 new modules and 46 new requirements; total 335 requirements                                                                                                                                                                                                                                                                                          | 6.0              |
| Team | 2026-03-14 | Priority rebalancing, structural reorganization, IEEE format conversion; total 335 requirements                                                                                                                                                                                                                                                                                 | 7.0              |
| Team | 2026-03-15 | IEEE quality pass: added stimulus/response sequences to 13 modules, measurable NFR targets, expanded safety requirements (14 items), use case + ER diagrams in Appendix B, feature group navigation, requirement count summary                                                                                                                                                  | 7.1              |
| Team | 2026-03-21 | MVP priority rebalancing: deferred 25+ features to P3; added CUR cost-price tracking (CUR-006–007), component sub-specs (DSN-002a–j), color engine upgrade (DSN-005-A–D), new modules GAL and BND; 30+ content rewrites                                                                                                                                                         | 8.0              |
| Team | 2026-03-25 | Paymera eGate payment gateway integration (PAY rewrite); removed PWA, Freelance Designer, AEO; DSC demoted to P3; shipping/logistics marked TBD; architecture docs format changed to PDF; removed graduation references; Android version and exchange rate approach marked TBD; DSN-005 pending Yasser's task                                                                   | 9.0 (superseded) |
| Team | 2026-03-28 | Removed all P3 functional requirements and P3-only modules from the SRS; renumbered Section 4; three-tier priority (P0–P2); 220 functional requirements in 23 modules                                                                                                                                                                                                              | 9.1              |
| Team | 2026-03-29 | In-house shipping module rewrite: replaced TBD carrier integration with two fulfillment models (SOOQ Ships / Merchant Ships); added delivery agent management, shipment state machine, COD reconciliation; SHP rewritten as 13 minimum-scope P0 requirements; total 224 functional requirements; TBD #5 resolved                                                                | 9.2              |
| Team | 2026-03-29 | Added Delivery Driver role (AUTH-004 updated); introduced Client App / Driver App terminology throughout; added Driver App requirements (APP-015–018); Driver App UI (Section 3.1); Driver API base path; Delivery Driver user class with permission matrix; updated system context diagram, use case diagram, auth model; glossary expanded; total 228 functional requirements | 9.3              |
| Team | 2026-03-29 | Customer delivery visibility (SHP-014); driver performance summary (SHP-015); Driver App download link (APP-019); SOOQ Ships pricing model and business rule #9; WhatsApp scoped to OTP only (NTF-003 → P1); removed Syriatel/MTN Cash, SMS gateway, and WhatsApp notification TBDs; TBD list reduced to 9 items; total 231 functional requirements                             | 9.4              |
| Team | 2026-03-30 | AUTH module rewritten for passwordless phone + WhatsApp OTP authentication model (AUTH-001/002/003/005/016 updated; AUTH-008 removed — no passwords); AUTH-013 clarified as optional TOTP layer; Staff management added to STR module (STR-009–012: staff CRUD, permissions, deactivation); Section 2.2 updated; total 234 functional requirements                              | 9.5              |
| Team | 2026-04-04 | v9.6 consistency pass: aligned Driver authentication to OTP model, clarified tenant-scoped customer identity, constrained `store_config.json` to UI/UX config only, updated DSN-016 StoreConfig versioning note, strengthened ORD-012 persistence/validation wording, switched staff management authority to Owner + Manager, renumbered Section 4 sequentially, removed PAY-013, and narrowed active payment narrative to COD + Paymera only (bank transfer/mobile-wallet narrative references removed); document metadata normalized to 231 functional requirements | 9.6              |
| Team | 2026-04-04 | v9.7 end-of-session refinement: aligned ORD/PAY acceptance criteria with finalized Session 3 ERD decisions (guest cart/order nullable customer link, Paymera credential profile fields, idempotent payment event processing, and COD/manual refund path), and synchronized document version metadata. | 9.7              |
| Team | 2026-04-06 | v9.8 scope optimization: removed Landing Pages module (LND) and cart database persistence; cart data now stored on frontend (localStorage/Redux for web, local storage for mobile app). Eliminated LANDING_PAGE and LANDING_FORM_SUBMISSION tables (2 tables). Eliminated CART and CART_ITEM tables (2 tables). Total modules reduced from 23 to 21; total tables reduced from 73 to 69; total functional requirements reduced to ~219 (removed ~12 LND and cart-related requirements). | 9.8              |
| Team | 2026-04-17 | Refined GAL module: Re-branded "Category Gallery" to "Ad Exchange & Discovery" with a "Strong-to-New" merchant ad rotation model. Added `AD_CAMPAIGN`, `AD_PLACEMENT`, and `AD_EVENT_LOG` to core architecture. | 9.9              |


---

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for **SOOQ** version 1.0 — a unified e-commerce platform and mobile app builder designed for the Syrian market. SOOQ enables non-technical merchants to create online stores with bilingual (Arabic/English) web storefronts and branded Android applications from a single no-code visual builder.

This SRS covers the complete system including: the Spring Boot backend, the React-based merchant admin panel and storefront, Flutter-based **Client App** (customer-facing storefront), and the GitHub Actions APK build pipeline. It defines 219 functional requirements across 21 functional modules and 12 non-functional categories. Requirements previously classified as **P3 (Future)** are excluded from this revision.

### 1.2 Document Conventions

This document follows these conventions:

- **Priority Levels:** All requirements use a three-tier priority system. Higher-level module priorities are inherited by child requirements unless explicitly overridden.
  - **P0 — Must Ship:** Platform does not function without these. Blocks launch if missing.
  - **P1 — Should Ship:** Expected by early users and stakeholders. Weak without them.
  - **P2 — Nice to Have:** Adds value but not essential for initial release.
- **Requirement IDs:** Each requirement has a unique ID in the format `MODULE-NNN` (e.g., `AUTH-001`, `PRD-009`).
- **Acceptance Criteria:** Every functional requirement includes a testable acceptance criterion.
- **Bold text** indicates key terms defined in the Glossary (Appendix A).

### 1.3 Intended Audience and Reading Suggestions


| Audience                | Recommended Sections                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project Evaluators**  | Section 1 (scope), Section 2 (overview), Section 4 (features), Section 5 (NFRs)                                                                 |
| **Backend Developers**  | Section 3.3 (software interfaces), Section 4 (all features), Section 5 (performance, security)                                                  |
| **Frontend Developers** | Section 3.1 (user interfaces), Section 4.2 (design studio), Section 4.19 (web storefront)                                                       |
| **Mobile Developers**   | Section 3.1 (Client App UI), Section 4.7 (mobile app generation), Section 4.8 (shipping — third-party carriers), Section 6.1 (localization) |
| **QA/Testers**          | Section 4 (acceptance criteria per requirement), Section 5.1 (performance targets)                                                              |
| **Project Managers**    | Section 1.4 (scope), Section 2 (overall description), Section 5.5 (business rules)                                                              |


Readers should begin with Sections 1 and 2 for context, then proceed to the sections most relevant to their role. Section 4 is the largest section and is organized by functional module — each can be read independently.

### 1.4 Product Scope

**SOOQ** is a self-contained, multi-tenant e-commerce platform purpose-built for the Syrian market. It addresses a critical gap: no existing platform (Shopify, Salla, or others) serves Syria with native SYP currency support, Arabic-first RTL design, Syrian payment methods (COD and Paymera eGate online card payments), or Syrian address structures (14 governorates).

**Key objectives:**

- Enable Syrian SME merchants to launch online stores without technical knowledge
- Provide both a web storefront and a branded Android **Client App** from one visual builder
- Operate a third-party delivery network powered by partnerships with Syrian and regional logistics providers
- Support Arabic-first RTL design with full bilingual (AR/EN) capability
- Operate reliably on Syria's average 4.6 Mbps internet with offline-first mobile support
- Offer a free tier with SYP-denominated paid plans affordable for the Syrian economy

**What SOOQ is NOT:**

- Not a B2B/wholesale platform
- Not a point-of-sale (POS) system
- Not a marketplace (each merchant has an independent store)
- Not a custom development agency — merchants use the no-code builder exclusively

### 1.5 References


| #   | Document                                    | Description                                                                                                                  |
| --- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | SOOQ Requirements Specification V7          | Source document; comprehensive requirements with benchmarking                                                                |
| 2   | IEEE Std 830-1998                           | IEEE Recommended Practice for Software Requirements Specifications                                                           |
| 3   | Shopify Feature Benchmark (212 features)    | Reverse-engineered Shopify 2025–2026 feature set                                                                             |
| 4   | Salla Feature Benchmark (98 features)       | Reverse-engineered Salla 2025–2026 feature set                                                                               |
| 5   | SOOQ Project Description and Ideas          | Vision document with user flows and demo strategy                                                                            |
| 6   | Spring Boot Reference Documentation         | [https://docs.spring.io/spring-boot/](https://docs.spring.io/spring-boot/)                                                   |
| 7   | Flutter Documentation                       | [https://docs.flutter.dev/](https://docs.flutter.dev/)                                                                       |
| 8   | React Documentation                         | [https://react.dev/](https://react.dev/)                                                                                     |
| 9   | PostgreSQL Row-Level Security Documentation | [https://www.postgresql.org/docs/current/ddl-rowsecurity.html](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) |
| 10  | GitHub Actions Documentation                | [https://docs.github.com/en/actions](https://docs.github.com/en/actions)                                                     |
| 11  | Paymera eGate API Specification v3.0        | Payment gateway API docs: Create Payment, Payment Status, Reversal; Basic Auth; redirect/OTP flow                            |


---

## 2. Overall Description

### 2.1 Product Perspective

SOOQ is a new, self-contained product — not a replacement or extension of any existing system. It was conceived after analysis revealed that no existing e-commerce platform adequately serves the Syrian market:

- **Shopify** (4.6M+ stores globally) lacks SYP currency, Syrian payment methods, native Arabic RTL, affordable pricing for Syria, and generates no mobile apps.
- **Salla** (68,000+ stores, Saudi-focused) lacks Syrian payment methods, Syrian shipping carriers, takes 72 hours for app builds, and prices in SAR.

SOOQ differentiates through: (1) a JSON-driven OTA architecture where mobile app UI updates without rebuilding, (2) APK generation in under 15 minutes via GitHub Actions, (3) website + mobile app from one builder, (4) Arabic-first design, (5) offline-first mobile for unreliable Syrian connectivity, and (6) a free tier denominated in SYP.

**System Context:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              Clients                                      │
│  ┌──────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │ React Web    │  │ Client App           │  │ Third-Party          │ │
│  │ (Admin +     │  │ (Flutter — per-      │  │ Logistics API        │ │
│  │  Builder +   │  │  merchant white-     │  │ Integration          │ │
│  │  Storefront) │  │  label storefront)   │  │                      │ │
│  │              │  │  • store_config.json  │  │  • Carrier APIs      │ │
│  │              │  │  • OTA UI updates     │  │  • Webhook tracking  │ │
│  └──────┬───────┘  └──────────┬───────────┘  └───────────┬─────────────┘ │
└─────────┼─────────────────────┼──────────────────────────┼──────────────┘
          └─────────────────────┼──────────────────────────┘
                                │ HTTPS (REST API)
                                ▼
┌────────────────────────────────────────────────────────┐
│                 Spring Boot Backend                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│  │ Auth   │ │Product │ │ Order  │ │Builder │ │ App  │ │
│  │ Module │ │ Module │ │ Module │ │ Module │ │Build │ │
│  └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘ └──┬───┘ │
│  ┌────▼──────────▼──────────▼──────────▼────────▼───┐  │
│  │          Shared Services Layer                    │  │
│  │ (Tenant Context · Events · File Storage · Cache)  │  │
│  └──────────────────────┬────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
          ┌───────────────┼──────────────┐
     ┌────▼─────┐  ┌─────▼─────┐  ┌─────▼──────┐
     │PostgreSQL│  │   Redis   │  │File Storage│
     │  (RLS)   │  │  (Cache)  │  │(S3/MinIO)  │
     └──────────┘  └───────────┘  └────────────┘

     ┌──────────────────────────────────┐
     │        GitHub Actions             │
     │  (APK Build Pipeline)             │
     │  Triggered by Spring Boot API     │
     └──────────────────────────────────┘
```

### 2.2 Product Functions

SOOQ provides the following major functional groups (detailed in Section 4 — 23 modules, P0–P2 only):

1. **Identity & Tenant Management** — Merchant/customer registration via phone + WhatsApp OTP, passwordless JWT authentication, Google OAuth, RBAC (Owner/Manager/Staff/Customer), tenant isolation via PostgreSQL RLS, audit logging
2. **Design Studio** — No-code drag-and-drop store builder with RTL/LTR support, real-time preview, template library, and JSON-based page configuration
3. **Product & Catalog Management** — Full product CRUD with Arabic support, variants, categories, collections, inventory tracking, search with Arabic NLP
4. **Order Orchestration** — Shopping cart, checkout flow, order state machine, atomic inventory decrement, invoicing, COD support, checkout discount codes
5. **Return & Exchange Workflow** — Customer-initiated returns, reason tracking, merchant approval/rejection
6. **Payment Integration** — COD and Paymera eGate online card payments (with OTP, saved cards, and reversal support), idempotent webhook processing
7. **Mobile App Generation** — Per-merchant white-label **Client App** (Flutter, JSON-driven OTA UI) for customers; APK build via GitHub Actions in < 15 min; push notifications, offline browsing
8. **Shipping & Logistics** — Hybrid fulfillment model: Merchant-Managed (manual status updates, own delivery) or SOOQ-Managed (third-party carrier partnerships); Syrian governorate shipping zones, real-time tracking webhooks, COD settlement reporting, returns management
9. **Customer Management** — Auto-created profiles, account login, customer list
10. **Notifications** — Email and push notifications with bilingual templates
11. **Analytics & Dashboard** — Revenue charts, inventory alerts, CSV/PDF export
12. **SEO & GEO** — Sitemap, structured data (JSON-LD), meta tags, Open Graph
13. **Multi-Currency Display** — SYP/USD dual display with merchant-configurable exchange rates and profit tracking
14. **Tax & Legal** — Configurable tax rates, invoice tax display, legal page templates, cookie consent
15. **Landing Pages** — Static pages and form builder for store-scoped supplementary pages
16. **Store Settings** — Store profile, address, currency display, business hours, social links, logo, staff account management (creation, permissions, deactivation)
17. **Media Management** — Central media library, image optimization (WebP/thumbnails), storage quotas
18. **Web Storefront** — Responsive React storefront with SSR
19. **Platform Administration** — Merchant management, subscription plans, usage tracking, billing
20. **Smart Data Import** — Spreadsheet product import with validation
21. **AI-Assisted Merchant Tools** — Optional LLM-backed descriptions and SEO helpers
22. **Category Gallery** — Optional marketplace-style category merchant discovery

### 2.3 User Classes and Characteristics


| User Class             | Description                                                                                                                                                                                                                            | Frequency | Technical Expertise | Priority  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------- | --------- |
| **Merchant Owner**     | SME owner who creates and manages the store. Full access to all features. Uses the **Merchant Admin Panel** (web).                                                                                                                     | Daily     | Low (non-technical) | Primary   |
| **Store Manager**      | Delegated by owner. Manages products, orders, customers, design. No billing access. Uses the **Merchant Admin Panel** (web).                                                                                                           | Daily     | Low                 | Primary   |
| **Staff Member**       | Handles specific tasks (e.g., order fulfillment, shipping coordination). Limited, role-based permissions. Uses the **Merchant Admin Panel** (web).                                                                                      | Daily     | Low                 | Secondary |
| **Customer (Shopper)** | End-user who browses products, places orders, and tracks deliveries. Uses the **Client App** (Flutter) and/or the **Web Storefront** (React).                                                                                          | Variable  | Low                 | Primary   |
| **Platform Admin**     | SOOQ internal team. Manages merchants, billing, platform health. Cross-tenant. Uses the **Merchant Admin Panel** (web) with elevated privileges.                                                                                       | Daily     | High                | Internal  |


**Permission Matrix:**


| Permission                      | Owner | Manager | Staff | Customer | Platform Admin |
| ------------------------------- | ----- | ------- | ----- | -------- | -------------- |
| Products: CRUD                  | Yes   | Yes     | Read  | No       | Override       |
| Orders: Read                    | Yes   | Yes     | Yes   | Own only | Cross-tenant   |
| Orders: Update Status           | Yes   | Yes     | Yes   | No       | No             |
| Customers: Read                 | Yes   | Yes     | Yes   | No       | Cross-tenant   |
| Store Settings                  | Yes   | Yes     | No    | No       | Override       |
| Staff Management                | Yes   | Yes     | No    | No       | Override       |
| Carrier Configuration           | Yes   | Yes     | No    | No       | Override       |
| Design Studio                   | Yes   | Yes     | No    | No       | No             |
| Analytics                       | Yes   | Yes     | Read  | No       | Platform-wide  |
| Billing/Subscription            | Yes   | No      | No    | No       | Yes            |
| App Generation                  | Yes   | Yes     | No    | No       | No             |
| Shipments: View                 | Yes   | Yes     | Yes   | Own only | Cross-tenant   |
| Shipments: Update Status        | Yes   | Yes     | Yes   | No       | No             |
| COD Reconciliation & Reports    | Yes   | Yes     | Read  | No       | No             |


### 2.3a Customer Relationship Strategy

**Merchant Owner & Store Manager (Primary Customers)**

- **Relationship Model:** Self-service platform with optional premium support (P2)
- **Engagement Channels:** In-app guided tutorials, contextual tooltips, email onboarding series, dedicated Telegram/WhatsApp support channel (P1), knowledge base
- **Support Hours:** 24/7 automated help; human support during Syrian business hours
- **Onboarding:** Interactive wizard-driven setup (store profile, first product, design customization) to reduce time-to-first-sale
- **Retention:** Feature announcements, monthly newsletters, usage analytics dashboard, performance benchmarking against cohort

**Customers (Shoppers)**

- **Relationship Model:** Transaction-based with optional loyalty rewards (P2)
- **Engagement Channels:** Email (order confirmation, shipping updates, abandoned cart), push notifications (new product alerts, flash sales), SMS fallback for critical updates
- **Support:** In-app FAQ, order tracking with real-time shipment updates, auto-generated customer service email address per store
- **Retention:** Wishlist feature, personalized product recommendations (P2), loyalty points or discount codes (P2)

**Platform Admin (SOOQ Internal)**

- **Relationship Model:** Internal monitoring and control
- **Engagement Channels:** Admin dashboard with alerts, Slack/email notifications for critical events (payment failures, high refund rates, security incidents)
- **Support:** Internal documentation, architecture runbooks, incident response procedures

---

### 2.4 Operating Environment


| Component          | Environment                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Backend**        | Spring Boot (Java 17+) running in Docker containers on Linux VPS behind Nginx reverse proxy     |
| **Database**       | PostgreSQL 15+ with Row-Level Security enabled; HikariCP connection pooling                     |
| **Cache**          | Redis 7+ for session storage, rate limiting, and data caching                                   |
| **File Storage**   | S3-compatible object storage (MinIO for dev, cloud S3 for production)                           |
| **Web Frontend**   | React (TypeScript) served via Nginx; supports Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **Mobile App**     | Flutter 3.x targeting Android 10+ (API level 29+); tested on mid-range devices                  |
| **CI/CD**          | GitHub Actions for CI pipeline and APK build workflow                                           |
| **SSL**            | Let's Encrypt with auto-renewal via Certbot                                                     |
| **Target Network** | Syrian internet: average 4.6 Mbps bandwidth with intermittent connectivity                      |


### 2.5 Design and Implementation Constraints

1. **Language Constraint:** All user-facing content must support Arabic (RTL) as the primary language with English (LTR) as secondary. Every UI component must render correctly in both directions.
2. **Currency Constraint:** SYP (Syrian Pound) must be the primary currency. USD dual-display is required due to SYP volatility. Online card payments are handled via **Paymera eGate** (redirect/OTP model through Paymera network and partner banks).
3. **Infrastructure Constraint:** The platform must operate on a single VPS initially (no Kubernetes). A modular monolith architecture is mandated over microservices.
4. **Multi-Tenancy Constraint:** PostgreSQL Row-Level Security (RLS) must be used for tenant isolation. Application-level filtering alone is insufficient.
5. **Mobile Build Constraint:** APK generation relies on GitHub Actions free-tier runners. Builds must complete within 15 minutes. iOS builds require macOS runners (deferred to P2).
6. **Payment Constraint:** COD is the primary payment method. **Paymera eGate** is integrated as the online card payment gateway (redirect/iframe model with OTP verification).
7. **No-Code Constraint:** Merchants must never see code, JSON, or technical configuration. The visual builder must abstract all complexity.
8. **Technology Stack:** Spring Boot (Java), Flutter, React (TypeScript), PostgreSQL, Redis, Docker, GitHub Actions — no deviations without justification.
9. **Timeline Constraint:** The system is a 13-week project. MVP scope must be achievable within this timeline.

### 2.6 User Documentation

The following documentation will be delivered with the software:


| Document                   | Format              | Description                                                                                                                                                                                                      |
| -------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Documentation          | Swagger/OpenAPI 3.1 | Auto-generated interactive API docs at `/swagger-ui.html`                                                                                                                                                        |
| Merchant Quick-Start Guide | In-app              | Guided wizard and contextual tooltips during store creation                                                                                                                                                      |
| Architecture Documentation | PDF                 | ERD, system context diagram, module boundaries, deployment guide, sequence diagrams (checkout, payment, OTA update), component diagram, class diagrams (core domain), API flow diagrams, database schema diagram |
| Test Report                | PDF                 | JMeter load test results, security audit, test coverage report                                                                                                                                                   |


### 2.7 Assumptions and Dependencies

**Assumptions:**

1. Syrian internet infrastructure remains accessible (no complete shutdowns during development/demo).
2. GitHub Actions free tier provides sufficient build minutes for APK generation during development and launch.
3. Target merchants own Android smartphones (minimum Android version: Android 10+, API level 29).
4. COD remains the dominant payment method in Syria (estimated 85%+ of e-commerce transactions).
5. SYP exchange rate management approach is **TBD** — whether to use merchant-configured manual rates, a real-time feed, or a hybrid approach has not been decided yet.

**Dependencies:**


| Dependency                      | Impact if Unavailable                                          |
| ------------------------------- | -------------------------------------------------------------- |
| GitHub Actions                  | APK build pipeline fails; manual builds required               |
| Firebase Cloud Messaging        | Push notifications unavailable                                 |
| PostgreSQL 15+ with RLS         | Tenant isolation mechanism unavailable; architectural redesign |
| Let's Encrypt / Certbot         | SSL certificate provisioning fails; HTTPS unavailable          |
| Paymera eGate API               | Online card payment unavailable; fallback to COD only          |
| External LLM API (e.g., OpenAI) | AI-assisted merchant tools (AI module) unavailable             |


### 2.8 Key Partners & Strategic Dependencies

SOOQ's success depends on strategic partnerships and third-party integrations that enable core functionality. This section identifies critical partners and suppliers aligned with the Business Model Canvas "Key Partners" component.

**Payment Processing Partners**

| Partner         | Service                    | Strategic Role                                                                                 | SLA/Commitment                          |
| --------------- | -------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Paymera**     | Online card payment gateway | Primary online payment method (P0); handles card tokenization, OTP flows, and reversals       | 99.5% uptime; sub-3sec response time    |
| **Bank Partners** | COD reconciliation        | Partner bank connections for COD settlement; enables merchant cash-out workflows              | Daily settlement processing              |
| **Telecom Partners** | SMS fallback            | Syriatel/MTN SMS delivery for OTP when WhatsApp fails; backup authentication channel          | 99% delivery rate                       |

**Infrastructure & DevOps Partners**

| Partner                | Service                   | Strategic Role                                                                          | SLA/Commitment           |
| ---------------------- | ------------------------- | --------------------------------------------------------------------------------------- | ------------------------ |
| **GitHub**             | CI/CD & source control    | GitHub Actions for APK build pipeline; code hosting and collaboration                   | 99.9% uptime            |
| **Let's Encrypt**      | SSL/TLS certificate       | Free automated SSL provisioning via Certbot; enables HTTPS for all domains               | Continuous availability |
| **Firebase/Google**    | Cloud messaging (FCM)     | Push notification delivery to Android devices; real-time engagement channel              | 99.9% uptime            |
| **Cloud Provider**     | VPS & object storage      | Linux VPS hosting; S3-compatible storage for images and APK artifacts (MinIO in dev)     | 99.5% uptime SLA        |

**Market & Logistics Partners**

| Partner              | Service                | Strategic Role                                                                                | Status              |
| -------------------- | ---------------------- | --------------------------------------------------------------------------------------------- | ------------------- |
| **Syrian Carriers**   | Shipping logistics     | Optional integration for merchant fulfillment; enables COD reconciliation workflows          | P2 (Investigation)  |
| **Delivery Networks** | Last-mile delivery     | Optional partnership for urban delivery zones; expands SOOQ carrier portfolio                | P2 (Future)         |
| **Payment Wallets**   | Digital payments       | Future integration (P2) for mobile wallet and alternative payment methods                    | P2 (TBD)            |

**Technology & Data Partners**

| Partner              | Service            | Strategic Role                                                        | Status |
| -------------------- | ------------------ | --------------------------------------------------------------------- | ------ |
| **OpenAI / LLM API** | AI-assisted tools  | Optional partner for merchant product descriptions and SEO generation | P2     |
| **Arabic NLP Vendors** | Search & indexing | Optional vendor for advanced Arabic text search and categorization     | P2     |

**Partner Motivations:**

- **Paymera & Banks:** Market expansion in Syria; transaction volume growth
- **GitHub & Cloud Providers:** Developer ecosystem growth; increased platform adoption
- **Firebase:** User engagement; analytics data
- **Telecom Partners:** SMS revenue; service reliability for emerging markets
- **Delivery Networks:** Last-mile optimization; merchant retention

---

### 2.9 Revenue Streams & Pricing Model

SOOQ employs a multi-tiered, SYP-denominated freemium subscription model targeting Syrian SME merchants. This section details revenue streams aligned with the Business Model Canvas "Revenue Streams" component.

**Subscription Tiers (Merchant Merchants)**

All prices denominated in **SYP (Syrian Pound)**. Conversion to USD shown for reference (subject to fluctuation).

| Tier          | Monthly Price (SYP) | USD Equivalent* | Target Segment | Key Features | Revenue Model |
| ------------- | ------------------- | --------------- | -------------- | ---- | --- |
| **Free**      | Free                | Free            | Bootstrappers  | Up to 20 products, basic storefront, manual shipping, in-app support | Brand loyalty, upsell funnel |
| **Starter**   | ~150,000            | ~$25 (est.)     | Solo merchants | Up to 100 products, advanced design, 2 staff accounts, email support | Conversion + ARPU growth |
| **Growth**    | ~375,000            | ~$62 (est.)     | Growing merchants | Unlimited products, 5 staff accounts, analytics, priority support, API access (P2) | Primary revenue stream |
| **Enterprise** | Custom             | Custom          | Large merchants | Custom integrations, dedicated support, SLA guarantees, dedicated account manager (P2) | High-margin upsell |

*USD equivalents subject to SYP volatility; exchange rates recalculated quarterly

**Transaction Fees (Optional P2)**

- **Payment Processing Fee:** 2–3% per online (Paymera) transaction (to be negotiated with Paymera)
- **COD Commission:** Optional 1–2% commission on cash-on-delivery orders (if SOOQ-Managed carriers handle fulfillment)

**Alternative Revenue Streams (P2 — Future)**

| Stream              | Mechanism                                                                          | Timeline |
| ------------------- | ---------------------------------------------------------------------------------- | -------- |
| **App Store Listings** | Premium marketplace listings in Category Gallery; featured merchant ads          | P2       |
| **Premium Templates** | Advanced store design templates; third-party designer-built themes               | P2       |
| **Data Analytics** | Aggregated, anonymized market insights sold to suppliers (non-merchant PII)       | P2       |
| **Certified Training** | Merchant training programs; e-learning modules for advanced features              | P2       |
| **Affiliate Network** | Referral commissions for driving new merchant signups                             | P2       |

**Free Tier Strategy:**

- Unlimited stores per merchant
- No product limits on Free tier (encourages product experimentation)
- Free tier automatically converts to "inactive" after 90 days with zero activity; requires merchant re-engagement to reactivate
- Free merchants do NOT pay transaction fees but contribute to platform ecosystem growth and data richness

**Pricing Rationale:**

- **SYP Denominated:** Removes currency conversion friction for Syrian merchants; prices affordable for local SME budgets
- **Freemium Model:** Reduces activation barrier; builds network effects and trust
- **Subscription > Transaction:** Predictable recurring revenue; aligns merchant and platform incentives for order growth
- **Growth Tier Focus:** 60% of revenue projected from Growth tier merchants (fastest-growing segment)

---

### 2.10 Cost Structure & Business Economics

SOOQ operates on a modular monolith architecture designed to minimize operational costs while maintaining scalability. This section details the cost structure aligned with the Business Model Canvas "Cost Structure" component.

**Fixed Costs (Monthly Recurring)**

| Cost Category           | Monthly Cost (USD)* | Cost Driver                                                               | Optimization Strategy               |
| ----------------------- | ------------------- | ----------------------------------------- | ----------------------------------- |
| **Infrastructure**      | $400–800            | Linux VPS (4vCPU, 8GB RAM, 100GB SSD); Nginx reverse proxy               | Multi-tenant single VPS; auto-scaling to Kubernetes later (P2) |
| **Database & Cache**    | $100–200            | PostgreSQL 15+ RDS (or self-hosted); Redis 7+ for caching                | Self-hosted on VPS to reduce SaaS costs |
| **Object Storage**      | $50–150             | S3-compatible storage for product images, APK artifacts, media library   | Object lifecycle policies; image compression (WebP) |
| **CI/CD & Automation**  | $0 (GitHub free)    | GitHub Actions (free tier for PRs and builds); occasional paid minutes   | Leverage free tier; cache optimization |
| **Domain & SSL**        | $10–20              | Domain registration; Let's Encrypt (free) with Certbot auto-renewal      | Annual prepay discounts |
| **Communication**       | $50–100             | Firebase Cloud Messaging (free up to 1M notifications/month); SMS fallback ($0.01–0.05/SMS via Telecom) | Optimize push notification frequency |
| **Security & Monitoring** | $0–50              | Self-hosted ELK stack (logs/monitoring); optional Datadog/New Relic (P2) | Start with self-hosted; migrate later |
| **Customer Support**    | $0 (in-house)       | Community Telegram channel (free); no dedicated support staff at launch   | Scale with growth; hire support staff at 100+ merchants |

**Total Fixed Monthly Cost:** $610–1,320 USD (~900k–2M SYP at current rates)

*Costs shown in USD for clarity; actual payments may be in SYP or via barter with partners

**Variable Costs (Per Unit/Transaction)**

| Cost Category              | Cost Per Unit | Driver                                                                      | Notes |
| -------------------------- | ------------- | --------------------------------------------------------------------------- | ----- |
| **Payment Processing**     | 2–3%          | Paymera transaction fee; charged per online card payment                   | COD is free (merchant settlement via partner bank) |
| **SMS Fallback OTP**       | $0.02–0.05    | Per SMS sent (WhatsApp is free via Meta Business API)                      | OTP only; not used for general notifications |
| **Object Storage**         | $0.023/GB     | S3-compatible storage per merchant's media library and APK artifacts       | Includes image compression and CDN delivery |
| **Push Notifications**     | Free (up to 1M) | Firebase Cloud Messaging; charged incrementally for overages ($0.50/M)     | Typically zero cost for first 1,000 merchants |
| **API Calls**              | Negligible    | Third-party AI LLM (OpenAI) for product descriptions (P2)                  | $0.01–0.10 per merchant per month if enabled |

**Scaling Economics (Year 1 Targets)**

| Milestone           | Merchants | Fixed Costs | Transaction/Merchant Fee Revenue | Net Margin | Headcount |
| ------------------- | --------- | ----------- | -------------------------------- | ---------- | --------- |
| **M1 (Launch)**     | 50        | $900        | $2,000 (est. $40/merchant)        | -78%       | 2 (Dev) |
| **M3**              | 200       | $1,200      | $8,000 (est. $40/merchant)        | -71%       | 3 (Dev + 1 Support) |
| **M6**              | 500       | $1,500      | $20,000 (est. $40/merchant)       | -92.5%     | 4 |
| **M9**              | 1,000     | $1,800      | $40,000 (est. $40/merchant)       | -95.5%     | 5 |
| **M12 (Break-even target)** | 1,500 | $2,000 | $90,000 (est. $60/merchant avg) | +4,400%** | 6 |

**Notes:**
- Assumes 40% of merchants upgrade from Free to Starter/Growth within 6 months
- Break-even at ~1,500 merchants (conservative estimate)
- Beyond break-even, marginal costs approach zero (mostly variable storage/payment fees)
- Headcount assumes Co-founders + part-time developers initially, scaling to in-house team

**Cost Optimization Strategies:**

1. **Modular Monolith:** Single codebase reduces DevOps complexity vs. microservices
2. **PostgreSQL RLS:** Leverages database row-level security to eliminate application-level multi-tenancy overhead
3. **OTA Architecture:** Flutter app UI updates without rebuilds; eliminates App Store submission delays and fees
4. **GitHub Actions Free Tier:** Uses free minutes for CI/CD; 3,000 free minutes/month sufficient for team < 5 developers
5. **Self-Hosted Infrastructure:** Defer Kubernetes migration until 5,000+ merchants (cost savings ~60% vs. Kubernetes at scale)
6. **Freemium Model:** Low-touch onboarding (no sales team); self-serve design studio eliminates implementation services
7. **Community Support:** Telegram/Discord for peer-to-peer support before hiring dedicated support staff

**Business Rules (Revenue & Economics):**

- **Freemium Conversion Target:** 40% Free → Paid within 6 months (industry avg: 2–5%)
- **Customer Acquisition Cost (CAC):** <$5 USD per merchant (mostly referral-driven in Syria; paid channels later)
- **Lifetime Value (LTV):** $3,000–5,000 USD per Growth tier merchant (3-year horizon) → LTV:CAC ratio ~600:1
- **Churn Rate Target:** <5% monthly (benchmark: 2–3% for SaaS)
- **Net Revenue Retention:** >110% (upsell from Free → Starter → Growth)


---

## 3. External Interface Requirements

### 3.1 User Interfaces

### 3.1 User Interfaces

SOOQ has three distinct user interfaces across one Flutter app (**Client App**) and two React web applications:

Platform Admin uses the same Merchant Admin Panel application in a cross-tenant internal mode.

**1. Merchant Admin Panel (React — TypeScript)**

- Full RTL layout with Arabic as the default language and EN switcher
- Responsive design supporting 1024px–1920px viewports
- Supports two access scopes: tenant-scoped merchant mode and cross-tenant Platform Admin mode (internal only)
- Sidebar navigation with collapsible menu groups
- Dashboard as the landing page after login
- Toast notifications for all mutations (success/error)
- Empty states with CTAs for all list views
- Loading skeletons on data-heavy pages
- Auto-save on forms every 30 seconds

**2. Customer-Facing Web Storefront (React — TypeScript)**

- Renders from `store_config.json` (same configuration as mobile app)
- Mobile-first responsive design (320px–1920px viewports)
- Lighthouse mobile score target ≥ 80
- Product listing, detail, cart, checkout, and customer account pages
- SEO-friendly SSR/pre-rendered HTML

**3. Client App — Customer-Facing Mobile Storefront (Flutter)**

- Per-merchant white-label Android app generated via GitHub Actions
- Renders UI dynamically from remote `store_config.json` (OTA updates)
- White-labeled with merchant's branding (icon, splash, name, colors)
- Bottom tab navigation: Home, Categories, Cart, Wishlist, Account
- Offline browsing of cached products with "You're offline" banner
- Startup time target < 3 seconds on mid-range Android devices
- Deep linking support for product/order URLs shared via social media

### 3.2 Hardware Interfaces


| Interface           | Description                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **Client Devices**  | Android smartphones/tablets (minimum Android 10+, mid-range: 2GB+ RAM); desktop/laptop browsers  |
| **Server Hardware** | Linux VPS (minimum 4 vCPU, 8GB RAM, 100GB SSD) behind Nginx reverse proxy                        |
| **Camera (Mobile)** | Used for product image capture by merchants within the mobile admin interface                    |
| **File System**     | S3-compatible object storage for images and APK artifacts; local filesystem for development only |


### 3.3 Software Interfaces


| Interface            | Version | Purpose                                                                                                      |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| **PostgreSQL**       | 15+     | Primary data store with RLS for multi-tenancy; JSONB for `store_config`; full-text search with Arabic config |
| **Redis**            | 7+      | Session storage, caching (store config, product listings, tenant resolution), rate limiting counters         |
| **Spring Boot**      | 3.x     | Backend framework; REST API with OpenAPI 3.1 spec                                                            |
| **Flutter**          | 3.x     | Mobile app framework; consumes `store_config.json` for OTA rendering                                         |
| **React**            | 18+     | Admin panel, design studio, and web storefront                                                               |
| **GitHub Actions**   | N/A     | CI/CD pipeline and APK build workflow; triggered via Spring Boot API                                         |
| **Firebase (FCM)**   | N/A     | Push notification delivery to Android devices                                                                |
| **Let's Encrypt**    | N/A     | Automated SSL certificate provisioning and renewal                                                           |
| **Paymera eGate**    | v3.0    | Online card payment gateway: Create Payment, Payment Status, Reversal APIs; Basic Auth; OTP-based card flow  |
| **External LLM API** | N/A     | AI-assisted product description and SEO generation (optional, P2)                                            |


**API Design:**


| Area           | Base Path                     | Consumers                                        |
| -------------- | ----------------------------- | ------------------------------------------------ |
| Auth           | `/api/v1/auth/`*              | All clients (Admin, Client App, Driver App)      |
| Merchant Admin | `/api/v1/admin/`*             | React Admin, Flutter (merchant mode)             |
| Storefront     | `/api/v1/store/{storeSlug}/`* | Client App, Web Storefront                       |
| Builder        | `/api/v1/builder/*`           | React Admin (Design Studio)                      |
| Driver         | `/api/v1/driver/*`            | Driver App (shipment list, status updates, COD)  |
| Public         | `/api/v1/public/*`            | Unauthenticated (store discovery, product pages) |
| Webhooks       | `/api/v1/webhooks/*`          | Third-party integrations                         |


**Standard API Response Format:**

```json
{
  "success": true,
  "data": { },
  "error": null,
  "meta": {
    "timestamp": "2026-02-26T10:30:00Z",
    "request_id": "uuid",
    "pagination": { "page": 1, "size": 20, "total": 150 }
  }
}
```

### 3.4 Communications Interfaces


| Protocol      | Usage                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------- |
| **HTTPS**     | All client-server communication; TLS 1.2+ enforced; HTTP redirected to HTTPS                  |
| **REST**      | All API endpoints follow REST conventions with JSON request/response bodies                   |
| **SMTP**      | Email notifications (order confirmations, shipping updates, account alerts)                    |
| **FCM**       | Firebase Cloud Messaging for push notifications to Android devices                            |
| **SMS**       | OTP fallback delivery when WhatsApp delivery fails                                            |
| **WhatsApp**  | OTP delivery for login, verification, and phone change; no order notifications via WhatsApp   |
| **WebSocket** | Optional: real-time order feed updates on merchant dashboard                                  |
| **Webhooks**  | Inbound: Paymera eGate triggerURL callbacks; Outbound: third-party integrations (HMAC-signed) |


---

## 4. System Features

SOOQ comprises 23 functional modules organized into seven logical groups:


| Group                     | Modules                               | Section                  |
| ------------------------- | ------------------------------------- | ------------------------ |
| **Core Platform**         | AUTH · DSN · PRD · ORD · RET · PAY    | 4.1 – 4.6                |
| **Mobile & Storefront**   | APP · WEB                             | 4.7, 4.19                |
| **Logistics & Customers** | SHP · CUS · NTF                       | 4.8 – 4.10               |
| **Growth & Marketing**    | ANL · SEO · GEO · CUR · TAX/LEG · LND | 4.11 – 4.16              |
| **Merchant Operations**   | STR · MED · ADM · IMP                 | 4.17 – 4.18, 4.20 – 4.21 |
| **Integrations & AI**     | AI                                    | 4.22                     |
| **Marketplace Features**  | GAL                                   | 4.23                     |


Each module follows the IEEE 830 structure: **Description & Priority → Stimulus/Response Sequences → Functional Requirements Table**.

---

### 4.1 Identity & Tenant Management (AUTH)

#### 4.1.1 Description and Priority

Identity and tenant management provides merchant and customer registration, phone-based authentication via WhatsApp OTP (with SMS fallback), social login (Google OAuth), role-based access control, and multi-tenant data isolation via PostgreSQL RLS. The platform uses a **passwordless authentication model** — all users authenticate with their phone number and a one-time code delivered via WhatsApp (primary) with SMS fallback. JWTs are issued upon successful OTP verification. This is the foundation upon which all other modules depend. **Priority: P0 (Critical).**

#### 4.1.2 Stimulus/Response Sequences

- **Merchant Registration:** Merchant submits phone number → System sends WhatsApp OTP (UC-17) → Merchant enters 6-digit code → System validates OTP → Account created (verified) → Redirected to store creation wizard. Alternative: Merchant registers via Google OAuth → System prompts for phone number on first login → phone stored for future OTP operations.
- **Customer Registration:** Customer submits phone number on Store A's storefront → System sends WhatsApp OTP → Customer verifies → Tenant-scoped account created for Store A. A single phone number may have multiple customer records, one per store tenant.
- **Login (All Roles):** User enters phone number → System sends WhatsApp OTP → User enters code → System validates OTP → JWT issued with role claim and tenant ID → Access granted. WhatsApp delivery failure triggers automatic SMS fallback.
- **Google OAuth Login:** User clicks "Sign in with Google" → Google OAuth consent → System matches or creates account → If new user, system prompts for phone number (required for future OTP) → JWT issued.
- **Role-Based Access:** Staff member attempts to access billing settings → System checks JWT permissions → Returns 403 Forbidden. Another staff member with limited permissions attempts to view analytics → System checks JWT permissions → Returns 403 Forbidden.
- **Tenant Isolation:** Merchant A queries products → PostgreSQL RLS policy filters to Tenant A data only → Returns 0 rows from Tenant B.

#### 4.1.3 Functional Requirements


| ID           | Requirement                                                                                      | Priority | Acceptance Criteria                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-001     | Merchant registration (phone + WhatsApp OTP)                                                     | P0       | Merchant submits phone → WhatsApp OTP sent → OTP verified → account created (verified) → redirected to store creation wizard; WhatsApp failure falls back to SMS          |
| AUTH-002     | Customer registration (per store, phone + WhatsApp OTP)                                          | P0       | Customer submits phone on Store A → OTP verified → tenant-scoped account created for Store A; a single phone number may exist in multiple store tenants as separate records |
| AUTH-003     | Passwordless phone + WhatsApp OTP authentication (JWT-issued) for all APIs                       | P0       | Owner/Manager/Staff/Customer authenticate via WhatsApp OTP (SMS fallback) → JWT issued with role and tenant claims; no passwords stored; protected endpoints return 401 without valid JWT |
| AUTH-004     | Role-based access: Owner, Manager, Staff, Customer                                              | P0       | Staff with `orders:read` gets 403 on `products:write`; staff without analytics permission gets 403 on analytics endpoints                                                |
| AUTH-005     | Social login (Google OAuth)                                                                      | P0       | Google OAuth flow returns JWT; user created in DB; new users prompted for phone number on first login (required for future OTP operations)                                |
| AUTH-006     | Store creation wizard (name, slug, currency, category)                                           | P0       | Store slug unique, URL-safe; theme initialized                                                                                                                            |
| AUTH-007     | Tenant isolation via PostgreSQL RLS                                                              | P0       | Tenant A query returns 0 rows from Tenant B data                                                                                                                          |
| ~~AUTH-008~~ | ~~Password reset via email/SMS~~ — **REMOVED**. Platform is fully passwordless: all roles authenticate via WhatsApp OTP → JWT; no passwords are stored. | —        | —                                                                                                                                                                         |
| AUTH-009     | Rate limiting per tenant                                                                         | P0       | Exceed limit → 429 Too Many Requests; 60 req/min free tier                                                                                                                |
| AUTH-010     | Store status control (Active, Maintenance, Password-Protected, Paused, Closed)                   | P0       | Paused store shows "temporarily closed" page; password-protected shows unlock form; closed store returns 410                                                              |
| AUTH-011     | Session management: list active sessions, revoke                                                 | P1       | Revoke session → token rejected on next request                                                                                                                           |
| AUTH-012     | Platform admin panel (SOOQ internal)                                                             | P1       | Admin sees all tenants; can disable a store                                                                                                                               |
| AUTH-013     | Two-factor authentication (optional TOTP on top of OTP)                                          | P2       | TOTP setup → login requires authenticator code after OTP verification; backup codes provided                                                                              |
| AUTH-014     | Audit log for all admin actions                                                                  | P1       | Every create/update/delete in admin recorded with actor, timestamp, entity, old value, new value                                                                          |
| AUTH-015     | Audit log viewer (filterable by action, actor, date)                                             | P1       | Merchant filters log by "product changes this week" → sees all edits                                                                                                      |
| AUTH-016     | Phone number change with WhatsApp OTP verification                                               | P2       | User enters new phone → WhatsApp OTP sent to new phone → OTP verified → phone number updated → all existing sessions invalidated                                          |


---

### 4.2 Design Studio / Store Builder (DSN)

#### 4.2.1 Description and Priority

The Design Studio is SOOQ's core differentiator — a no-code visual builder that allows merchants to design both their web storefront and mobile app from a single interface. The builder operates on a **Page → Section → Block** hierarchy and outputs a `store_config.json` file consumed by both the React web storefront and Flutter mobile app. `store_config.json` is strictly UI/UX configuration (pages → sections → blocks, theme tokens, spacing, typography, colors, and layout positions) and contains no business data. **Priority: P0 (Critical).**

#### 4.2.2 Stimulus/Response Sequences

- **Block Placement:** Merchant drags a "Heading" generic block into a section → Block appears in canvas at drop position → `store_config.json` updated → Preview refreshes in < 500ms.
- **Section Reorder:** Merchant drags a section up the page → All contained blocks move with it → Page layout order persists on save.
- **Theme Change:** Merchant selects new primary color → Preview updates in real-time → Both web and mobile simulated frames reflect change.
- **Template Selection:** Merchant selects "Restaurant" template → All pages populated with pre-configured sections and blocks appropriate for that industry → Merchant customizes content in place.
- **Block Styling:** Merchant selects a Heading block → Opens style panel → Sets padding, font size, and color → Preview updates immediately without page reload.
- **Custom CSS (Web):** Merchant opens the custom CSS editor for a section → Enters valid CSS → Web storefront applies styles; mobile frame is unaffected.

#### 4.2.3 Functional Requirements


| ID      | Requirement                                                                                                                                                             | Priority | Acceptance Criteria                                                                                                                    |     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- | --- |
| DSN-001 | RTL/LTR toggle (Arabic default)                                                                                                                                         | P0       | Toggle direction → all sections and blocks mirror layout correctly                                                                     |     |
| DSN-002 | Template library (industry-specific templates)                                                                                                                          | P0       | Industry-specific templates (e.g., Restaurant, Clothing, Electronics, Services, General) load and render; template count not hardcoded |     |
| DSN-003 | Section-based page layout: pages are composed of ordered, reorderable sections                                                                                          | P0       | Drag section to new position → page renders in updated order; `store_config.json` reflects change                                      |     |
| DSN-004 | Generic block library (Heading, Text, Image, Button, Divider, Spacer, Video, Icon, HTML Embed)                                                                          | P0       | Each generic block renders correctly in RTL and LTR; block is placeable in any section                                                 |     |
| DSN-005 | Bound block library (Product Card, Product Grid, Cart Summary, Checkout Form, Category List, Order History, Wishlist, Search Results)                                   | P0       | Bound blocks render live data from their data source; placeholder data shown in builder canvas                                         |     |
| DSN-006 | Group block (container that nests other blocks with configurable layout: row, column, grid)                                                                             | P0       | Blocks dropped into a group move together; group supports row/column/grid layout; nesting depth ≤ 3 levels                             |     |
| DSN-007 | Drag-and-drop block placement within sections                                                                                                                           | P0       | Drag any block type → drop into target section → JSON config updated → preview refreshes < 500ms                                       |     |
| DSN-008 | Block-level styling: spacing (margin, padding), sizing (width, height, min/max), typography (font, size, weight, line-height, align), colors (text, background, border) | P0       | Changing any style property on a block → preview updates in < 500ms; value written to block's style config                             |     |
| DSN-009 | Custom CSS editor per section and globally (web storefront only)                                                                                                        | P1       | Merchant enters valid CSS → web storefront applies it; invalid CSS → error shown, not applied; mobile unaffected                       |     |
| DSN-010 | Theme customization: global design tokens (primary/secondary/accent colors, base font, border radius, spacing scale)                                                    | P0       | Change primary color → all blocks using that token update across all pages; preview reflects in < 500ms                                |     |
| DSN-011 | Real-time preview (web + simulated mobile frame)                                                                                                                        | P0       | Any builder change → preview reflects without page reload                                                                              |     |
| DSN-012 | Page management: Home, Product Detail, Cart, Checkout, About, Contact, and custom pages                                                                                 | P0       | Create custom page → accessible via URL slug; system pages cannot be deleted                                                           |     |
| DSN-013 | Logo and favicon upload                                                                                                                                                 | P0       | Uploaded logo appears in storefront header and mobile app                                                                              |     |
| DSN-014 | Mobile app icon and splash screen customization                                                                                                                         | P0       | Set icon → build APK → icon appears on device home screen                                                                              |     |
| DSN-015 | Builder state persistence: auto-save every 30 seconds                                                                                                                   | P2       | Close browser mid-edit → reopen → changes preserved                                                                                    |     |
| DSN-016 | Design versioning: Draft + Published states (StoreConfig table)                                                                                                         | P2       | Version/status tracked in dedicated StoreConfig table; only one PUBLISHED config per tenant; save draft keeps published storefront unchanged until publish |     |
| DSN-017 | Theme preview before publishing                                                                                                                                         | P2       | Preview link shows draft design; live store unchanged                                                                                  |     |
| DSN-018 | Block-level undo/redo (20-step history)                                                                                                                                 | P2       | Undo reverts last block/section action; redo restores it; history scoped to current session                                            |     |


---

**Page → Section → Block Hierarchy:**

The builder enforces a strict three-level hierarchy:

1. **Page** — a named route (e.g., Home, Product Detail). Contains an ordered list of sections.
2. **Section** — a full-width horizontal band of the page. Sections are reorderable and independently configurable (background, padding, visibility). A section contains one or more blocks.
3. **Block** — the atomic unit of content within a section. Every block has its own style config and optional data binding.

Blocks are of three kinds:

- **Generic blocks** — self-contained, data-agnostic content elements.
- **Bound blocks** — elements that render live or placeholder store data (products, cart, orders, etc.).
- **Group blocks** — layout containers that nest other blocks (generic or bound) in a row, column, or grid arrangement. Nesting depth is limited to 3 levels.

---

**Generic Block Catalog (DSN-004 Sub-specifications):**


| ID       | Block Type        | Description                                                                         | Priority | Acceptance Criteria                                                         |
| -------- | ----------------- | ----------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------- |
| DSN-004a | Heading           | Single line of text with configurable level (H1–H6)                                 | P0       | Renders correct heading level; respects RTL alignment                       |
| DSN-004b | Text / Paragraph  | Rich text block with inline formatting (bold, italic, link)                         | P0       | Inline styles applied; Arabic text renders right-to-left correctly          |
| DSN-004c | Image             | Single image with alt text, link, and fit mode (cover, contain, fill)               | P0       | Image loads from CDN; alt text persisted; link navigates on storefront      |
| DSN-004d | Button            | CTA button with configurable label, link, style variant (primary/secondary/outline) | P0       | Button navigates to configured URL or page; style variant renders correctly |
| DSN-004e | Divider           | Horizontal line with configurable color, thickness, and margin                      | P0       | Divider renders with configured style; respects section width               |
| DSN-004f | Spacer            | Empty vertical space block with configurable height                                 | P0       | Spacer adds exact configured height; collapses on mobile if configured      |
| DSN-004g | Image Gallery     | Multi-image block with carousel and grid layout variants; lightbox support          | P0       | Carousel and grid variants render; lightbox opens on image click            |
| DSN-004h | Video Embed       | Embed block for YouTube/Vimeo URLs or uploaded video                                | P1       | Video renders in iframe; autoplay and mute controls respected               |
| DSN-004i | Icon              | Icon block with configurable icon set, size, color, and optional link               | P1       | Icon renders from selected set; color and size reflect style config         |
| DSN-004j | HTML Embed        | Raw HTML/JS injection block (web only)                                              | P2       | HTML rendered in sandboxed iframe on web; block hidden on mobile            |
| DSN-004k | Group / Container | Layout container that nests other blocks (row, column, grid)                        | P0       | Blocks dropped inside group stay contained; layout mode applies to children |


---

**Bound Block Catalog (DSN-005 Sub-specifications):**


| ID       | Block Type     | Data Source                          | Priority | Acceptance Criteria                                                                      |
| -------- | -------------- | ------------------------------------ | -------- | ---------------------------------------------------------------------------------------- |
| DSN-005a | Product Grid   | Featured products / collection / tag | P0       | Grid renders products from configured source; column count and card style configurable   |
| DSN-005b | Product Card   | Single product by ID or slug         | P0       | Card renders product image, title, price, and add-to-cart button                         |
| DSN-005c | Category List  | Product categories                   | P0       | Renders category tiles with image and name; supports horizontal scroll and grid variants |
| DSN-005d | Cart Summary   | Active cart session                  | P0       | Renders cart items, quantities, subtotal; updates live on item change                    |
| DSN-005e | Checkout Form  | Cart + customer session              | P0       | Renders address, payment, and order summary steps; bound to active checkout flow         |
| DSN-005f | Search Results | Product search index                 | P0       | Renders results for query; empty state shown when no results                             |
| DSN-005g | Order History  | Authenticated customer orders        | P1       | Renders paginated order list with status badges; visible only when customer is logged in |
| DSN-005h | Wishlist       | Authenticated customer wishlist      | P1       | Renders saved products; add/remove updates list without page reload                      |
| DSN-005i | Testimonials   | Static or CMS-managed reviews        | P1       | Renders customer name, text, and optional image; configurable count                      |
| DSN-005j | Contact Form   | Form submissions → DB + email        | P1       | Submitted data stored in DB; merchant receives email notification; CAPTCHA enforced      |


---

**Block Styling Specification (DSN-008 Sub-specifications):**


| ID       | Style Category        | Properties                                                                                   | Priority | Acceptance Criteria                                                                 |
| -------- | --------------------- | -------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| DSN-008a | Spacing               | margin (top, right, bottom, left), padding (top, right, bottom, left)                        | P0       | Numeric values (px / rem / %); live preview updates on change                       |
| DSN-008b | Sizing                | width, height, min-width, max-width, min-height, max-height                                  | P0       | Accepts px, %, auto, and viewport units; constrained by parent container            |
| DSN-008c | Typography            | font-family, font-size, font-weight, line-height, letter-spacing, text-align, text-transform | P0       | Font options from platform font set; text-align respects RTL direction              |
| DSN-008d | Colors                | color (text), background-color, border-color                                                 | P0       | Color picker supports hex, RGB, and design token reference; opacity slider included |
| DSN-008e | Border                | border-width, border-style, border-radius (per corner)                                       | P0       | Per-corner radius supported; style options: solid, dashed, none                     |
| DSN-008f | Shadow                | box-shadow (offset, blur, spread, color)                                                     | P1       | Shadow preview updates live; none/preset/custom modes                               |
| DSN-008g | Display / Visibility  | display (flex, grid, block), visibility toggle per breakpoint (desktop/mobile/tablet)        | P1       | Block hidden on mobile still rendered in builder with visibility indicator          |
| DSN-008h | Custom CSS (web only) | Free-form CSS string scoped to the block or section                                          | P1       | CSS injected as scoped style; conflicts flagged; not applied to mobile renderer     |


---

**Hybrid Theme & Color Engine (DSN-010 Sub-specifications):**


| ID        | Requirement              | Priority | Acceptance Criteria                                                                      |
| --------- | ------------------------ | -------- | ---------------------------------------------------------------------------------------- |
| DSN-010-A | Curated color palettes   | P0       | Pre-set palettes by mood (Luxury, Energy, Calm); auto-maps Primary, Secondary, Accent    |
| DSN-010-B | Dynamic seed color logic | P0       | Single seed color generates full tints/shades; unified brand identity across all blocks  |
| DSN-010-C | Contrast guard algorithm | P1       | WCAG-based contrast verification; prevents saving unreadable text; suggests alternatives |
| DSN-010-D | Auto-inversion dark mode | P2       | Smart inversion when dark mode toggled; no manual configuration needed                   |


---

### 4.3 Product & Catalog Management (PRD)

#### 4.3.1 Description and Priority

Complete product lifecycle management with Arabic-first support, variants, categories, collections, inventory tracking, and storefront search. **Priority: P0 (Critical).**

#### 4.3.2 Stimulus/Response Sequences

- **Product Creation:** Merchant fills Arabic title, price, uploads images → Saves → Product appears in admin list and (if Active) on storefront.
- **Variant Management:** Merchant adds Size (S, M, L) × Color (Red, Blue) → System generates 6 variant combinations → Each has independent price/stock/SKU.
- **Inventory Alert:** Stock drops below threshold → System sends push notification to merchant → Dashboard shows red badge.
- **Customer Search:** Customer types "حذاء" → System returns matching products with thumbnails in < 300ms → Autocomplete suggestions appear after 3 characters.
- **Cross-Platform Social Posting:** Merchant saves product → "Share to Social Media" button appears on product detail → Merchant clicks → Selects Instagram, Facebook, TikTok, and/or Telegram → Can customize caption per platform → Confirms → Product (with link and images) posted atomically to all selected platforms within 60 seconds.

#### 4.3.3 Functional Requirements


| ID      | Requirement                                                                  | Priority | Acceptance Criteria                                                                                       |
| ------- | ---------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| PRD-001 | Create/edit/delete products with title (AR + EN), description, price, images | P0       | CRUD operations work; Arabic text renders correctly                                                       |
| PRD-002 | Product variants: size, color, material (up to 3 axes)                       | P0       | Create Size × Color → variant matrix generated with per-variant price/stock/SKU                           |
| PRD-003 | Product categories with nesting (up to 3 levels)                             | P0       | Clothing → Men → Shirts hierarchy works; products filter by leaf                                          |
| PRD-004 | Product image upload (up to 10 per product)                                  | P0       | Upload 10 images; thumbnails generated (150px, 300px, 600px); MIME validated                              |
| PRD-005 | Inventory tracking: stock count per variant                                  | P0       | Order placed → stock decrements; order cancelled → stock restores                                         |
| PRD-006 | Product status: Draft, Active, Archived                                      | P0       | Only Active products appear on storefront                                                                 |
| PRD-007 | Product search with Arabic support                                           | P0       | Search "حذاء" returns "حذاء رياضي"; mixed query "iPhone برو" works                                        |
| PRD-008 | Product tags for filtering                                                   | P0       | Tags displayed as filters on storefront; filtering works correctly                                        |
| PRD-009 | Compare-at price                                                             | P0       | Compare price > actual price → storefront shows strikethrough                                             |
| PRD-010 | Search empty state with suggestions                                          | P0       | No results → show "Did you mean..." + popular products; never a blank page                                |
| PRD-011 | Low stock alerts (configurable threshold)                                    | P1       | Stock ≤ threshold → notification sent to merchant                                                         |
| PRD-012 | Bulk product import via CSV/Excel                                            | P1       | Upload CSV with Arabic content → products created; errors reported per row                                |
| PRD-013 | SEO fields per product: meta title, description, URL slug                    | P1       | Set meta title → appears in storefront HTML `<head>`                                                      |
| PRD-014 | Manual collections (curated product groups)                                  | P1       | Create "Summer Sale" collection → drag products in → collection page accessible via URL                   |
| PRD-015 | Automated collections (rule-based)                                           | P1       | Create rule "tag = sale AND price < 50000" → matching products auto-added                                 |
| PRD-016 | Collection display on storefront                                             | P1       | Collections appear in navigation and as browsable pages                                                   |
| PRD-017 | Search filters (price range, category, in-stock, tags)                       | P1       | Customer filters by price 10,000–50,000 SYP + category → results narrow correctly                         |
| PRD-018 | Cost price per product variant (سعر الكلفة)                                  | P1       | Merchant enters cost price in SYP or USD; private field; used for profit calculations; stored per variant |
| PRD-019 | Oversell configuration per product                                           | P2       | Merchant toggles "Continue selling when out of stock" per product                                         |
| PRD-020 | Search autocomplete / suggestions                                            | P2       | Type 3+ characters → dropdown shows matching products with thumbnails                                     |
| PRD-021 | One-click social media posting (Instagram, Facebook, TikTok, Telegram)       | P2       | Save product → "Share to Social" button appears → merchant selects platforms → product posted atomically to all; merchant can customize caption per platform |


---

### 4.4 Order Orchestration (ORD)

#### 4.4.1 Description and Priority

End-to-end order lifecycle from cart to delivery, including checkout, payment, fulfillment, and post-order workflows. **Priority: P0 (Critical).**

#### 4.4.2 Stimulus/Response Sequences

- **Checkout:** Customer adds items to cart → Enters Syrian governorate address → Selects flat rate shipping → Selects COD → Confirms → Order created with PENDING status → Inventory decremented atomically.
- **Fulfillment:** Merchant opens order → Changes status to CONFIRMED → PROCESSING → SHIPPED (enters tracking number) → Customer receives notification at each step.
- **Concurrent Purchase:** 10 customers attempt to buy the last 5 units simultaneously → Exactly 5 orders succeed → 5 receive "out of stock" error.

#### 4.4.3 Functional Requirements


| ID      | Requirement                                                        | Priority | Acceptance Criteria                                                                                                                                                                                           |
| ------- | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ORD-001 | Shopping cart (per customer or guest session per store)            | P0       | Add 3 items as authenticated customer or guest session → cart persists across app restart/session resume → remove 1 → total updates                                                                          |
| ORD-002 | Checkout flow: address → shipping → payment → confirmation         | P0       | E2E: fill Syrian governorate address → select flat rate → select COD → confirm                                                                                                                                |
| ORD-003 | Order state machine with valid transitions only                    | P0       | PENDING → CONFIRMED allowed; PENDING → DELIVERED rejected (invalid skip)                                                                                                                                      |
| ORD-004 | Order creation with atomic inventory decrement                     | P0       | 10 concurrent threads buy last 5 units → exactly 5 orders succeed                                                                                                                                             |
| ORD-005 | Order detail view (merchant admin)                                 | P0       | Items, totals, customer info, payment status, shipping, timeline all visible                                                                                                                                  |
| ORD-006 | Order detail view (customer)                                       | P0       | Customer sees own orders; cannot see other customers' orders                                                                                                                                                  |
| ORD-007 | Order status notifications (email/push)                            | P0       | Status change → customer receives email with updated status                                                                                                                                                   |
| ORD-008 | Merchant updates order status manually                             | P0       | Confirmed → Processing → Shipped (enter tracking) → Delivered                                                                                                                                                 |
| ORD-009 | Cancel order with inventory restoration                            | P0       | Cancel → variant stock restored to pre-order count                                                                                                                                                            |
| ORD-010 | Invoice generation (PDF, bilingual AR/EN) with configurable layout | P0       | Generated PDF contains Arabic text and renders correctly; invoice layout (logo, color scheme, header/footer text, visible fields) is configurable from Store Settings; changes reflect in all future invoices |
| ORD-011 | Cash on Delivery (COD) support                                     | P0       | Select COD → order status PENDING until merchant confirms delivery                                                                                                                                            |
| ORD-012 | Discount codes: percentage, fixed, free shipping                   | P1       | Apply "10OFF" → total reduced; apply invalid/expired/non-eligible code → error message; server-side validation uses normalized `discount_codes` + `order_discount` junction (Business Rule #7) |
| ORD-013 | Refund workflow (merchant-configurable)                            | P1       | Merchant initiates refund → amount recorded → inventory adjusted → credit record created; refund feature can be disabled from Store Settings                                                                  |
| ORD-014 | Guest checkout (no account required)                               | P1       | Complete order with email/phone only; order is created without requiring an existing customer account; optional account creation/conversion remains available post-purchase                                  |
| ORD-015 | Order notes (merchant-to-customer and internal)                    | P1       | Add note → visible in order detail; internal notes hidden from customer                                                                                                                                       |
| ORD-016 | Order timeline / activity log                                      | P1       | Audit trail: who changed status, when, with timestamps                                                                                                                                                        |
| ORD-017 | Order editing (pre-fulfillment)                                    | P2       | Change items or address before shipping; customer notified of changes                                                                                                                                         |


---

### 4.5 Return & Exchange Workflow (RET)

#### 4.5.1 Description and Priority

Formal return and exchange handling to replace ad-hoc WhatsApp-based returns. **Priority: P1 (Should Ship).**

#### 4.5.2 Stimulus/Response Sequences

- **Return Request:** Customer selects delivered order → Clicks "Request Return" → Selects items and reason → Merchant receives notification → Approves → Refund initiated.

#### 4.5.3 Functional Requirements


| ID      | Requirement                                            | Priority | Acceptance Criteria                                                                              |
| ------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------ |
| RET-001 | Customer-initiated return request (from order history) | P1       | Customer selects order → "Request Return" → selects items and reason → merchant notified         |
| RET-002 | Return reason tracking (predefined + custom)           | P1       | Reasons: Defective, Wrong item, Changed mind, Doesn't fit, Other. Tracked in analytics.          |
| RET-003 | Merchant return approval/rejection workflow            | P1       | Merchant reviews request → Approves (triggers refund) or Rejects (customer notified with reason) |


---

### 4.6 Payment Integration (PAY)

#### 4.6.1 Description and Priority

Payment processing adapted for Syrian market realities where COD dominates (~85%) and integrated gateways are limited. SOOQ integrates **Paymera eGate** as its primary online payment gateway for card-based transactions on the Paymera network and partner banks. The eGate integration uses a redirect/iframe-based flow where the merchant's server initiates a payment request, the customer is redirected to a Paymera-hosted card entry page, completes OTP verification, and the result is communicated via callback/trigger URLs. The gateway also supports payment reversal (cancellation) and saved cards functionality. **Priority: P0 (Critical).**

#### 4.6.2 Stimulus/Response Sequences

- **COD:** Customer selects COD → Order created with payment_status UNPAID → Merchant delivers → Confirms payment received → Status changes to PAID.
- **Paymera eGate (Online Card Payment):** Customer selects online payment at checkout → SOOQ backend calls Paymera `POST /api/create-payment` with amount (SYP, no decimals), `callbackURL`, `triggerURL`, terminal ID, and language → Paymera returns `paymentId` + redirect URL → Customer is redirected to Paymera-hosted page → Enters card number and expiry → Receives OTP via SMS → Enters OTP (up to 3 attempts) → Transaction processed → Success/failure page shown → Paymera calls `triggerURL` → Customer clicks Finish → Redirected to `callbackURL` → SOOQ backend calls `GET /api/get-payment-status/{paymentId}` to confirm final status (Accepted/Failed/Pending/Canceled) → Order status updated accordingly; trigger/callback/poll events are persisted with idempotent processing.
- **Paymera Reversal:** Merchant initiates refund from admin panel → SOOQ backend calls Paymera `POST /api/cancel-payment` with `payment_id` → Paymera cross-checks transaction and merchant permissions → Returns success/failure → Order payment_status updated to REFUNDED.

#### 4.6.3 Functional Requirements


| ID      | Requirement                                                                       | Priority | Acceptance Criteria                                                                                                                                                  |
| ------- | --------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PAY-001 | Cash on Delivery (COD)                                                            | P0       | Customer selects COD → order created → merchant confirms on delivery                                                                                                 |
| PAY-002 | Payment status tracking per order                                                 | P0       | Each order has payment_status: UNPAID, PENDING, PAID, REFUNDED, FAILED                                                                                               |
| PAY-003 | Paymera eGate: Create Payment integration (`POST /api/create-payment`)            | P0       | Backend sends amount (SYP integer, no decimals), terminalId, callbackURL, triggerURL, lang → receives paymentId + redirect URL → customer redirected to payment page |
| PAY-004 | Paymera eGate: Payment Status polling (`GET /api/get-payment-status/{paymentId}`) | P0       | After triggerURL or callbackURL fires, backend checks status; handles P (Pending), A (Accepted), F (Failed), C (Canceled); retries while Pending                     |
| PAY-005 | Paymera eGate: Reversal / Cancel Payment (`POST /api/cancel-payment`)             | P1       | Merchant initiates reversal → backend sends payment_id + lang → Paymera returns success (ErrorCode 0) or failure; order marked REFUNDED on success                   |
| PAY-006 | Paymera eGate: Webhook/trigger URL processing with idempotency                    | P1       | triggerURL/callbackURL/status-poll events are processed idempotently; duplicate events never update order/payment state twice; event uniqueness enforced using payment_id + external event key              |
| PAY-007 | Paymera eGate: Saved Cards support                                                | P2       | Create Payment sent with savedCards=1 and appUser → returning customers see saved card dropdown on Paymera page; new cards optionally saved                          |
| PAY-008 | Paymera eGate: Terminal ID and credential management per merchant                 | P0       | Each merchant stores terminal ID plus credential profile (merchant display name, settlement account reference, settlement currency, environment mode); credentials are encrypted, verified, and never exposed to client devices; server-side API calls only (Basic Auth) |
| PAY-009 | Paymera eGate: Bilingual payment page (Arabic/English)                            | P1       | lang parameter ("ar"/"en") passed to Create Payment → Paymera page renders in selected language                                                                      |
| ~~PAY-010~~ | ~~Legacy payment gateway integration~~ — **REMOVED** (superseded by Paymera eGate consolidation) | — | — |
| PAY-011 | Payment receipt in invoice PDF                                                    | P2       | Payment details (method, Paymera RRN for online payments, status) included in generated order invoice                                                                |
| PAY-012 | Refund initiation from admin                                                      | P2       | Online payments: calls Paymera cancel-payment API and links refund to payment transaction. COD: supports manual refund path without requiring a gateway payment transaction                                 |
| PAY-014 | Paymera Merchant Portal access documentation                                      | P1       | Merchant onboarding includes instructions for accessing Paymera Merchant Portal (test: fmp-t.paymera.cc, production: fmp.paymera.cc) for transaction monitoring      |


**Paymera eGate API Reference Summary:**


| API            | Method | Endpoint                                                      | Key Parameters                                                                                              | Response                                                                       |
| -------------- | ------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Create Payment | POST   | `https://egate.paymera.cc/api/create-payment`                 | `terminalId`, `amount` (SYP integer), `callbackURL`, `triggerURL`, `lang`, `savedCards`, `appUser`, `notes` | `paymentId`, redirect `url`, `ErrorCode` (0=success, 100=fail, 1=unauthorized) |
| Payment Status | GET    | `https://egate.paymera.cc/api/get-payment-status/{paymentId}` | —                                                                                                           | `status` (P/A/F/C), `rrn`, `amount`, `terminalId`, `creationTimestamp`         |
| Cancel Payment | POST   | `https://egate.paymera.cc/api/cancel-payment`                 | `payment_id`, `lang`                                                                                        | `ErrorCode` (0=success, 100=fail, 1=unauthorized)                              |


> **Note:** All Paymera API calls require Basic Auth (username + password in header) provided by Paymera. These credentials must only be used server-side — never exposed to client devices (browser or mobile app). Test environment uses `egate-t.paymera.cc`; production uses `egate.paymera.cc` with IP whitelisting.

---

### 4.7 Mobile App Generation (APP)

#### 4.7.1 Description and Priority

The APP module produces a **Client App** — a customer-facing Flutter application per merchant, generated through the SOOQ Visual Builder.

| App            | Purpose                                                   | Build Frequency          | Branding             | Config Source        |
| -------------- | --------------------------------------------------------- | ------------------------ | -------------------- | -------------------- |
| **Client App** | Customer-facing storefront for browsing, ordering, paying | Per-merchant (on demand) | Merchant white-label | `store_config.json`  |

**Client App:** SOOQ's strongest competitive advantage is generating branded Android apps for merchants through a Visual Builder, featuring OTA (Over-The-Air) UI updates via JSON configuration. To ensure professional results, the platform features an Interactive Design Wizard that activates upon the merchant's first entry. This wizard guides the user through a structured "Engineering Path" using precise visual cues—such as animated pulses and focus highlights—to direct them through essential steps in the correct order:

- Brand Identity: Uploading the store logo.
- Color Schemes: Selecting the primary and secondary brand colors.
- Typography: Choosing professional font pairings.
- Layout Architecture: Arranging Home Screen sections (Bento grids, banners, etc.).

By following this guided workflow, the system ensures a high-fidelity output before triggering the automated build process to generate the merchant's branded Client App APK.

**Priority: P0 (Critical).**

#### 4.7.2 Stimulus/Response Sequences

- **Design Onboarding (Client App):** Merchant opens the Visual Builder for the first time → System initiates Interactive Guided Tour (animated tooltips highlight core elements) → Merchant completes mandatory design steps sequentially (e.g., logo upload, color palette selection) → Professional baseline design is established.
- **Client App Build:** Merchant clicks "Generate App" → System triggers GitHub Actions → Status: QUEUED → BUILDING → SUCCESS → Download link generated → Merchant downloads Client App APK.
- **Client App OTA Update:** Merchant changes theme color in builder → Publishes → Customer opens Client App → App fetches new `store_config.json` → UI updates without reinstall.

#### 4.7.3 Functional Requirements

**Client App Requirements**


| ID      | Requirement                                                         | Priority | Acceptance Criteria                                                                                                     |
| ------- | ------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| APP-001 | Client App Flutter shell renders UI from remote `store_config.json` | P0       | Change layout in builder → open Client App → new layout appears without rebuild                                         |
| APP-002 | Client App APK generation via GitHub Actions pipeline               | P0       | Trigger build → workflow completes < 15 min → APK installs on Android 10+                                               |
| APP-003 | Inject merchant branding: app name, icon, splash, colors            | P0       | Custom icon, splash, app name visible after install on device                                                           |
| APP-004 | OTA UI updates via `store_config.json`                              | P0       | Merchant changes theme color → customer opens Client App → color updated                                                |
| APP-005 | Download link generation for Client App APK                         | P0       | After build → shareable URL → direct APK download works                                                                 |
| APP-006 | JSON schema versioning (backward compatibility)                     | P0       | Old app version fetches new schema → graceful fallback, no crash                                                        |
| APP-007 | Interactive Builder Onboarding (Guided Tour)                        | P1       | First-time access triggers an animated guided tour directing the merchant through essential design steps before saving. |
| APP-008 | Pre-built Professional Templates                                    | P1       | Provide at least 3 UI templates based on UX best practices as a starting point for merchants.                           |
| APP-009 | Push notifications to Client App (Firebase Cloud Messaging)         | P1       | Send from admin → received on customer phone within 30 seconds                                                          |
| APP-010 | Build status tracking (QUEUED → BUILDING → SUCCESS/FAILED)          | P1       | Dashboard shows progress; failed builds show error and retry button                                                     |
| APP-011 | Offline product browsing (cache last viewed)                        | P1       | No internet → Client App shows cached products with "offline" banner                                                    |
| APP-012 | Smart Design Validation & Suggestions                               | P2       | System analyzes contrast and layout choices, preventing poor UI and suggesting optimal combinations.                    |
| APP-013 | Deep linking: open product/order from shared URL                    | P2       | Share product link via WhatsApp → tap → opens in merchant's Client App                                                  |
| APP-014 | App Store / Play Store publishing (managed service)                 | P2       | SOOQ team handles submission; merchant pays one-time fee                                                                |




---

### 4.8 Shipping & Logistics (SHP)

#### 4.8.1 Description and Priority

Shipping and logistics module with **hybrid fulfillment model** for the Syrian market (14 governorates). SOOQ supports two independent fulfillment strategies:

1. **Merchant Self-Managed:** Merchant uses their own delivery staff or third-party carriers with credentials; SOOQ does not manage money — merchant manually reports shipment status. SOOQ provides zone-based rate calculation and tracking visibility only.

2. **SOOQ-Managed Third-Party Carriers:** SOOQ maintains partnerships with Syrian and regional logistics providers that operate within/across governorates. Merchants integrate via SOOQ dashboard without managing API keys. SOOQ tracks COD, generates labels, and handles settlement reporting.

Both workflows share a unified **shipment state machine**, **zone-based rate configuration** (14 governorates), and **customer delivery visibility**. **Priority: P0 (Critical).**

#### 4.8.2 Stimulus/Response Sequences

- **Zone Configuration:** Merchant sets Damascus = 5,000 SYP, Aleppo = 8,000 SYP → Customer at checkout selects governorate → Correct rate applied.
- **Merchant-Managed Flow:** Order confirmed → Shipment created (PENDING) → Merchant selects carrier / manually updates status → Merchant reports to SOOQ (IN_TRANSIT / DELIVERED). If COD, merchant collects cash from customer; SOOQ does not track money.
- **SOOQ-Managed Third-Party Flow:** Order confirmed → Shipment created (PENDING) → Merchant selects from available SOOQ partner carriers (or carrier auto-selected based on zone) → Label generated + sent to merchant email → Carrier picks up → SOOQ receives real-time tracking updates via API → If COD, carrier collects; SOOQ tracks and reports to merchant for settlement.
- **Return Shipment:** Customer initiates return → SOOQ generates reverse shipping label → Carrier picks up from customer → SOOQ tracks return status; merchant approves refund on receipt.

#### 4.8.3 Functional Requirements

**Shipping Configuration (shared)**


| ID      | Requirement                                                           | Priority | Acceptance Criteria                                                                                                                                   |
| ------- | --------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHP-001 | Shipping fulfillment mode selection per store                         | P0       | Merchant toggles between "Merchant-Managed" or "SOOQ-Managed Carriers" in Store Settings; default is Merchant-Managed; switching affects new orders only |
| SHP-002 | Shipping zone configuration (governorates/cities with rates)          | P0       | Damascus = 5,000 SYP, Aleppo = 8,000 SYP configurable; at least 14 Syrian governorates pre-seeded; rates editable per mode                           |
| SHP-003 | Flat rate shipping option                                             | P0       | Merchant sets a single flat rate applied regardless of zone; overrides zone-based pricing when enabled; per-mode configuration                       |
| SHP-004 | Shipping method selection at checkout                                 | P0       | Customer sees available carriers/methods (zone-based, flat rate) with costs; selects one before payment; SOOQ-Managed mode shows partner names      |
| SHP-005 | Shipment record auto-creation on order confirmation                   | P0       | Order transitions to CONFIRMED → system creates Shipment entity with status PENDING, linked to order, selected shipping method, and assigned carrier |
| SHP-006 | Shipment state machine with valid transitions                         | P0       | States: PENDING → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED / FAILED / RETURNED. Invalid transitions rejected with error; return path allowed from DELIVERED |


**Merchant-Managed Fulfillment (Manual)**


| ID       | Requirement                                      | Priority | Acceptance Criteria                                                                                                                                                           |
| -------- | ------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHP-007  | Manual carrier selection and reference entry    | P0       | Merchant selects carrier from pre-configured list (or "Other") and enters tracking/reference number; shipment status remains PENDING until merchant advances it             |
| SHP-008  | Merchant manual shipment status updates          | P0       | Merchant can advance shipment (PENDING → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED) with timestamp + optional notes; status change notifies customer; no API validation    |
| SHP-009  | COD handling for merchant self-managed delivery | P0       | Merchant collects cash from customer; merchant manually records COD collected (yes/no, amount optional) in shipment record; SOOQ tracks for reporting only (no settlement) |
| SHP-010  | Merchant shipment reconciliation view           | P1       | Merchant sees list of shipped orders with status, tracking reference, and COD collection status; filterable by date range, carrier, COD status                             |


**SOOQ-Managed Third-Party Carriers**


| ID       | Requirement                                           | Priority | Acceptance Criteria                                                                                                                                                         |
| -------- | ----------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHP-011  | SOOQ carrier integration (API-based partnerships)     | P1       | SOOQ admin configures carrier API credentials once; merchants select carrier at checkout; shipments auto-sent to carrier API; credentials not exposed to merchants         |
| SHP-012  | Carrier selection at checkout (SOOQ-Managed mode)    | P0       | Customer selects from list of available SOOQ partner carriers for the destination governorate; each carrier shows delivery time estimate and cost                           |
| SHP-013  | Automatic label generation and customer notification | P0       | Order confirmed with SOOQ carrier → system generates shipping label → label URL sent to merchant email + in admin panel; merchant prints and ships                         |
| SHP-014  | Real-time carrier tracking webhook integration       | P1       | Carrier sends status updates (PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED) via webhook → SOOQ updates shipment status → customer receives push notification       |
| SHP-015  | COD collection tracking (SOOQ-Managed only)          | P1       | Carrier collects COD and reports amount collected to SOOQ via webhook; SOOQ reconciles vs expected; merchant sees COD collected status in shipment view                  |
| SHP-016  | Settlement reporting (SOOQ-Managed carriers)         | P1       | Weekly/monthly settlement report showing total collected COD per carrier; merchant can download report; SOOQ coordinates with carrier for cash-out                         |
| SHP-017  | Fallback to manual carrier if API fails              | P2       | If carrier API unavailable, merchant can manually enter tracking number and advance status; shipment transitions to manual mode; retry automatic carrier sync later (P2)  |


**Return Shipment Management**


| ID       | Requirement                                       | Priority | Acceptance Criteria                                                                                                                                                        |
| -------- | ------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHP-018  | Customer-initiated return shipment               | P1       | Customer clicks "Request Return" on delivered order → Return reason selected → SOOQ generates return shipment record linked to original order                             |
| SHP-019  | Return label generation (merchant-/SOOQ-managed) | P1       | Merchant-Managed: merchant prints label or provides instructions; SOOQ-Managed: auto-generated return label for carrier pickup from customer                             |
| SHP-020  | Return tracking and status updates                | P1       | SOOQ tracks return shipment status (PENDING_PICKUP → IN_TRANSIT → RECEIVED → PROCESSED); customer and merchant see return status in order detail page                     |
| SHP-021  | Return reconciliation and refund authorization    | P1       | Merchant confirms receipt of returned item in SOOQ dashboard → merchant approves refund → system processes refund to original payment method (COD refunded to next order) |


**Customer Delivery Visibility**


| ID       | Requirement                                       | Priority | Acceptance Criteria                                                                                                                                                         |
| -------- | ------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHP-022  | Customer shipment status view (order detail page) | P0       | Customer opens order in Client App or Web Storefront → sees current shipment state (PENDING / IN_TRANSIT / OUT_FOR_DELIVERY / DELIVERED / FAILED) with timestamp          |
| SHP-023  | Real-time carrier tracking link (SOOQ-managed)  | P1       | For SOOQ-Managed shipments, customer sees tracking link to carrier's public tracking page; updates in real-time as carrier provides data                                  |
| SHP-024  | Return status tracking for customer              | P1       | Customer sees return shipment status in order detail; can view return tracking if SOOQ-Managed return carrier provides tracking URL                                      |


---

### 4.9 Customer Management (CUS)

#### 4.9.1 Description and Priority

Customer profile and relationship management for merchants. **Priority: P0 (Critical).**

#### 4.9.2 Stimulus/Response Sequences

- **Auto Profile:** Customer places first order → System auto-creates customer profile with name, email, phone, and total spend.

#### 4.9.3 Functional Requirements


| ID      | Requirement                                              | Priority | Acceptance Criteria                                                                                 |
| ------- | -------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| CUS-001 | Customer profile auto-creation on first order            | P0       | Order placed → customer profile created with name, email, phone, total spend                        |
| CUS-002 | Customer account login (per store)                       | P0       | Customer logs in → sees order history, saved addresses, tracking                                    |
| CUS-003 | Customer list in merchant admin                          | P0       | Searchable/filterable list with order count and total spend per customer                            |
| CUS-004 | Customer address book (multiple saved addresses)         | P2       | Default + additional addresses; used at checkout dropdown                                           |
| CUS-005 | Customer export (CSV)                                    | P2       | Export customer list with all fields as CSV                                                         |
| CUS-006 | Customer notes (merchant internal)                       | P2       | Private notes per customer; visible only to merchant staff                                          |
| CUS-007 | Customer consent tracking (marketing opt-in)             | P2       | Track email/SMS consent; respect opt-out in notification sends                                      |


---

### 4.10 Notifications & Communication (NTF)

#### 4.10.1 Description and Priority

Multi-channel notification system with bilingual templates. **Priority: P0 (Critical).**

#### 4.10.2 Stimulus/Response Sequences

- **Order Notification:** Order status changes to SHIPPED → System sends bilingual email + push notification to customer within 5 minutes.

#### 4.10.3 Functional Requirements


| ID      | Requirement                                               | Priority | Acceptance Criteria                                                                        |
| ------- | --------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| NTF-001 | Email notifications (order confirmed, shipped, delivered) | P0       | Status change → customer receives bilingual email within 5 minutes                         |
| NTF-002 | Notification templates (bilingual AR/EN)                  | P0       | All notification templates support Arabic RTL                                              |
| NTF-003 | WhatsApp OTP delivery (login, verification, phone change) | P1       | OTP sent via WhatsApp message to user's phone; fallback to SMS if WhatsApp unavailable        |
| NTF-004 | Push notifications to customer app (status change)        | P1       | Order shipped → customer app shows notification                                            |
| NTF-005 | In-app notification center                                | P1       | Bell icon in admin with unread count; click shows notification list                        |
| NTF-006 | Notification preferences (customer can disable)           | P2       | Customer toggles off email → no emails sent                                                |


---

### 4.11 Analytics & Dashboard (ANL)

#### 4.11.1 Description and Priority

Merchant-facing analytics for business insights. **Priority: P0 (Critical).**

#### 4.11.2 Stimulus/Response Sequences

- **Dashboard Load:** Merchant opens dashboard → System displays today's orders, revenue, top products → Period selector switches to weekly/monthly view.

#### 4.11.3 Functional Requirements


| ID      | Requirement                                                       | Priority | Acceptance Criteria                                                                          |
| ------- | ----------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| ANL-001 | Dashboard: total orders, revenue, top products (today/week/month) | P0       | Numbers match database aggregation; period selector works                                    |
| ANL-002 | Revenue chart (daily/weekly/monthly)                              | P0       | Chart renders with correct data points; period comparison works                              |
| ANL-003 | Inventory alerts on dashboard (low stock items)                   | P0       | Red badge shows items below threshold                                                        |
| ANL-004 | Order status breakdown (pie chart)                                | P2       | Pie chart shows correct count per status                                                     |
| ANL-005 | Customer count and growth rate                                    | P2       | New customers this week vs last week with percentage                                         |
| ANL-006 | Recent orders feed (live updates)                                 | P2       | Last 10 orders update in real-time via WebSocket or polling                                  |
| ANL-007 | Analytics data export (CSV and PDF)                               | P1       | Merchant exports data as CSV; analytics summary reports exportable as formatted PDF          |
| ANL-008 | Profit analytics section in merchant dashboard                    | P2       | Dashboard includes profitability section: gross profit, margin %, best/worst-margin products |
| ANL-009 | Top 10 products by revenue                                        | P2       | Sorted by revenue; matches actual order data                                                 |
| ANL-010 | Exchange rate impact report                                       | P2       | Shows currency rate impact on profitability over time; compares margin at different periods  |


---

### 4.12 SEO Module (SEO)

#### 4.12.1 Description and Priority

Search engine optimization including structured data for enhanced search visibility. **Priority: P1 (Should Ship).**

#### 4.12.2 Stimulus/Response Sequences

- **Sitemap Update:** Merchant publishes new product → Sitemap regenerates → Available at `/sitemap.xml`.
- **Structured Data:** Product page loads → JSON-LD includes Product, BreadcrumbList, and AggregateRating schema → Validated via Google Rich Results Test.

#### 4.12.3 Functional Requirements


| ID      | Requirement                                               | Priority | Acceptance Criteria                                                               |
| ------- | --------------------------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| SEO-001 | Auto-generated XML sitemap                                | P1       | Sitemap updates when products/pages change; accessible at /sitemap.xml            |
| SEO-002 | Robots.txt configuration                                  | P1       | Default robots.txt served; merchant can customize                                 |
| SEO-003 | Canonical URL generation                                  | P1       | Product variant URLs have canonical pointing to main product                      |
| SEO-004 | Structured data (JSON-LD) for products                    | P1       | Product pages include Product schema; validated via Google Rich Results Test      |
| SEO-005 | Page-level meta tags                                      | P1       | Category pages, home page, custom pages all have editable meta tags               |
| SEO-006 | Open Graph / social sharing meta tags                     | P1       | Shared on WhatsApp/Facebook → shows product image, title, price                   |
| SEO-007 | `FAQPage` structured data on product and category pages   | P2       | Auto-generated FAQ JSON-LD validated via Google Rich Results Test                 |
| SEO-008 | `LocalBusiness` structured data per merchant store        | P2       | Every storefront includes `LocalBusiness` schema with name, address, phone, hours |
| SEO-009 | `BreadcrumbList` structured data on all pages             | P2       | Breadcrumb trail rendered in HTML and mirrored in JSON-LD                         |
| SEO-010 | `AggregateRating` structured data when review data exists | P2       | If product has review aggregates, `AggregateRating` appears in JSON-LD            |
| SEO-011 | 301 redirect management                                   | P2       | When slug changes, old URL redirects to new                                       |
| SEO-012 | Auto-generated `hreflang` tags for AR/EN bilingual pages  | P2       | Arabic page includes `hreflang="ar"` and English version includes `hreflang="en"` |


---

### 4.13 GEO Optimization (GEO)

#### 4.13.1 Description and Priority

Search engine visibility optimization with structured data for generative engine readiness. **Priority: P2 (Nice to Have).**

#### 4.13.2 Stimulus/Response Sequences

- **FAQ Generation:** Category "Electronics" created with products → System auto-generates Q&A pairs → Rendered as visible FAQ section + `FAQPage` JSON-LD schema.

#### 4.13.3 Functional Requirements


| ID      | Requirement                                                    | Priority | Acceptance Criteria                                                                                      |
| ------- | -------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| GEO-001 | Store-level `Organization` and `LocalBusiness` structured data | P2       | Every storefront includes `LocalBusiness` schema with Syrian address, coordinates, phone, business hours |
| GEO-002 | `AggregateRating` schema when review data exists               | P2       | Product with review aggregates → JSON-LD `AggregateRating` with ratingValue and reviewCount              |
| GEO-003 | `BreadcrumbList` schema on all storefront pages                | P2       | Product page shows breadcrumb in JSON-LD; renders visually and in structured data                        |
| GEO-004 | Auto-generated FAQ schema per product category                 | P2       | Category auto-generates Q&A pairs in `FAQPage` JSON-LD                                                   |
| GEO-005 | Product description template system with entity-rich structure | P2       | Merchant fills fields → system generates structured description optimized for AI extraction              |


---

### 4.14 Multi-Currency Display (CUR)

#### 4.14.1 Description and Priority

Dual-currency support and cost price tracking to address SYP volatility. **Priority: P0–P2 (Mixed).**

#### 4.14.2 Stimulus/Response Sequences

- **Exchange Rate:** Merchant sets 1 USD = 14,500 SYP → Product page shows "150,000 ل.س / $10.34 USD".
- **Rate Snapshot:** Order confirmed → System records current exchange rate → All profit calculations for this order use the snapshotted rate, not the current rate.

#### 4.14.3 Functional Requirements


| ID      | Requirement                                                                           | Priority | Acceptance Criteria                                                                             |
| ------- | ------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| CUR-001 | Merchant-configurable exchange rate (SYP/USD), manually set and updatable at any time | P1       | Merchant sets 1 USD = 14,500 SYP → all USD prices auto-calculate in SYP; rate updatable anytime |
| CUR-002 | Dual-currency product display on storefront (SYP primary, USD secondary)              | P1       | Product page shows "150,000 ل.س / $10.34 USD"; display only — checkout always in SYP            |
| CUR-003 | Exchange rate snapshot at time of order                                               | P1       | Order confirmed → current SYP/USD rate stored with order; never retroactively updated           |
| CUR-004 | Gross profit calculation per order item                                               | P1       | Gross profit = selling price − cost price converted using snapshot rate; stored per order item  |
| CUR-005 | Profit/loss summary in analytics dashboard                                            | P1       | Shows Revenue, Cost, Gross Profit, Margin % per period; color-coded green/red; filterable       |                               |
| CUR-007 | Per-product profit breakdown                                                          | P2       | Units sold, total revenue, total cost, gross profit, average margin per product in analytics    |


---

### 4.15 Tax & Legal (TAX/LEG)

#### 4.15.1 Description and Priority

Configurable tax rates and legal compliance pages. Syria does not have a formal VAT system; tax rates default to 0%. **Priority: P0–P1 (Mixed).**

#### 4.15.2 Stimulus/Response Sequences

- **Tax at Checkout:** Customer proceeds to checkout → System applies configured regional tax rate → Invoice shows subtotal, tax, and total separately.

#### 4.15.3 Functional Requirements


| ID      | Requirement                                               | Priority | Acceptance Criteria                                                                                       |
| ------- | --------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| TAX-001 | Tax included in price vs added at checkout (configurable) | P0       | Toggle: "prices include tax" → display changes accordingly                                                |
| TAX-002 | Tax display on invoices                                   | P0       | Invoice shows subtotal, tax amount, and total separately                                                  |
| TAX-003 | Configurable tax rates per region                         | P1       | Merchant sets 5% tax for Damascus; rate applied at checkout                                               |
| LEG-001 | Legal page templates (privacy, terms, refund policy)      | P1       | Auto-generated with store name filled in; editable by merchant                                            |
| LEG-002 | Cookie consent banner                                     | P2       | Banner shown on first visit; stores consent preference                                                    |
| TAX-004 | In-platform tax guidance for merchants                    | P2       | Tax settings page includes informational guidance section for Syrian merchants; not automated calculation |


---

### 4.16 Store Settings & Configuration (STR)

#### 4.16.1 Description and Priority

Post-creation store configuration and staff account management. Merchants configure their store profile, branding, business details, and manage staff member accounts with role-based permissions. Owner and Manager can create and manage staff accounts. **Priority: P0 (Critical).**

#### 4.16.2 Stimulus/Response Sequences

- **Profile Update:** Merchant changes store name in settings → Saves → Storefront header and invoices reflect new name within 1 minute.
- **Staff Creation:** Owner or Manager navigates to Staff Management in Store Settings → Enters staff phone number, name, and selects permissions → System creates staff account (tenant-scoped) → Staff member receives WhatsApp OTP on next login attempt via the Merchant Admin Panel.
- **Staff Permission Update:** Owner or Manager selects an existing staff member → Updates assigned permissions (e.g., adds `orders:write`) → Saves → Staff member's next API request reflects new permission set.
- **Staff Deactivation:** Owner or Manager deactivates a staff account → Staff member's active sessions are immediately invalidated → Staff member receives 403 on next request.
- **Logo Change:** Merchant uploads new logo → System replaces on storefront, invoices, and mobile app (via OTA config update) → Old logo purged from CDN cache.
- **Store Deletion:** Merchant requests deletion → System starts 30-day soft-delete countdown → Merchant can cancel within window → After 30 days, all data purged permanently.

#### 4.16.3 Functional Requirements


| ID      | Requirement                                                                            | Priority | Acceptance Criteria                                                                                                                                                                                                     |
| ------- | -------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STR-001 | Edit store profile (name AR/EN, description, contact email, phone)                     | P0       | Updated name reflected on storefront header and invoices within 1 minute                                                                                                                                                |
| STR-002 | Business address and location (governorate, city, street)                              | P0       | Address appears on invoices and "Contact Us" page                                                                                                                                                                       |
| STR-003 | Currency display settings (SYP symbol position, decimal places, Arabic/Latin numerals) | P0       | Toggle Arabic numerals → storefront shows `١٥٠,٠٠٠ ل.س`                                                                                                                                                                 |
| STR-004 | Store logo and favicon update                                                          | P0       | Upload new logo → replaces on storefront, invoices, and mobile app (via OTA)                                                                                                                                            |
| STR-005 | Timezone configuration                                                                 | P1       | Order timestamps display in merchant's configured timezone                                                                                                                                                              |
| STR-006 | Social media links (unlimited, merchant-defined)                                       | P1       | Merchant adds as many social/contact links as needed; each entry has label and URL; common platforms offered as presets with auto-detected icon; custom label for unlisted platforms; links appear in storefront footer |
| STR-007 | Business hours (open/closed per day)                                                   | P1       | Storefront shows "Open Now" / "Closed" badge                                                                                                                                                                            |
| STR-008 | Store deletion request with grace period                                               | P1       | Request deletion → 30-day soft-delete → data purged; cancel within window                                                                                                                                               |


**Staff Management (Owner and Manager)**


| ID      | Requirement                                         | Priority | Acceptance Criteria                                                                                                                                                                                                     |
| ------- | --------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STR-009 | Staff account creation (Owner and Manager)          | P0       | Owner or Manager enters staff name and phone number → tenant-scoped staff account created → staff can log in via phone + WhatsApp OTP on the Merchant Admin Panel; staff/customer/driver attempting creation receive 403 |
| STR-010 | Staff role and permission assignment                | P0       | Owner or Manager assigns granular permissions to staff (e.g., `products:read`, `orders:read`, `orders:write`); permissions enforced on every API request via JWT claims; default new staff has no permissions until explicitly set |
| STR-011 | Staff account listing and detail view               | P0       | Owner or Manager sees paginated list of all staff accounts for the store with name, phone, assigned permissions, status (active/inactive), and last login timestamp                                                       |
| STR-012 | Staff account deactivation and removal              | P0       | Owner or Manager deactivates a staff account → all active sessions invalidated immediately → staff receives 403 on next request; Owner or Manager can permanently delete staff account (soft-delete with 30-day purge)   |


---

### 4.17 Media & File Management (MED)

#### 4.17.1 Description and Priority

Central media library for managing all uploaded files. **Priority: P0 (Critical).**

#### 4.17.2 Stimulus/Response Sequences

- **Image Upload:** Merchant drags image into media library → System validates MIME type (JPEG/PNG/WebP, max 5MB) → Auto-generates 150px, 300px, 600px thumbnails in WebP → Uploads to S3 → Image appears in gallery.
- **Quota Enforcement:** Free-tier merchant at 490MB uploads a 15MB batch → First 10MB succeeds → Remaining rejected with "Storage full — upgrade plan" message.
- **Orphan Detection:** Merchant attempts to delete an image → System detects it's used by 2 products and 1 page component → Warns merchant → Merchant confirms force-delete → References removed.

#### 4.17.3 Functional Requirements


| ID      | Requirement                                                                         | Priority | Acceptance Criteria                                                                              |
| ------- | ----------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| MED-001 | Central media library (list, search, preview all uploaded files)                    | P0       | Merchant sees all uploaded images in one gallery; search by filename                             |
| MED-002 | Image upload with auto-optimization (resize, WebP conversion, thumbnail generation) | P0       | Upload 2MB JPEG → system generates 150px, 300px, 600px thumbnails in WebP                        |
| MED-003 | Storage quota enforcement per plan tier                                             | P0       | Free tier at 500MB → upload rejected with "Storage full — upgrade plan" message                  |
| MED-004 | Image reuse across products, pages, and builder components                          | P1       | Select from media library when adding product image or builder banner                            |
| MED-005 | Bulk upload (multiple files at once)                                                | P1       | Drag 10 images → all uploaded with progress bar; failed items flagged individually               |
| MED-006 | File deletion with orphan detection                                                 | P1       | Warn if image is used by a product or page component; force-delete removes from all references   |
| MED-007 | Alt text per image (AR/EN) for accessibility and SEO                                | P1       | Alt text editable in media library; auto-injected into storefront `<img>` tags                   |
| MED-008 | Folder organization in media library with nesting support                           | P2       | Folders with at least 2 levels of nesting; assets moveable; breadcrumb navigation; scoped search |


---

### 4.18 Web Storefront (WEB)

#### 4.18.1 Description and Priority

Customer-facing web storefront that renders merchant stores in the browser. Complements the Flutter mobile app. **Priority: P0 (Critical).**

#### 4.18.2 Stimulus/Response Sequences

- **Storefront Visit:** Customer visits `store.sooq.store` → React app fetches `store_config.json` → Renders storefront with merchant's theme, products, and layout.

#### 4.18.3 Functional Requirements


| ID      | Requirement                                                                  | Priority | Acceptance Criteria                                                                                                                                           |
| ------- | ---------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WEB-001 | Web storefront rendered from the same Design Studio editor as the mobile app | P0       | Merchant uses a single editor (Design Studio) to design their store; the same design produces both web storefront and mobile app layout; no hardcoded layouts |
| WEB-002 | Responsive design (mobile-first)                                             | P0       | Usable on 320px–1920px viewports; Lighthouse mobile score ≥ 80                                                                                                |
| WEB-003 | Product listing page with pagination and filters                             | P0       | Browse 500 products with category, price, and tag filters; paginated at 20/page                                                                               |
| WEB-004 | Product detail page (images, variants, description, add-to-cart)             | P0       | Select variant → price updates; add to cart → cart badge updates                                                                                              |
| WEB-005 | Cart page with quantity editing and order summary                            | P0       | Change quantity → total recalculates; remove item → cart updates                                                                                              |
| WEB-006 | Checkout page (address, shipping, payment, confirmation)                     | P0       | Full flow with Syrian governorate dropdown; validates required fields                                                                                         |
| WEB-007 | Customer account pages (order history, profile, addresses)                   | P0       | Logged-in customer sees past orders with status; can manage addresses                                                                                         |
| WEB-008 | SEO-friendly rendering (SSR or pre-rendered HTML)                            | P1       | Product pages indexable by Google; `view-source` contains structured data                                                                                     |
| WEB-009 | Smart app banner ("Open in App" / "Download App")                            | P1       | Web storefront shows banner linking to merchant's APK download; dismissible                                                                                   |
| WEB-010 | Custom block / section creation in Design Studio                             | P2       | Custom sections with defined layout; saved as reusable component; store-scoped                                                                                |


---

### 4.19 Platform Administration & Billing (ADM)

#### 4.19.1 Description and Priority

SOOQ internal team tools for managing merchants, subscriptions, and platform health. **Priority: P0–P2 (Mixed).**

#### 4.19.2 Stimulus/Response Sequences

- **Merchant Suspension:** Admin reviews flagged store → Clicks "Suspend" → Storefront shows "Store suspended" message → All API endpoints return 403 → Admin can reactivate later.
- **Plan Enforcement:** Free-tier merchant adds 26th product → System blocks with "Upgrade required" prompt → Merchant clicks "Upgrade" → Sees plan comparison → Confirms → Plan upgraded → Product add succeeds.
- **Platform Announcement:** Admin publishes maintenance notice → All merchants see banner in admin panel on next page load → Banner dismissible but reappears once.

#### 4.20.3 Functional Requirements


| ID      | Requirement                                                                      | Priority | Acceptance Criteria                                                           |
| ------- | -------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| ADM-001 | Merchant list with search, filter, and drill-down                                | P0       | Search by store name → view merchant details, plan, usage, order volume       |
| ADM-002 | Merchant suspension / reactivation                                               | P0       | Suspend store → storefront shows "Store suspended"; reactivate → restored     |
| ADM-003 | Subscription plan assignment and enforcement                                     | P0       | Free tier merchant at 25 products → "Add Product" blocked with upgrade prompt |
| ADM-004 | Usage tracking (products, storage, builds, staff accounts per tenant)            | P0       | Admin sees each merchant's usage vs plan limits                               |
| ADM-005 | Platform admin dashboard (total stores, revenue, active merchants, orders today) | P1       | Dashboard loads with real-time metrics; filterable by date range              |
| ADM-006 | Plan upgrade / downgrade flow (merchant-facing)                                  | P1       | Merchant clicks "Upgrade" → sees feature comparison → confirms → plan changes |
| ADM-007 | Transaction fee tracking per order                                               | P1       | Each order records platform fee; admin sees total platform revenue            |
| ADM-008 | Platform-wide announcements (banner in merchant admin)                           | P2       | Admin publishes announcement → all merchants see banner                       |


---

### 4.21 Smart Data Import (IMP)

#### 4.21.1 Description and Priority

Reduce onboarding friction by supporting product import from spreadsheets. **Priority: P2 (Nice to Have).**

#### 4.21.2 Stimulus/Response Sequences

- **Excel Import:** Merchant uploads .xlsx file → System detects columns (name, price, SKU, etc.) → Shows column mapping UI → Merchant maps columns to SOOQ fields → Confirms → System validates rows → Creates products → Displays summary: "45 of 50 products imported; 5 failed."
- **Shopify Migration:** Merchant uploads Shopify export CSV → System auto-detects Shopify format → Products created with variants, prices, and images → Summary displayed.

#### 4.21.3 Functional Requirements


| ID      | Requirement                                              | Priority | Acceptance Criteria                                                                              |
| ------- | -------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| IMP-001 | Excel / Google Sheets product import with column mapping | P2       | Upload .xlsx → system detects columns → merchant maps to SOOQ fields → products created          |
| IMP-002 | Import validation with per-row error reporting           | P2       | Row 15: "Missing price" → summary: "45 of 50 products imported successfully"                     |
| IMP-003 | Shopify CSV import compatibility                         | P2       | Upload Shopify export CSV → system recognizes format → products created with variants and prices |


---

### 4.22 AI-Assisted Merchant Tools (AI)

#### 4.22.1 Description and Priority

Lightweight AI features using external LLM APIs. No custom model training required. **Priority: P2 (Nice to Have).**

#### 4.22.2 Stimulus/Response Sequences

- **Description Generator:** Merchant enters product title "حذاء رياضي نايكي" + category "Footwear" + keywords → Clicks "Generate" → System calls LLM API → Returns Arabic and English product descriptions → Merchant edits and saves.
- **SEO Auto-Generate:** Merchant opens product with empty meta tags → Clicks "Auto-generate SEO" → System generates meta title (≤ 60 chars) and description (≤ 155 chars) from product content.
- **Smart Suggestion:** Merchant opens dashboard 7 days before Ramadan → System shows notification: "Ramadan starts in 7 days — create a promotion?" with one-click link to discount creation.
- **Social Media Import:** Merchant navigates to Products → "Import from Social" → Clicks "Connect Instagram/Facebook/TikTok" → OAuth flow → Selects existing post with product(s) → System scrapes title, description, images, price (if visible) → Pre-fills product form with extracted data → Merchant edits and saves.

#### 4.22.3 Functional Requirements


| ID     | Requirement                                          | Priority | Acceptance Criteria                                                        |
| ------ | ---------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| AI-001 | AI product description generator (Arabic + English)  | P2       | Merchant enters title + category + keywords → receives AR + EN description |
| AI-002 | AI SEO meta tag generator                            | P2       | Merchant clicks "Auto-generate SEO" → meta title and description generated |
| AI-003 | Smart promotion suggestions based on Syrian calendar | P2       | Dashboard suggests: "Ramadan starts in 7 days — create a promotion?"       |
| AI-004 | Smart category suggestion from product title         | P2       | Merchant types "حذاء رياضي نايكي" → system suggests "أحذية → رياضية"       |
| AI-005 | Smart import from social media (Instagram, Facebook, TikTok) | P2 | Merchant connects Instagram/Facebook/TikTok account → selects post → system extracts title, description, images → pre-fills product form; merchant reviews and saves |


---

### 4.22 Ad Exchange & Merchant Discovery (GAL)

#### 4.22.1 Description and Priority

The Ad Exchange module facilitates cross-merchant discovery and platform growth through a "Strong-to-New" ad rotation model. High-performing ("Strong") merchants host advertisements for "New" or upcoming merchants within their storefronts or apps. This creates a circular ecosystem where established traffic helps bootstrap new businesses. Merchants earn "Platform Credits" or reduced subscription fees for hosting ads. **Priority: P2 (Nice to Have).**

#### 4.22.2 Stimulus/Response Sequences

- **Ad Placement:** Platform Admin identifies Merchant A (New) and Merchant B (Strong) → Admin creates an Ad campaign for Merchant A → System injects Merchant A's ad block into Merchant B's storefront (based on category alignment) → Customer of Merchant B sees the ad.
- **Inter-Store Navigation:** Customer clicks Merchant A's ad on Merchant B's site → System logs the click-through → Redirects Customer to Merchant A's storefront with a `ref=merchant_b` parameter.
- **Credit Attribution:** Ad impression/click occurs → System updates hosting Merchant's analytics and attributes platform credits.

#### 4.22.3 Functional Requirements

| ID      | Requirement                                                  | Priority | Acceptance Criteria                                                                                                                                       |
| ------- | ------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GAL-001 | Cross-merchant ad injection (Strong-to-New)                  | P2       | "New" merchant ads render automatically in designated blocks of "Strong" merchant storefronts based on category affinity.                                 |
| GAL-002 | Automated merchant performance tiering (Strong vs. New)      | P2       | System classifies merchants based on order volume, tenure, and rating to determine eligibility for hosting (Strong) or promoting (New).                   |
| GAL-003 | Ad click-through tracking and attribution                    | P2       | System logs impressions and clicks; attributes source merchant for cross-store traffic.                                                                   |
| GAL-004 | Merchant "Opt-out" for hosting ads                           | P2       | Strong merchants can disable hosting ads in their settings (may affect subscription perks).                                                               |
| GAL-005 | Platform-wide merchant discovery gallery                     | P2       | A centralized page listing all active merchants categorized by industry, with "New & Noteworthy" section powered by the Ad Exchange.                     |
| GAL-006 | Ad Exchange analytics dashboard (SOOQ internal)              | P2       | Admin monitors ad rotations, CTR (Click-Through Rate), and distribution between merchant tiers.                                                           |


---

### 4.24 Requirement Count Summary


| #   | Module                            | Code    | Total Reqs | P0      | P1     | P2     | TBD   |
| --- | --------------------------------- | ------- | ---------- | ------- | ------ | ------ | ----- |
| 1   | Identity & Tenant Management      | AUTH    | 15         | 9       | 4      | 2      | 0     |
| 2   | Design Studio / Store Builder     | DSN     | 22         | 15      | 2      | 5      | 0     |
| 3   | Product & Catalog Management      | PRD     | 21         | 10      | 8      | 3      | 0     |
| 4   | Order Orchestration               | ORD     | 17         | 11      | 5      | 1      | 0     |
| 5   | Return & Exchange Workflow        | RET     | 3          | 0       | 3      | 0      | 0     |
| 6   | Payment Integration               | PAY     | 12         | 5       | 4      | 3      | 0     |
| 7   | Mobile App Generation             | APP     | 19         | 11      | 5      | 3      | 0     |
| 8   | Shipping & Logistics              | SHP     | 15         | 14      | 1      | 0      | 0     |
| 9   | Customer Management               | CUS     | 7          | 3       | 0      | 4      | 0     |
| 10  | Notifications & Communication     | NTF     | 6          | 2       | 3      | 1      | 0     |
| 11  | Analytics & Dashboard             | ANL     | 10         | 3       | 1      | 6      | 0     |
| 12  | SEO Module                        | SEO     | 12         | 0       | 6      | 6      | 0     |
| 13  | GEO Optimization                  | GEO     | 5          | 0       | 0      | 5      | 0     |
| 14  | Multi-Currency Display            | CUR     | 7          | 0       | 5      | 2      | 0     |
| 15  | Tax & Legal                       | TAX/LEG | 6          | 2       | 2      | 2      | 0     |
| 16  | Landing Pages                     | LND     | 4          | 2       | 1      | 1      | 0     |
| 17  | Store Settings & Configuration    | STR     | 12         | 8       | 4      | 0      | 0     |
| 18  | Media & File Management           | MED     | 8          | 3       | 4      | 1      | 0     |
| 19  | Web Storefront                    | WEB     | 10         | 7       | 2      | 1      | 0     |
| 20  | Platform Administration & Billing | ADM     | 8          | 4       | 3      | 1      | 0     |
| 21  | Smart Data Import                 | IMP     | 3          | 0       | 0      | 3      | 0     |
| 22  | AI-Assisted Merchant Tools        | AI      | 5          | 0       | 0      | 5      | 0     |
| 23  | Category Gallery                  | GAL     | 6          | 0       | 0      | 6      | 0     |
|     | **TOTALS**                        |         | **233**    | **109** | **63** | **61** | **0** |


> **Priority Distribution:** 46.8% P0 (Critical) · 27.0% P1 (Should Ship) · 26.2% P2 (Nice to Have). The MVP scope (P0 + P1) covers **172 requirements (73.8%)** of functional requirements in this document.

---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements


| ID           | Requirement                       | Target                         | Validation Method                                |
| ------------ | --------------------------------- | ------------------------------ | ------------------------------------------------ |
| NFR-PERF-001 | API response time (P95)           | < 500ms                        | JMeter load test                                 |
| NFR-PERF-002 | Storefront first contentful paint | < 2 seconds                    | Lighthouse audit                                 |
| NFR-PERF-003 | Mobile app startup time           | < 3 seconds                    | Mid-range Android device test                    |
| NFR-PERF-004 | Product search response           | < 300ms                        | 10,000 products load test                        |
| NFR-PERF-005 | Image loading                     | < 1 second                     | WebP via CDN                                     |
| NFR-PERF-006 | Concurrent users per store        | ≥ 100                          | JMeter 100 virtual users                         |
| NFR-PERF-007 | APK build time                    | < 15 minutes                   | GitHub Actions timing                            |
| NFR-PERF-008 | store_config.json fetch           | < 500ms                        | With local cache fallback                        |
| NFR-PERF-009 | Low-bandwidth optimization        | Storefront usable at 1 Mbps    | Lazy loading, gzip, pagination, WebP, minimal JS |
| NFR-PERF-010 | CDN for static assets             | Images + APKs served from edge | CDN configuration verified                       |


### 5.2 Safety Requirements


| ID          | Requirement                            | Description                                                                                                                                                                 |
| ----------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-SAF-001 | Payment data protection                | Never store credit card numbers; use gateway iframe/SDK; server receives tokens only                                                                                        |
| NFR-SAF-002 | Payment token logging prevention       | Never log payment tokens in plain text; mask tokens in logs: `tok_****abcd`                                                                                                 |
| NFR-SAF-003 | Webhook signature verification         | Verify HMAC from payment gateway before processing any payment callback                                                                                                     |
| NFR-SAF-004 | Idempotent payment processing          | Store Paymera `payment_id` and external event key; ignore duplicate trigger/callback events to prevent double-processing and double-charging                            |
| NFR-SAF-005 | Inventory race condition prevention    | Compare-and-swap with optimistic locking to prevent overselling                                                                                                             |
| NFR-SAF-006 | Data backup and recovery               | Database backup every 6 hours + pre-deploy; RPO < 6 hours; RTO < 1 hour                                                                                                     |
| NFR-SAF-007 | Zero data loss on payment transactions | DB transaction + WAL replication ensures 100% payment data integrity                                                                                                        |
| NFR-SAF-008 | Graceful degradation under load        | Non-critical features (analytics, AI) degrade gracefully; cart, checkout, and payments remain operational at 100% under 3× normal load                                      |
| NFR-SAF-009 | Tenant data isolation via RLS          | PostgreSQL Row-Level Security policies enforced on every table with `tenant_id`; even bypassing application WHERE clauses returns 0 cross-tenant rows                       |
| NFR-SAF-010 | APK build pipeline integrity           | GitHub Actions builds are reproducible: same commit + same config → identical APK hash; build artifacts signed before download; unsigned APKs are never served to merchants |
| NFR-SAF-011 | Media upload malware prevention        | All uploaded files scanned for embedded scripts; SVG uploads rejected; EXIF metadata stripped from images before storage                                                    |
| NFR-SAF-012 | Store config tampering prevention      | `store_config.json` served read-only from CDN; only regenerated by server-side publish action; clients cannot POST/PUT to config endpoint                                   |
| NFR-SAF-013 | Automated data integrity checks        | Nightly job validates referential integrity (orphan order items, missing variants); discrepancies logged and alerted to platform admin                                      |
| NFR-SAF-014 | Exchange rate sanity guard             | Reject merchant-entered SYP/USD rate if it deviates > 50% from last saved rate; require explicit confirmation to override                                                   |


### 5.3 Security Requirements


| ID          | Requirement                                     | Target                                             | Validation Method                                                                                                           |
| ----------- | ----------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| NFR-SEC-001 | Auth on all protected endpoints                 | 100% of endpoints return 401 without valid JWT     | Automated script: hit all protected routes without token → all return 401                                                   |
| NFR-SEC-002 | Passwords hashed (BCrypt, cost ≥ 12)            | 0 raw passwords stored in DB                       | Unit test: persist user → query DB → password column is BCrypt hash                                                         |
| NFR-SEC-003 | SQL injection prevention                        | 0 vulnerabilities detected                         | SQLMap scan on all endpoints; parameterized queries enforced by ORM                                                         |
| NFR-SEC-004 | XSS prevention                                  | 0 vulnerabilities detected                         | OWASP ZAP scan; all UGC escaped; React JSX auto-escaping verified                                                           |
| NFR-SEC-005 | CORS restricted to known origins                | ≤ 3 allowed origins (admin, storefront, mobile)    | Integration test: request from unknown origin → 403                                                                         |
| NFR-SEC-006 | Rate limiting on auth                           | ≤ 5 attempts/min per IP; lockout after 10 failures | Load test: 6th attempt within 60s → HTTP 429 returned                                                                       |
| NFR-SEC-007 | File upload validation                          | 100% of uploads MIME-checked; reject non-image     | Upload .exe with .jpg extension → rejected; only JPEG/PNG/WebP ≤ 5MB accepted                                               |
| NFR-SEC-008 | HTTPS everywhere                                | 100% of responses via TLS 1.2+                     | HTTP request → 301 to HTTPS; HSTS header max-age ≥ 31536000                                                                 |
| NFR-SEC-009 | Tenant data isolation                           | 0 cross-tenant data leaks                          | Integration test: Tenant A token queries → 0 rows from Tenant B                                                             |
| NFR-SEC-010 | Sensitive data masking in logs                  | 100% of passwords, tokens, emails masked           | Log audit: grep for known test email → 0 matches in plaintext                                                               |
| NFR-SEC-011 | Dependency vulnerability scanning               | 0 critical/high CVEs in production                 | GitHub Dependabot + weekly OWASP Dependency-Check; block merge on critical CVE                                              |
| NFR-SEC-012 | Merchant data export (GDPR-style)               | Export delivered within 24 hours of request        | Merchant requests export → ZIP with JSON/CSV generated → download link emailed                                              |
| NFR-SEC-013 | Account deletion workflow                       | Data purged within 30 days of request              | Soft-delete → 30-day grace period → automated job hard-purges all tenant data                                               |
| NFR-SEC-014 | Input sanitization on all UGC                   | 0 stored XSS/injection in UGC fields               | Submit `<script>alert(1)</script>` in product description → rendered as escaped text                                        |
| NFR-SEC-015 | Security headers (CSP, X-Frame, X-Content-Type) | 100% of responses include all 5 headers            | Integration test: every response includes CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |


### 5.4 Software Quality Attributes

**Reliability & Availability:**


| ID          | Requirement                    | Target                     |
| ----------- | ------------------------------ | -------------------------- |
| NFR-REL-001 | Platform uptime                | 99.5%                      |
| NFR-REL-002 | Database backup frequency      | Every 6 hours + pre-deploy |
| NFR-REL-003 | Recovery Time Objective (RTO)  | < 1 hour                   |
| NFR-REL-004 | Recovery Point Objective (RPO) | < 6 hours                  |
| NFR-REL-005 | Zero data loss on payments     | 100%                       |
| NFR-REL-006 | Graceful degradation           | Non-critical features      |


**Scalability:**


| ID          | Requirement            | Target                                                             | Validation Method                                                              |
| ----------- | ---------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| NFR-SCL-001 | 1,000 active stores    | ≥ 1,000 concurrent tenants with < 10% latency increase             | Load test: 1,000 tenant simulation; P95 API latency stays < 550ms              |
| NFR-SCL-002 | 100,000 total products | ≥ 100,000 rows in products table with < 500ms query time           | Seed DB with 100K products; verify search and listing queries                  |
| NFR-SCL-003 | Horizontal scaling     | Add API instance in < 5 min; zero-downtime deploy                  | Docker container spins up → joins load balancer → health check passes          |
| NFR-SCL-004 | DB connection pooling  | ≤ 20 connections per instance; pool exhaustion → queue (not crash) | HikariCP configured; stress test: 200 concurrent requests → no connection leak |
| NFR-SCL-005 | File storage decoupled | 100% of uploads via S3-compatible API                              | Swap storage provider → application works without code changes                 |


**Maintainability:**


| ID          | Requirement                         | Target                                                        |
| ----------- | ----------------------------------- | ------------------------------------------------------------- |
| NFR-MNT-001 | Layered architecture                | Controller → Service → Repository; no logic in controllers    |
| NFR-MNT-002 | API versioning                      | `/api/v1/`                                                    |
| NFR-MNT-003 | DB migrations via Flyway            | All in version control                                        |
| NFR-MNT-004 | Unit test coverage (critical paths) | ≥ 60%                                                         |
| NFR-MNT-005 | Integration tests for P0 endpoints  | All P0                                                        |
| NFR-MNT-006 | Code review before merge            | GitHub branch protection                                      |
| NFR-MNT-007 | Consistent coding style             | Checkstyle (Java), ESLint (React), analysis_options (Flutter) |
| NFR-MNT-008 | README with setup instructions      | New dev runs project in < 30 min                              |


**Operations:**


| ID          | Requirement                    | Target                                                |
| ----------- | ------------------------------ | ----------------------------------------------------- |
| NFR-OPS-001 | Health check endpoint          | `/actuator/health` shows DB, Redis, disk status       |
| NFR-OPS-002 | Centralized structured logging | JSON format; searchable by tenant_id, request_id      |
| NFR-OPS-003 | Application metrics            | Prometheus/Micrometer: request count, latency, errors |
| NFR-OPS-004 | Alerting on errors             | Email alert when error rate > threshold               |
| NFR-OPS-005 | Slow query monitoring          | Log queries > 500ms                                   |


### 5.5 Business Rules


| #   | Rule                                                                                                                                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A customer of Store A cannot access Store B's data or place orders on Store B using Store A credentials.                                                                                                    |
| 2   | `Owner` can manage billing, subscription, and staff accounts; `Manager` can manage staff accounts only (no billing or subscription access).                                                                  |
| 3   | Only users with `Owner` or `Manager` roles can access the Design Studio and generate mobile apps.                                                                                                           |
| 4   | Orders must follow the valid state machine transitions: CART → PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → COMPLETED. Invalid transitions (for example, PENDING → DELIVERED) must be rejected. |
| 5   | Inventory decrement must be atomic — concurrent purchases of the last unit must result in exactly one successful order.                                                                                     |
| 6   | Free-tier merchants are limited to 25 products, 500MB storage, and 2 APK builds per month. Exceeding limits blocks the action with an upgrade prompt.                                                       |
| 7   | Discount codes (checkout) must be validated server-side. Client-side price calculations are advisory only; final price is computed on the server.                                                           |
| 8   | All monetary amounts are stored in the database as SYP. USD display is computed at runtime using the merchant's configured exchange rate.                                                                   |
| 9   | Delivery driver management, the Driver App, and COD reconciliation tools are included in the platform subscription at no additional per-delivery cost. Merchants manage their own drivers.                  |


---

## 6. Other Requirements

### 6.1 Localization Requirements


| ID          | Requirement                          | Target                                 |
| ----------- | ------------------------------------ | -------------------------------------- |
| NFR-LOC-001 | Full RTL support                     | 100% of components                     |
| NFR-LOC-002 | Arabic font rendering                | Cairo/Tajawal fonts                    |
| NFR-LOC-003 | Bilingual UI (AR + EN) with switcher | 100% of labels                         |
| NFR-LOC-004 | SYP currency formatting              | `150,000 ل.س` or `١٥٠,٠٠٠ ل.س`         |
| NFR-LOC-005 | Date formatting                      | Gregorian with optional Hijri          |
| NFR-LOC-006 | Phone number formatting (+963)       | Validation and auto-formatting         |
| NFR-LOC-007 | Syrian address format                | Dropdown with 14 governorates + cities |


### 6.2 Accessibility Requirements


| ID          | Requirement                                     | Target                                    |
| ----------- | ----------------------------------------------- | ----------------------------------------- |
| NFR-ACC-001 | Keyboard navigation on all interactive elements | 100%; visible focus indicator             |
| NFR-ACC-002 | Color contrast ratio (WCAG 2.1 AA)              | ≥ 4.5:1 text, ≥ 3:1 large text            |
| NFR-ACC-003 | Screen reader compatibility                     | All critical flows via VoiceOver/TalkBack |
| NFR-ACC-004 | Alt text on all storefront images               | Enforced in media library                 |
| NFR-ACC-005 | Form labels and error messages                  | 100%; errors announced to screen readers  |
| NFR-ACC-006 | Touch target minimum size                       | ≥ 44x44px on mobile                       |


### 6.3 Data Portability Requirements


| ID          | Requirement                                                    | Target                                                  | Validation Method                                                        |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| NFR-DPT-001 | Full store data export (products, orders, customers, settings) | ZIP archive ≤ 500MB generated within 1 hour             | Merchant requests → background job generates ZIP → download link emailed |
| NFR-DPT-002 | Product export as CSV                                          | Download starts within 10 seconds for ≤ 10,000 products | Click "Export Products" → CSV download initiates                         |
| NFR-DPT-003 | Order export as CSV                                            | Download starts within 10 seconds for ≤ 50,000 orders   | Click "Export Orders" → CSV with date range filter                       |
| NFR-DPT-004 | Data export within 24 hours of request                         | 100% of export requests fulfilled within 24 hours       | SLA monitoring: alert if export job exceeds 24h                          |


### 6.4 Caching Strategy


| ID            | Requirement                                      | Target           |
| ------------- | ------------------------------------------------ | ---------------- |
| NFR-CACHE-001 | store_config.json cached in Redis per tenant     | TTL: 5 min       |
| NFR-CACHE-002 | Product listing cached per tenant + query params | TTL: 2 min       |
| NFR-CACHE-003 | Tenant resolution (hostname → tenant_id) cached  | TTL: 10 min      |
| NFR-CACHE-004 | Session data stored in Redis                     | TTL: matches JWT |
| NFR-CACHE-005 | CDN caching for static assets (images, CSS, JS)  | TTL: 7 days      |


### 6.5 UX States & Error Handling


| ID         | Requirement                                               | Target                                                                                       | Validation Method                                                                                                    |
| ---------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| NFR-UX-001 | Empty states with illustration and CTA for all list views | 100% of list views show contextual illustration, descriptive message, and primary CTA button | Manual QA: new store → every list view shows illustration + CTA (e.g., "Add your first product"); never a blank page |
| NFR-UX-002 | Loading skeletons on data-heavy pages                     | All pages with > 500ms expected load time show skeleton                                      | Throttle network to 3G → skeletons visible before data loads                                                         |
| NFR-UX-003 | Custom 404 page per store                                 | 100% of storefronts; branded with store logo                                                 | Visit invalid URL → see styled 404 with store branding                                                               |
| NFR-UX-004 | Global error boundary (React + Flutter)                   | 100% of uncaught errors caught; user sees "Something went wrong"                             | Throw error in component → error boundary catches; no white screen                                                   |
| NFR-UX-005 | Offline state indicator (mobile app)                      | Banner appears within 2 seconds of connectivity loss                                         | Enable airplane mode → banner "You are offline" appears                                                              |
| NFR-UX-006 | Form auto-save in admin panel                             | Auto-save every 30 seconds on product/page edit forms                                        | Edit product → wait 30s → refresh page → unsaved changes preserved                                                   |
| NFR-UX-007 | Multi-device session behavior                             | Both sessions remain valid; no forced logout                                                 | Login on phone and desktop simultaneously → both active                                                              |
| NFR-UX-008 | Success/error toast notifications                         | 100% of create/update/delete actions show toast                                              | Create product → green toast "Product created"; delete → confirm → toast                                             |


### 6.6 Inventory Audit Trail


| ID          | Requirement                       | Target                                               |
| ----------- | --------------------------------- | ---------------------------------------------------- |
| NFR-INV-001 | Inventory adjustment reason codes | SALE, RETURN, MANUAL_ADJUST, DAMAGE, RECOUNT, IMPORT |
| NFR-INV-002 | Inventory audit trail per variant | Who changed, when, by how much, and why              |


### 6.7 GEO Performance Requirements


| ID          | Requirement                                             | Target                   |
| ----------- | ------------------------------------------------------- | ------------------------ |
| NFR-GEO-004 | Structured data present on all product pages            | 100% of active products  |
| NFR-GEO-005 | SSR/pre-rendered HTML contains all GEO-relevant content | 100% of storefront pages |


---

## Appendix A: Glossary


| Term                  | Definition                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------- |
| **APK**               | Android Package Kit — the installable file format for Android applications                  |
| **Buy Button**        | An embeddable commerce widget for purchasing products from any external website             |
| **CDN**               | Content Delivery Network — globally distributed servers for caching static assets           |
| **Client App**        | Per-merchant white-label Flutter Android app for customers (browsing, ordering, paying)     |
| **CNAME**             | Canonical Name record — a DNS record mapping one domain to another                          |
| **COD**               | Cash on Delivery — payment upon order delivery                                              |
| **CRUD**              | Create, Read, Update, Delete — the four basic database operations                           |
| **Delivery Driver**   | SOOQ-managed delivery agent who uses the Driver App to fulfill shipments                    |
| **Driver App**        | Single platform-wide Flutter Android app for delivery agents (shipments, status, COD)       |
| **FCM**               | Firebase Cloud Messaging — Google's push notification service                               |
| **GEO**               | Generative Engine Optimization — optimizing for AI-powered search engines                   |
| **Gift Card**         | A stored-value digital product redeemable as payment at checkout                            |
| **HMAC**              | Hash-based Message Authentication Code — used for webhook signature verification            |
| **Hreflang**          | HTML attribute for multilingual SEO, indicating page language/region                        |
| **IPA**               | iOS App Store Package — the installable file format for iOS                                 |
| **JWT**               | JSON Web Token — compact token format for stateless authentication                          |
| **LCP**               | Largest Contentful Paint — Core Web Vital for loading performance                           |
| **LLM**               | Large Language Model — AI model for text generation                                         |
| **OTA**               | Over-The-Air — delivering updates without reinstall                                         |
| **Paymera eGate**     | Online payment gateway for card-based transactions on the Paymera network and partner banks |
| **PCI DSS**           | Payment Card Industry Data Security Standard                                                |
| **Product Feed**      | Structured data file (XML/CSV) for listing products on external platforms                   |
| **RBAC**              | Role-Based Access Control                                                                   |
| **Referral Code**     | Unique customer identifier for tracking word-of-mouth acquisitions                          |
| **RLS**               | Row-Level Security — PostgreSQL feature restricting row access per session                  |
| **RTL**               | Right-to-Left — text direction for Arabic                                                   |
| **SKU**               | Stock Keeping Unit — unique identifier per product variant                                  |
| **Slug**              | URL-friendly version of a name (e.g., "ahmed-store")                                        |
| **Speakable**         | Schema.org property for text-to-speech by voice assistants                                  |
| **SSR**               | Server-Side Rendering — generating HTML on the server                                       |
| **store_config.json** | JSON file defining only store UI/UX hierarchy (pages, sections, blocks), theme tokens, and layout settings; contains no business data; fetched by clients for OTA rendering |
| **SYP**               | Syrian Pound — the official currency of Syria                                               |
| **Tenant**            | A single merchant store on the SOOQ platform with isolated data                             |
| **TOTP**              | Time-based One-Time Password — used for 2FA                                                 |
| **TTL**               | Time to Live — cache validity duration                                                      |
| **WAL**               | Write-Ahead Logging — PostgreSQL mechanism for data durability                              |
| **WCAG**              | Web Content Accessibility Guidelines                                                        |
| **ZATCA**             | Saudi Arabia's Zakat, Tax and Customs Authority                                             |


---

## Appendix B: Analysis Models

### B.1 — Use Case Diagram (Primary Actors)

```
                            ┌──────────────────────────────────────────────────────┐
                            │                    SOOQ Platform                      │
                            │                                                      │
  ┌──────────┐              │  ┌─────────────────────────────────────────────────┐  │
  │ Merchant │──────────────│──│ Register / Login (AUTH)                         │  │
  │ (Owner)  │──────────────│──│ Create & Customize Store (DSN)                 │  │
  │          │──────────────│──│ Manage Products (PRD)                           │  │
  │          │──────────────│──│ Process Orders (ORD)                            │  │
  │          │──────────────│──│ Handle Returns (RET)                            │  │
  │          │──────────────│──│ Configure Payments (PAY)                        │  │
  │          │──────────────│──│ Generate Mobile App (APP)                       │  │
  │          │──────────────│──│ Configure Shipping (SHP)                        │  │
  │          │──────────────│──│ View Analytics (ANL)                            │  │
  │          │──────────────│──│ Manage SEO & GEO (SEO, GEO)                     │  │
  │          │──────────────│──│ Set Exchange Rate (CUR)                         │  │
  │          │──────────────│──│ Manage Store Settings (STR)                     │  │
  │          │──────────────│──│ Upload & Manage Media (MED)                     │  │
  │          │──────────────│──│ Import Products (IMP)                           │  │
  └──────────┘              │  └─────────────────────────────────────────────────┘  │
                            │                                                      │
  ┌──────────┐              │  ┌─────────────────────────────────────────────────┐  │
  │ Customer │──────────────│──│ Register / Login (AUTH)                         │  │
  │ (Shopper)│──────────────│──│ Browse Storefront (WEB)                        │  │
  │          │──────────────│──│ Search & Filter Products (PRD)                 │  │
  │          │──────────────│──│ Add to Cart & Checkout (ORD)                   │  │
  │          │──────────────│──│ Pay for Order (PAY)                             │  │
  │          │──────────────│──│ Track Order (ORD, SHP)                          │  │
  │          │──────────────│──│ Request Return (RET)                          │  │
  └──────────┘              │  └─────────────────────────────────────────────────┘  │
                            │                                                      │
  ┌──────────┐              │  ┌─────────────────────────────────────────────────┐  │
  │ Delivery │──────────────│──│ Login to Driver App (AUTH)                     │  │
  │  Driver  │──────────────│──│ View Assigned Shipments (SHP)                 │  │
  │          │──────────────│──│ Update Shipment Status (SHP)                  │  │
  │          │──────────────│──│ Record COD Collection (SHP)                   │  │
  │          │──────────────│──│ Receive Push Notifications (NTF)              │  │
  └──────────┘              │  └─────────────────────────────────────────────────┘  │
                            │                                                      │
  ┌──────────┐              │  ┌─────────────────────────────────────────────────┐  │
  │ Platform │──────────────│──│ Manage Merchants (ADM)                         │  │
  │  Admin   │──────────────│──│ Suspend / Reactivate Stores (ADM)             │  │
  │          │──────────────│──│ Monitor Platform Health (ADM)                  │  │
  │          │──────────────│──│ Manage Subscriptions & Billing (ADM)          │  │
  │          │──────────────│──│ Publish Platform Announcements (ADM)          │  │
  └──────────┘              │  └─────────────────────────────────────────────────┘  │
                            │                                                      │
  ┌──────────┐              │  ┌─────────────────────────────────────────────────┐  │
  │ External │──────────────│──│ Payment Gateway Webhook (PAY)                  │  │
  │ Systems  │──────────────│──│ SMS Gateway Delivery (NTF)                     │  │
  │          │──────────────│──│ Firebase Push Notification (NTF)               │  │
  │          │──────────────│──│ LLM API for AI Tools (AI)                      │  │
  │          │──────────────│──│ CDN Asset Delivery (MED)                       │  │
  └──────────┘              │  └─────────────────────────────────────────────────┘  │
                            └──────────────────────────────────────────────────────┘
```

### B.1.1 — Detailed Use Case Specifications

> **Note:** Each use case is derived from the stimulus/response sequences and functional requirements defined in Section 4. Use cases are grouped by actor and cross-referenced to requirement IDs. V9.8 scope: LND module removed; cart data stored on frontend (localStorage/Redux) — no server-side cart persistence.

---

#### UC-001: Merchant Registration

| Field | Description |
|-------|-------------|
| **ID** | UC-001 |
| **Actor** | Merchant (Owner) |
| **Module** | AUTH |
| **Priority** | P0 |
| **Preconditions** | Merchant has an active phone number with WhatsApp installed. |
| **Main Flow** | 1. Merchant opens SOOQ registration page. 2. Merchant enters phone number. 3. System sends 6-digit OTP via WhatsApp. 4. Merchant enters OTP code. 5. System validates OTP → account created (verified). 6. System redirects to store creation wizard (UC-002). |
| **Alternative Flows** | **A1 — WhatsApp Unavailable:** Step 3 fails → System falls back to SMS delivery → Flow continues at Step 4. **A2 — Google OAuth:** Merchant clicks "Sign in with Google" → Google OAuth consent → Account created → System prompts for phone number (required for future OTP) → Phone stored. |
| **Postconditions** | Merchant account exists in DB with role OWNER; JWT issued; redirected to store creation wizard. |
| **Related Requirements** | AUTH-001, AUTH-005 |

---

#### UC-002: Store Creation

| Field | Description |
|-------|-------------|
| **ID** | UC-002 |
| **Actor** | Merchant (Owner) |
| **Module** | AUTH |
| **Priority** | P0 |
| **Preconditions** | Merchant has completed registration (UC-001). |
| **Main Flow** | 1. System displays store creation wizard. 2. Merchant enters store name, slug, currency preference, and store category. 3. System validates slug uniqueness and URL-safety. 4. System creates tenant record with PostgreSQL RLS policy. 5. Default theme initialized. 6. Merchant redirected to admin dashboard. |
| **Alternative Flows** | **A1 — Slug Conflict:** Step 3 → slug already taken → System suggests alternatives → Merchant selects or enters new slug. |
| **Postconditions** | Tenant record created; RLS policy active; default theme applied; merchant sees admin dashboard. |
| **Related Requirements** | AUTH-006, AUTH-007 |

---

#### UC-003: Customer Registration (Per-Store)

| Field | Description |
|-------|-------------|
| **ID** | UC-003 |
| **Actor** | Customer (Shopper) |
| **Module** | AUTH |
| **Priority** | P0 |
| **Preconditions** | Customer is on a specific merchant's storefront (web or Client App). |
| **Main Flow** | 1. Customer enters phone number on Store A's registration form. 2. System sends WhatsApp OTP. 3. Customer enters OTP code. 4. System validates OTP → tenant-scoped account created for Store A only. 5. Customer redirected to storefront with authenticated session. |
| **Alternative Flows** | **A1 — WhatsApp Unavailable:** OTP sent via SMS fallback. **A2 — Already Registered:** Phone already exists for this tenant → System prompts login instead. |
| **Postconditions** | Customer account exists scoped to Store A; JWT issued with role CUSTOMER and tenant_id; customer of Store A cannot log in to Store B. |
| **Related Requirements** | AUTH-002, AUTH-003 |

---

#### UC-004: User Login (All Roles)

| Field | Description |
|-------|-------------|
| **ID** | UC-004 |
| **Actor** | Merchant / Customer / Staff / Driver |
| **Module** | AUTH |
| **Priority** | P0 |
| **Preconditions** | User has a registered account. |
| **Main Flow** | 1. User enters phone number. 2. System sends WhatsApp OTP. 3. User enters 6-digit code. 4. System validates OTP → JWT issued with role claim and tenant_id. 5. User redirected to role-appropriate dashboard. |
| **Alternative Flows** | **A1 — WhatsApp Failure:** Automatic SMS fallback. **A2 — Invalid OTP:** Error shown; user retries (max 5 attempts/min per IP). **A3 — Rate Limited:** Exceeds 5 attempts/min → HTTP 429 returned. |
| **Postconditions** | JWT issued; session active; user sees appropriate interface based on role. |
| **Related Requirements** | AUTH-003, AUTH-004, AUTH-009 |

---

#### UC-005: Driver Login

| Field | Description |
|-------|-------------|
| **ID** | UC-005 |
| **Actor** | Delivery Driver |
| **Module** | AUTH, APP |
| **Priority** | P0 |
| **Preconditions** | Merchant Owner has created a driver account (UC-030); Driver App is installed. |
| **Main Flow** | 1. Driver opens Driver App. 2. Driver enters phone number (created by merchant Owner). 3. System sends WhatsApp OTP. 4. Driver enters OTP code. 5. JWT issued (role: DRIVER, tenant-scoped). 6. Driver sees assigned shipment dashboard. |
| **Alternative Flows** | **A1 — Account Deactivated:** Driver account is inactive → 403 Forbidden. |
| **Postconditions** | Driver authenticated; sees only shipments assigned to them within the merchant's store. |
| **Related Requirements** | AUTH-003, AUTH-004, APP-016 |

---

#### UC-006: Role-Based Access Enforcement

| Field | Description |
|-------|-------------|
| **ID** | UC-006 |
| **Actor** | Any authenticated user |
| **Module** | AUTH |
| **Priority** | P0 |
| **Preconditions** | User is authenticated with a valid JWT. |
| **Main Flow** | 1. User attempts to access a protected resource. 2. System checks JWT role and permissions against endpoint requirements. 3. Access granted if permissions match. |
| **Alternative Flows** | **A1 — Insufficient Permissions:** Staff attempts billing access → 403 Forbidden. **A2 — Driver Access Violation:** Driver attempts product management → 403 Forbidden. **A3 — Cross-Tenant Access:** Tenant A token used against Tenant B data → RLS returns 0 rows. |
| **Postconditions** | Authorized requests processed; unauthorized requests rejected with 403. |
| **Related Requirements** | AUTH-004, AUTH-007 |

---

#### UC-007: Design Store (Visual Builder)

| Field | Description |
|-------|-------------|
| **ID** | UC-007 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | DSN |
| **Priority** | P0 |
| **Preconditions** | Store created; merchant authenticated with Owner or Manager role. |
| **Main Flow** | 1. Merchant opens Design Studio. 2. Merchant selects a page (Home, Product Detail, etc.). 3. Merchant drags a block (Heading, Image, Product Grid, etc.) into a section. 4. Block appears in canvas at drop position. 5. `store_config.json` updated. 6. Preview refreshes in < 500ms. 7. Merchant adjusts block styling (spacing, typography, colors). 8. Merchant saves / publishes changes. |
| **Alternative Flows** | **A1 — First-Time Access:** Interactive Guided Tour triggers → Merchant completes mandatory design steps (logo, colors, typography, layout) before free editing. **A2 — Section Reorder:** Merchant drags section to new position → All contained blocks move together. **A3 — Custom CSS (Web Only):** Merchant opens CSS editor → Enters valid CSS → Applied to web storefront only; mobile unaffected. |
| **Postconditions** | `store_config.json` persisted; preview reflects changes; web storefront and mobile app render from same config. |
| **Related Requirements** | DSN-001 through DSN-018, APP-007 |

---

#### UC-008: Select Store Template

| Field | Description |
|-------|-------------|
| **ID** | UC-008 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | DSN |
| **Priority** | P0 |
| **Preconditions** | Store created; Design Studio accessible. |
| **Main Flow** | 1. Merchant opens template library. 2. Merchant browses industry-specific templates (Restaurant, Clothing, Electronics, etc.). 3. Merchant selects a template. 4. All pages populated with pre-configured sections and blocks appropriate for that industry. 5. Merchant customizes content in place. |
| **Alternative Flows** | **A1 — Start from Scratch:** Merchant skips templates → Begins with blank pages. |
| **Postconditions** | Store pages populated with template content; merchant can customize freely. |
| **Related Requirements** | DSN-002, APP-008 |

---

#### UC-009: Customize Theme & Colors

| Field | Description |
|-------|-------------|
| **ID** | UC-009 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | DSN |
| **Priority** | P0 |
| **Preconditions** | Store created; Design Studio accessible. |
| **Main Flow** | 1. Merchant opens theme customization panel. 2. Merchant selects a curated color palette or enters a seed color. 3. System generates full tints/shades from seed color. 4. Preview updates across all pages in < 500ms. 5. Merchant adjusts global design tokens (fonts, border radius, spacing). 6. Merchant publishes theme. |
| **Alternative Flows** | **A1 — Contrast Violation (P1):** WCAG contrast check fails → System warns and suggests alternatives. **A2 — Dark Mode (P2):** Merchant toggles dark mode → Auto-inversion applied. |
| **Postconditions** | Theme tokens saved; all blocks using design tokens reflect new values on web and mobile. |
| **Related Requirements** | DSN-010, DSN-010-A through DSN-010-D |

---

#### UC-010: Manage Products

| Field | Description |
|-------|-------------|
| **ID** | UC-010 (UC-PRD-001) |
| **Actor** | Staff Member (also: Store Manager, Merchant Owner via role inheritance) |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | User-goal |
| **Relationships** | `<<include>>` UC-013 (Manage product images), `<<include>>` UC-015 (Manage product status), `<<extend>>` UC-018 (Configure SEO fields), `<<extend>>` UC-023 (Store cost price) |
| **Preconditions** | Actor has permission to manage catalog content. Product exists for edit/delete, or a new draft can be initialized. |
| **Main Flow** | 1. Actor chooses create/edit/delete → 2. System initializes draft if create → 3. Actor enters Arabic-first + English content and pricing → 4. System validates and persists core data → 5. Actor manages images → 6. System executes UC-013 (validate, thumbnails, associate) → 7. Actor sets status → 8. System executes UC-015 (store/enforce visibility) → 9. If provided, system stores SEO/cost via UC-018/UC-023 → 10. System confirms and shows updated product. |
| **Alternative Flows** | **A1 — Edit existing product:** Actor updates fields; system revalidates; images/status executed only if changed. **A2 — Delete product:** Actor confirms; system soft-deletes; product no longer returned by storefront. |
| **Exception Flows** | **E1:** Validation failure → rejects and reports → product unchanged. **E2:** Media failure → aborts image update → existing images preserved. **E3:** Concurrency conflict → requests refresh. **E4:** Permission denied → blocks action. |
| **Postconditions** | Product record created/updated with required multilingual fields. Images validated/associated. Status stored and visibility enforced. SEO/cost stored if provided. |
| **Business Rules** | Arabic-first content. Only Active products on storefront. Max 10 images. Slug unique per tenant. |
| **Related Requirements** | PRD-001, PRD-004, PRD-006, PRD-009, PRD-013, PRD-018 |

---

#### UC-011: Manage Product Variants

| Field | Description |
|-------|-------------|
| **ID** | UC-011 (UC-PRD-002) |
| **Actor** | Staff Member (also: Store Manager, Merchant Owner via role inheritance) |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | User-goal |
| **Relationships** | `<<include>>` UC-011b (Assign variant attributes) |
| **Preconditions** | Product exists and is editable. Variant axis count ≤ 3. |
| **Main Flow** | 1. Actor opens variant management → 2. System loads current config → 3. Actor defines up to 3 axes (e.g., Size, Color, Material) → 4. System validates axes → 5. Actor assigns attribute values per axis → 6. System executes UC-011b → 7. System generates Cartesian product combinations → 8. System creates/updates variants → 9. System returns variant matrix. |
| **Alternative Flows** | **A1 — Update axis attributes:** Recalculates combinations and updates affected variants. **A2 — Remove axis:** Recalculates using remaining axes. |
| **Exception Flows** | **E1:** Axis limit exceeded (>3) → reject. **E2:** Duplicate/invalid attributes → reject. **E3:** Persist failure → rollback. |
| **Postconditions** | Variant matrix created with independent price/stock/SKU per combination. |
| **Business Rules** | Max 3 variant axes per product. Combinations generated automatically. Variant changes must not break inventory/pricing/SKU integrity. |
| **Related Requirements** | PRD-002, PRD-005 |

---

#### UC-011b: Assign Variant Attributes

| Field | Description |
|-------|-------------|
| **ID** | UC-011b (UC-PRD-003) |
| **Actor** | Staff Member |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | Sub-function |
| **Relationships** | Included by UC-011 |
| **Preconditions** | Product exists. Variant axes defined. |
| **Main Flow** | 1. Actor selects axis → 2. System shows existing values → 3. Actor adds/edits/removes values (AR+EN labels, color hex for swatches) → 4. System validates format/uniqueness → 5. Repeat for other axes → 6. System persists → 7. System signals UC-011 to regenerate combinations. |
| **Exception Flows** | **E1:** Invalid value → reject. **E2:** Permission denied → deny. |
| **Postconditions** | Attribute lists persisted per axis; duplicates rejected. |
| **Related Requirements** | PRD-002 |

---

#### UC-012: Manage Categories

| Field | Description |
|-------|-------------|
| **ID** | UC-012 (UC-PRD-004) |
| **Actor** | Store Manager (also: Merchant Owner via inheritance) |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | User-goal |
| **Preconditions** | Actor has permission to manage categories. |
| **Main Flow** | 1. Actor opens category management → 2. System shows hierarchy → 3. Actor defines category names (AR+EN) and selects parent (optional) → 4. System validates depth ≤ 3 and prevents violations → 5. Actor saves → 6. System persists hierarchy → 7. System confirms and shows updated tree. |
| **Alternative Flows** | **A1 — Reparent category:** System checks depth; rejects if > 3. **A2 — Assign categories to products:** System persists multi-category associations. |
| **Exception Flows** | **E1:** Nesting level violation → reject. **E2:** Cyclic hierarchy attempt → reject. |
| **Postconditions** | Categories created/updated. Nesting depth ≤ 3. Multi-category assignment works. |
| **Business Rules** | Max depth = 3 levels. Slug unique per tenant. |
| **Related Requirements** | PRD-003 |

---

#### UC-013: Manage Product Images

| Field | Description |
|-------|-------------|
| **ID** | UC-013 (UC-PRD-005) |
| **Actor** | Staff Member |
| **Module** | PRD (cross-module: MED) |
| **Priority** | P0 |
| **Level** | Sub-function |
| **Relationships** | Included by UC-010 |
| **Preconditions** | Product exists. Upload/processing services available. |
| **Main Flow** | 1. Actor selects product → 2. System loads current images (enforces max 10) → 3. Actor uploads images → 4. System validates MIME types → 5. System generates thumbnails (150px, 300px, 600px WebP) → 6. Actor sets ordering/primary → 7. System persists → 8. System confirms. |
| **Alternative Flows** | **A1 — Replace image:** Remove old; upload new; regenerate derivatives. **A2 — Reorder only:** Persist order without uploads. |
| **Exception Flows** | **E1:** Exceeds max 10 → block. **E2:** Invalid upload → reject. **E3:** Thumbnail failure → don't associate; prior images preserved. |
| **Postconditions** | Up to 10 images stored per product. Thumbnails generated. Ordering persisted. |
| **Related Requirements** | PRD-004 |

---

#### UC-014: Track Inventory

| Field | Description |
|-------|-------------|
| **ID** | UC-014 (UC-PRD-006) |
| **Actor** | Staff Member |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | User-goal |
| **Relationships** | `<<extend>>` UC-016 (Monitor low stock) |
| **Preconditions** | Product and variant structure exist. Actor has permission. |
| **Main Flow** | 1. Actor opens variant inventory table → 2. System loads current stock → 3. Actor requests adjustment → 4. System validates and checks concurrency → 5. System applies update atomically → 6. System evaluates low-stock thresholds (UC-016) → 7. System returns updated inventory and notification status. |
| **Alternative Flows** | **A1 — View-only:** Show inventory and low-stock indicators. **A2 — Bulk adjustment:** Validate all; apply as single operation. |
| **Exception Flows** | **E1:** Concurrency conflict → request refresh. **E2:** Invalid adjustment → reject. **E3:** Overselling constraint violation → reject. |
| **Postconditions** | Inventory per variant persisted consistently. Movement audit trail recorded. |
| **Business Rules** | Inventory tracked per variant. Concurrent operations must not break consistency. Stock decrements on order; restores on cancellation. |
| **Related Requirements** | PRD-005 |

---

#### UC-015: Manage Product Status

| Field | Description |
|-------|-------------|
| **ID** | UC-015 (UC-PRD-007) |
| **Actor** | Staff Member |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | Sub-function |
| **Relationships** | Included by UC-010 |
| **Preconditions** | Product exists. Actor has permission. |
| **Main Flow** | 1. Actor selects product → 2. System shows current status → 3. Actor chooses Draft/Active/Archived → 4. System validates → 5. System persists status and updates visibility → 6. System confirms. |
| **Alternative Flows** | **A1 — Bulk status update:** Validate each; update eligible set. |
| **Exception Flows** | **E1:** Unsupported status → reject. **E2:** Permission denied → reject. |
| **Postconditions** | Status updated. Only Active products visible on storefront. |
| **Related Requirements** | PRD-006 |

---

#### UC-016: Monitor Low Stock

| Field | Description |
|-------|-------------|
| **ID** | UC-016 (UC-PRD-012) |
| **Actor** | Staff Member |
| **Module** | PRD |
| **Priority** | P1 |
| **Level** | User-goal |
| **Preconditions** | Inventory tracking exists per variant. Actor has permission. |
| **Main Flow** | 1. Actor opens low-stock settings → 2. System loads thresholds → 3. Actor sets thresholds per variant → 4. System validates → 5. System persists → 6. System confirms and indicates current low-stock matches → 7. On later inventory updates, system triggers alerts when thresholds crossed. |
| **Alternative Flows** | **A1 — Disable monitoring:** Stop alerting for scope. **A2 — Adjust thresholds:** Persist and update behavior. |
| **Exception Flows** | **E1:** Invalid threshold → reject. **E2:** Notification failure → config stored; alerts queued/retried. |
| **Postconditions** | Thresholds stored. Alerts triggered when stock ≤ threshold. |
| **Related Requirements** | PRD-011 |

---

#### UC-017: Search Products (Customer)

| Field | Description |
|-------|-------------|
| **ID** | UC-017 (UC-PRD-008) |
| **Actor** | Customer (Shopper) |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | User-goal |
| **Relationships** | `<<extend>>` UC-025 (Search autocomplete), `<<extend>>` UC-022 (Filter search results), `<<extend>>` UC-019 (Handle search empty state) |
| **Preconditions** | Customer is on storefront. Search index available with Arabic support. |
| **Main Flow** | 1. Customer enters query (Arabic/English/mixed) → 2. System normalizes query (Arabic NLP) → 3. System searches indexed Active products → 4. System displays results → 5. Customer optionally refines → 6. System extends with autocomplete/filters/empty-state as needed. |
| **Alternative Flows** | **A1 — Autocomplete:** After 3+ chars, trigger UC-025. **A2 — Filters:** Trigger UC-022. **A3 — Zero results:** Trigger UC-019. |
| **Exception Flows** | **E1:** Search backend failure → show error + retry. **E2:** Query too short → prompt for more input. |
| **Postconditions** | Matching Active products displayed. Arabic and mixed-language queries work. |
| **Related Requirements** | PRD-007, PRD-010, PRD-017, PRD-020 |

---

#### UC-018: Configure SEO Fields

| Field | Description |
|-------|-------------|
| **ID** | UC-018 (UC-PRD-014) |
| **Actor** | Staff Member |
| **Module** | PRD |
| **Priority** | P1 |
| **Level** | Sub-function |
| **Relationships** | Extended by UC-010 |
| **Preconditions** | Product exists. Actor has permission. |
| **Main Flow** | 1. Actor opens SEO screen → 2. System loads current values → 3. Actor enters meta title/description/slug → 4. System validates slug format and uniqueness per tenant → 5. System persists → 6. System confirms and exposes metadata to storefront. |
| **Exception Flows** | **E1:** Slug conflict → reject. **E2:** Permission denied → deny. |
| **Postconditions** | SEO metadata stored. Slug validated and persisted. |
| **Related Requirements** | PRD-013 |

---

#### UC-019: Handle Search Empty State

| Field | Description |
|-------|-------------|
| **ID** | UC-019 (UC-PRD-011) |
| **Actor** | Customer (Shopper) |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | Sub-function |
| **Relationships** | Extended by UC-017 when zero results |
| **Preconditions** | Search executed and returned zero results. |
| **Main Flow** | 1. System detects zero results → 2. System generates "Did you mean..." suggestions → 3. System provides popular product fallback → 4. Customer selects suggestion/fallback → 5. System runs follow-up search or navigates to browse view. |
| **Alternative Flows** | **A1 — Suggestions unavailable:** Show fallback only. **A2 — Browse by category/tags:** Navigate to browse/filter view. |
| **Postconditions** | Customer sees informative empty state. Never a blank page. |
| **Related Requirements** | PRD-010 |

---

#### UC-020: Manage Product Tags

| Field | Description |
|-------|-------------|
| **ID** | UC-020 (UC-PRD-009) |
| **Actor** | Staff Member |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | User-goal |
| **Preconditions** | Actor has permission. Products and tags exist or can be created. |
| **Main Flow** | 1. Actor opens tag management → 2. System loads tags → 3. Actor creates/edits tags and assigns to products → 4. System validates (format/duplicates) → 5. System persists tags and associations → 6. System updates indexing for tag filtering → 7. System confirms. |
| **Alternative Flows** | **A1 — Bulk tag assignment:** Validate and apply batch. |
| **Exception Flows** | **E1:** Duplicate/invalid tag → reject. **E2:** Permission denied → deny. |
| **Postconditions** | Tag definitions and product-tag associations persisted. Changes reflected in storefront filters. |
| **Related Requirements** | PRD-008 |

---

#### UC-021: Manage Compare-at Pricing

| Field | Description |
|-------|-------------|
| **ID** | UC-021 (UC-PRD-010) |
| **Actor** | Store Manager |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | User-goal |
| **Preconditions** | Product variants exist. Actor has permission. |
| **Main Flow** | 1. Actor opens compare-at pricing → 2. System loads variants → 3. Actor enters compare-at values → 4. System validates format/currency → 5. System persists → 6. System confirms. |
| **Alternative Flows** | **A1 — Clear/disable:** Storefront stops showing discount. **A2 — Bulk update:** Apply across multiple variants. |
| **Exception Flows** | **E1:** Invalid pricing → reject. **E2:** Permission denied → deny. |
| **Postconditions** | Compare-at values stored per variant. Storefront shows strikethrough when compare > actual. |
| **Related Requirements** | PRD-009 |

---

#### UC-022: Filter Search Results

| Field | Description |
|-------|-------------|
| **ID** | UC-022 (UC-PRD-018) |
| **Actor** | Customer (Shopper) |
| **Module** | PRD |
| **Priority** | P1 |
| **Level** | User-goal |
| **Relationships** | Extended by UC-017 |
| **Preconditions** | Customer has active search context. |
| **Main Flow** | 1. Customer selects filters (price range/category/in-stock/tags) → 2. System validates and applies → 3. System updates results and counts → 4. Customer adjusts/clears → 5. System recomputes. |
| **Alternative Flows** | **A1 — Multi-filter:** Apply multiple simultaneously. **A2 — Clear filters:** Reset to broader results. |
| **Exception Flows** | **E1:** Invalid filter → ignore; keep last valid state. **E2:** No matches → show empty-state. |
| **Postconditions** | Results refined by applied filters. Only Active products shown. |
| **Related Requirements** | PRD-017 |

---

#### UC-023: Store Cost Price

| Field | Description |
|-------|-------------|
| **ID** | UC-023 (UC-PRD-019) |
| **Actor** | Staff Member |
| **Module** | PRD |
| **Priority** | P1 |
| **Level** | Sub-function |
| **Relationships** | Extended by UC-010 |
| **Preconditions** | Product variants exist. Actor has permission. |
| **Main Flow** | 1. Actor opens cost price config → 2. System loads variants and current values → 3. Actor enters cost prices (SYP or USD) → 4. System validates → 5. System persists per variant → 6. System confirms. |
| **Alternative Flows** | **A1 — Bulk update:** Apply across multiple variants. |
| **Exception Flows** | **E1:** Invalid input → reject. **E2:** Permission denied → deny. |
| **Postconditions** | Cost price stored per variant. Internal only (not customer-facing). |
| **Related Requirements** | PRD-018 |

---

#### UC-024: Configure Overselling

| Field | Description |
|-------|-------------|
| **ID** | UC-024 (UC-PRD-020) |
| **Actor** | Merchant Owner |
| **Module** | PRD |
| **Priority** | P2 |
| **Level** | User-goal |
| **Preconditions** | Product exists. Actor has OWNER role. |
| **Main Flow** | 1. Actor opens overselling settings → 2. System shows current setting → 3. Actor selects allowed/disallowed → 4. System validates and persists → 5. System confirms. |
| **Exception Flows** | **E1:** Permission denied → deny. **E2:** Product not found → error. |
| **Postconditions** | Overselling flag persisted. Inventory paths respect this setting. |
| **Related Requirements** | PRD-019 |

---

#### UC-025: Search Autocomplete

| Field | Description |
|-------|-------------|
| **ID** | UC-025 (UC-PRD-021) |
| **Actor** | Customer (Shopper) |
| **Module** | PRD |
| **Priority** | P2 |
| **Level** | Sub-function |
| **Relationships** | Extended by UC-017 |
| **Preconditions** | Customer is typing. Autocomplete threshold configured. |
| **Main Flow** | 1. Customer types → 2. System checks threshold (3+ chars) → 3. System generates Arabic-first/mixed-language suggestions → 4. System displays dropdown → 5. Customer selects or continues typing → 6. If selected, triggers UC-017 with selected query. |
| **Exception Flows** | **E1:** Service failure → hide suggestions. **E2:** Threshold not met → no suggestions. |
| **Postconditions** | Suggestions displayed after threshold. Arabic + mixed queries supported. |
| **Related Requirements** | PRD-020 |

---

#### UC-026: Create Manual Collections

| Field | Description |
|-------|-------------|
| **ID** | UC-026 (UC-PRD-015) |
| **Actor** | Store Manager |
| **Module** | PRD |
| **Priority** | P1 |
| **Level** | User-goal |
| **Preconditions** | Actor has permission. Products exist. |
| **Main Flow** | 1. Actor opens collection creation → 2. Actor enters collection metadata (name AR+EN, slug, description, image) → 3. System initializes → 4. Actor selects and assigns products → 5. System validates and persists membership → 6. System confirms. |
| **Alternative Flows** | **A1 — Edit membership:** Add/remove products. **A2 — Update metadata:** Rename/edit. |
| **Exception Flows** | **E1:** Invalid product reference → reject. **E2:** Permission denied → deny. |
| **Postconditions** | Manual collection created. Ready for storefront browsing. Only Active products displayed. |
| **Related Requirements** | PRD-014 |

---

#### UC-027: Create Automated Collections

| Field | Description |
|-------|-------------|
| **ID** | UC-027 (UC-PRD-016) |
| **Actor** | Store Manager |
| **Module** | PRD |
| **Priority** | P1 |
| **Level** | User-goal |
| **Preconditions** | Actor has permission. Rule engine exists for evaluation. |
| **Main Flow** | 1. Actor opens automated collection creation → 2. System provides rule builder → 3. Actor defines conditions (e.g., "tag = sale AND price < 50000") → 4. System validates rules → 5. System stores definition → 6. System evaluates and populates membership → 7. System confirms with preview count. |
| **Alternative Flows** | **A1 — Update rules:** Re-evaluate and update membership. **A2 — Preview without activation.** |
| **Exception Flows** | **E1:** Invalid rule → reject. **E2:** Evaluation failure → definition stored; membership marked failed. |
| **Postconditions** | Automated collection created with rules. Membership populated. Only Active products displayed. |
| **Related Requirements** | PRD-015 |

---

#### UC-028: Browse Collections (Customer)

| Field | Description |
|-------|-------------|
| **ID** | UC-028 (UC-PRD-017) |
| **Actor** | Customer (Shopper) |
| **Module** | PRD |
| **Priority** | P1 |
| **Level** | User-goal |
| **Preconditions** | Collections exist. Customer on storefront. |
| **Main Flow** | 1. Customer selects collection → 2. System loads metadata → 3. System retrieves member products → 4. System filters out non-Active → 5. System renders view → 6. Customer selects product → 7. System navigates to product detail (UC-031). |
| **Exception Flows** | **E1:** Collection not found → show not-found. **E2:** Data failure → show retry. |
| **Postconditions** | Customer views collection and Active member products. |
| **Related Requirements** | PRD-016 |

---

#### UC-029: Import Products in Bulk

| Field | Description |
|-------|-------------|
| **ID** | UC-029 (UC-PRD-013) |
| **Actor** | Store Manager |
| **Module** | PRD (cross-module: IMP) |
| **Priority** | P1 |
| **Level** | User-goal |
| **Preconditions** | Actor has permission. File is CSV/Excel. |
| **Main Flow** | 1. Actor uploads file → 2. System parses columns → 3. System validates per row (bilingual, axes ≤ 3, category depth ≤ 3, variant SKU/price/stock) → 4. System generates combinations where applicable → 5. System creates/updates products for valid rows → 6. System produces import report (successes + errors) → 7. System returns summary. |
| **Alternative Flows** | **A1 — Update existing by SKU/slug.** **A2 — Dry-run/preview without committing.** |
| **Exception Flows** | **E1:** File parse failure → abort. **E2:** Too many errors → stop early. **E3:** Processing failure → abort; integrity preserved. |
| **Postconditions** | Valid rows imported. Invalid rows rejected with error details. |
| **Related Requirements** | PRD-012 |

---

#### UC-030: View Product Details (Customer)

| Field | Description |
|-------|-------------|
| **ID** | UC-030 (UC-PRD-022) |
| **Actor** | Customer (Shopper) |
| **Module** | PRD |
| **Priority** | P0 |
| **Level** | User-goal |
| **Preconditions** | Customer selects product from search/collection. Product exists. |
| **Main Flow** | 1. Customer selects product → 2. System loads product by slug → 3. System enforces visibility (non-Active not shown) → 4. System loads images/derivatives → 5. System loads pricing incl. compare-at → 6. System loads variants and availability → 7. Customer selects variant → 8. System updates price/availability for selected variant. |
| **Alternative Flows** | **A1 — No variant selected:** Show default/first available. **A2 — Status changes while viewing:** Refresh or limit display. |
| **Exception Flows** | **E1:** Product not found → show not-found. **E2:** Missing assets → show placeholders. |
| **Postconditions** | Customer sees full product detail with variants, pricing, availability. Only Active products shown. |
| **Related Requirements** | PRD-001, PRD-002, PRD-009 |

---

#### UC-031: Add to Cart & Checkout

| Field | Description |
|-------|-------------|
| **ID** | UC-013 |
| **Actor** | Customer (Shopper) |
| **Module** | ORD |
| **Priority** | P0 |
| **Preconditions** | Customer is browsing active products on storefront. Cart data stored on frontend (localStorage/Redux for web, local storage for mobile). |
| **Main Flow** | 1. Customer adds items to cart (persisted in frontend local storage). 2. Customer opens cart → reviews items, adjusts quantities. 3. Customer proceeds to checkout. 4. Customer enters Syrian governorate address. 5. Customer selects shipping method (zone-based or flat rate). 6. Customer selects payment method (COD / Paymera eGate). 7. Customer optionally applies discount code. 8. Customer confirms order. 9. System validates cart items, stock availability, and discount code server-side. 10. System creates order with PENDING status and decrements inventory atomically. 11. Customer sees order confirmation. |
| **Alternative Flows** | **A1 — Out of Stock:** Item unavailable at checkout → Error message; customer adjusts cart. **A2 — Concurrent Purchase:** 10 customers buy last 5 units simultaneously → Exactly 5 succeed; 5 receive "out of stock." **A3 — Guest Checkout (P1):** Customer completes order with email only; optional account creation post-purchase. **A4 — Discount Code Invalid:** Server-side validation fails → Error message shown. |
| **Postconditions** | Order created (PENDING); inventory decremented atomically; customer and merchant notified. |
| **Related Requirements** | ORD-001 through ORD-004, ORD-011, ORD-012, ORD-014 |

---

#### UC-032: Process Order (Merchant)

| Field | Description |
|-------|-------------|
| **ID** | UC-014 |
| **Actor** | Merchant (Owner / Manager / Staff with permission) |
| **Module** | ORD |
| **Priority** | P0 |
| **Preconditions** | Order exists with status PENDING or later. |
| **Main Flow** | 1. Merchant opens order detail view. 2. Merchant reviews items, totals, customer info, payment status, shipping info. 3. Merchant advances order status: PENDING → CONFIRMED → PROCESSING → SHIPPED (enters tracking number) → DELIVERED. 4. Customer receives notification at each status change. 5. Merchant may add internal or customer-visible notes. |
| **Alternative Flows** | **A1 — Invalid Transition:** PENDING → DELIVERED attempted → System rejects with error. **A2 — Order Edit (P2):** Merchant changes items or address before shipping → Customer notified. |
| **Postconditions** | Order status advanced; timeline entry recorded with actor, timestamp, and details; customer notified. |
| **Related Requirements** | ORD-003, ORD-005, ORD-007, ORD-008, ORD-015, ORD-016, ORD-017 |

---

#### UC-033: Cancel Order

| Field | Description |
|-------|-------------|
| **ID** | UC-015 |
| **Actor** | Merchant or Customer |
| **Module** | ORD |
| **Priority** | P0 |
| **Preconditions** | Order exists and is in a cancellable state. |
| **Main Flow** | 1. Actor initiates order cancellation. 2. System validates cancellation is allowed for current state. 3. Order status changes to CANCELLED. 4. System restores inventory (variant stock restored to pre-order count). 5. Customer notified of cancellation. |
| **Alternative Flows** | **A1 — Already Shipped:** Order is SHIPPED or later → Cancellation not allowed; customer directed to return flow (UC-016). |
| **Postconditions** | Order cancelled; inventory restored; customer notified. |
| **Related Requirements** | ORD-009 |

---

#### UC-034: Generate Invoice

| Field | Description |
|-------|-------------|
| **ID** | UC-016 |
| **Actor** | System (triggered by order creation or merchant action) |
| **Module** | ORD |
| **Priority** | P0 |
| **Preconditions** | Order exists. |
| **Main Flow** | 1. System generates bilingual PDF invoice (AR/EN). 2. Invoice contains: store logo, order items, subtotal, tax, shipping cost, discount, total. 3. Invoice layout (logo, colors, header/footer, visible fields) reflects Store Settings configuration. 4. Invoice available for download by merchant and customer. |
| **Alternative Flows** | **A1 — Payment Receipt (P2):** Payment details (method, Paymera RRN for online payments) included in invoice. |
| **Postconditions** | PDF invoice generated and accessible. |
| **Related Requirements** | ORD-010, PAY-011 |

---

#### UC-035: Request Return (Customer)

| Field | Description |
|-------|-------------|
| **ID** | UC-017 |
| **Actor** | Customer (Shopper) |
| **Module** | RET |
| **Priority** | P1 |
| **Preconditions** | Order has been delivered; refund feature enabled in Store Settings. |
| **Main Flow** | 1. Customer opens delivered order in order history. 2. Customer clicks "Request Return." 3. Customer selects items to return. 4. Customer selects reason (Defective, Wrong item, Changed mind, Doesn't fit, Other). 5. Customer submits return request. 6. Merchant receives notification. |
| **Alternative Flows** | **A1 — Custom Reason:** Customer selects "Other" and enters free-text explanation. |
| **Postconditions** | Return request created with status PENDING; merchant notified; reason tracked for analytics. |
| **Related Requirements** | RET-001, RET-002 |

---

#### UC-036: Approve / Reject Return (Merchant)

| Field | Description |
|-------|-------------|
| **ID** | UC-018 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | RET |
| **Priority** | P1 |
| **Preconditions** | Customer has submitted a return request (UC-017). |
| **Main Flow** | 1. Merchant opens return request. 2. Merchant reviews items and reason. 3. Merchant approves return. 4. System triggers refund workflow. 5. Inventory adjusted. 6. Customer notified of approval. |
| **Alternative Flows** | **A1 — Rejection:** Merchant rejects return → Customer notified with reason. |
| **Postconditions** | Return approved → refund initiated, inventory restored; or return rejected → customer informed with reason. |
| **Related Requirements** | RET-003, ORD-013 |

---

#### UC-037: Pay with Cash on Delivery (COD)

| Field | Description |
|-------|-------------|
| **ID** | UC-019 |
| **Actor** | Customer (Shopper) |
| **Module** | PAY |
| **Priority** | P0 |
| **Preconditions** | Customer is at checkout step. |
| **Main Flow** | 1. Customer selects COD as payment method. 2. Order created with payment_status UNPAID. 3. Delivery occurs (via Driver-Managed or Self-Managed flow). 4. Driver/merchant collects cash from customer. 5. Merchant confirms payment received → payment_status changes to PAID. |
| **Alternative Flows** | **A1 — COD Collection via Driver App:** Driver records COD amount in Driver App → Merchant reconciles at end of day. |
| **Postconditions** | Order payment_status = PAID; COD reconciliation record created. |
| **Related Requirements** | PAY-001, PAY-002, ORD-011, SHP-010 |

---

#### UC-038: Pay with Paymera eGate (Online Card)

| Field | Description |
|-------|-------------|
| **ID** | UC-020 |
| **Actor** | Customer (Shopper) |
| **Module** | PAY |
| **Priority** | P0 |
| **Preconditions** | Merchant has Paymera terminal ID and credentials configured; customer is at checkout. |
| **Main Flow** | 1. Customer selects online payment at checkout. 2. SOOQ backend calls Paymera `POST /api/create-payment` with amount (SYP integer), callbackURL, triggerURL, terminal ID, and language. 3. Paymera returns paymentId + redirect URL. 4. Customer redirected to Paymera-hosted page. 5. Customer enters card number and expiry. 6. Customer receives OTP via SMS → enters OTP (up to 3 attempts). 7. Transaction processed → success/failure page shown. 8. Paymera calls triggerURL. 9. Customer clicks Finish → redirected to callbackURL. 10. Backend calls `GET /api/get-payment-status/{paymentId}` to confirm final status. 11. Order payment_status updated (PAID / FAILED). |
| **Alternative Flows** | **A1 — Payment Failed:** Status = F → Order payment_status = FAILED → Customer shown error. **A2 — Payment Pending:** Status = P → Backend retries status check. **A3 — Payment Cancelled:** Status = C → Order remains UNPAID. **A4 — Saved Cards (P2):** Returning customer sees saved card dropdown on Paymera page. **A5 — Duplicate Webhook:** triggerURL called twice → Idempotency key prevents double processing. |
| **Postconditions** | Payment status confirmed; order updated accordingly; transaction recorded with Paymera RRN. |
| **Related Requirements** | PAY-003, PAY-004, PAY-006, PAY-007, PAY-008, PAY-009 |

---

#### UC-039: Initiate Refund

| Field | Description |
|-------|-------------|
| **ID** | UC-021 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | PAY |
| **Priority** | P1–P2 |
| **Preconditions** | Order has been paid (COD or Paymera). |
| **Main Flow** | 1. Merchant opens order in admin panel. 2. Merchant initiates refund. 3. **Online payments:** Backend calls Paymera `POST /api/cancel-payment` with payment_id → Paymera returns success/failure → Order marked REFUNDED on success. 4. **COD:** Merchant marks as refunded manually. 5. Inventory adjusted; credit record created. |
| **Alternative Flows** | **A1 — Paymera Reversal Fails:** ErrorCode ≠ 0 → Merchant informed; manual resolution required. |
| **Postconditions** | Order payment_status = REFUNDED; inventory adjusted; customer notified. |
| **Related Requirements** | PAY-005, PAY-012, ORD-013 |

---

#### UC-040: Generate Client App APK

| Field | Description |
|-------|-------------|
| **ID** | UC-022 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | APP |
| **Priority** | P0 |
| **Preconditions** | Store created; store design completed; merchant has available APK build quota. |
| **Main Flow** | 1. Merchant clicks "Generate App" in admin panel. 2. System triggers GitHub Actions workflow. 3. Build status tracked: QUEUED → BUILDING → SUCCESS. 4. APK generated with merchant's branding (app name, icon, splash, colors). 5. Download link generated (shareable URL). 6. Merchant downloads APK. |
| **Alternative Flows** | **A1 — Build Failed:** Status = FAILED → Error shown with retry button. **A2 — Quota Exceeded:** Free-tier limit reached → "Upgrade required" prompt. |
| **Postconditions** | Branded Client App APK available for download; build completes in < 15 minutes. |
| **Related Requirements** | APP-002, APP-003, APP-005, APP-010 |

---

#### UC-041: OTA UI Update (Client App)

| Field | Description |
|-------|-------------|
| **ID** | UC-023 |
| **Actor** | Customer (Shopper) — triggered by Merchant publishing design changes |
| **Module** | APP |
| **Priority** | P0 |
| **Preconditions** | Client App installed on customer's device; merchant has published design changes. |
| **Main Flow** | 1. Merchant changes theme/layout in Design Studio → Publishes. 2. Customer opens Client App. 3. App fetches updated `store_config.json` from server. 4. UI updates without reinstall. |
| **Alternative Flows** | **A1 — Schema Version Mismatch:** Old app version fetches new schema → Graceful fallback, no crash. **A2 — Offline:** No connectivity → App uses cached `store_config.json` with offline banner. |
| **Postconditions** | Client App renders updated UI; no APK rebuild required. |
| **Related Requirements** | APP-001, APP-004, APP-006, APP-011 |

---

#### UC-042: Build Driver App

| Field | Description |
|-------|-------------|
| **ID** | UC-024 |
| **Actor** | Platform Admin (SOOQ internal) |
| **Module** | APP |
| **Priority** | P0 |
| **Preconditions** | GitHub Actions pipeline configured for driver-mode build. |
| **Main Flow** | 1. SOOQ admin triggers Driver App build (one-time or on update). 2. GitHub Actions builds APK with SOOQ driver branding (fixed app name, icon, splash). 3. Single platform-wide APK produced. 4. Download URL generated for distribution to all delivery agents. |
| **Alternative Flows** | **A1 — OTA Update:** Platform updates `driver_config.json` → Drivers reopen app → UI reflects changes without reinstall. |
| **Postconditions** | Single Driver App APK available; shared by all delivery agents across all merchants. |
| **Related Requirements** | APP-015, APP-017, APP-019 |

---

#### UC-043: Configure Shipping Zones

| Field | Description |
|-------|-------------|
| **ID** | UC-025 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | SHP |
| **Priority** | P0 |
| **Preconditions** | Store created. |
| **Main Flow** | 1. Merchant opens shipping configuration. 2. Merchant selects fulfillment workflow (Driver-Managed or Self-Managed). 3. Merchant configures shipping zones with rates per governorate (e.g., Damascus = 5,000 SYP, Aleppo = 8,000 SYP). 4. Optionally sets flat rate to override zone-based pricing. 5. Merchant saves. |
| **Alternative Flows** | **A1 — Flat Rate Only:** Merchant enables single flat rate → Zone-based rates ignored. |
| **Postconditions** | Shipping zones and rates configured; correct rate applied at customer checkout. |
| **Related Requirements** | SHP-001, SHP-002, SHP-003, SHP-004 |

---

#### UC-044: Driver-Managed Delivery

| Field | Description |
|-------|-------------|
| **ID** | UC-026 |
| **Actor** | Merchant (Owner / Manager), Delivery Driver |
| **Module** | SHP |
| **Priority** | P0 |
| **Preconditions** | Store uses Driver-Managed workflow; driver accounts created; Driver App installed. |
| **Main Flow** | 1. Order confirmed → Shipment auto-created (PENDING). 2. Merchant assigns shipment to a driver. 3. Driver receives push notification in Driver App. 4. Driver picks up package → Status: PICKED_UP. 5. Driver in transit → Status: IN_TRANSIT. 6. Driver out for delivery → Status: OUT_FOR_DELIVERY. 7. Driver delivers to customer → Status: DELIVERED. 8. If COD: Driver enters collected amount in Driver App. 9. Merchant reconciles COD collections at end of day. |
| **Alternative Flows** | **A1 — Delivery Failed:** Driver marks FAILED → Merchant reassigns or resolves. **A2 — COD Discrepancy:** Collected ≠ expected → Flagged in reconciliation view. |
| **Postconditions** | Shipment delivered; status history recorded; COD reconciled (if applicable). |
| **Related Requirements** | SHP-005 through SHP-010 |

---

#### UC-045: Self-Managed Delivery

| Field | Description |
|-------|-------------|
| **ID** | UC-027 |
| **Actor** | Merchant (Owner / Manager / Staff) |
| **Module** | SHP |
| **Priority** | P0 |
| **Preconditions** | Store uses Self-Managed workflow. |
| **Main Flow** | 1. Order confirmed → Shipment auto-created (PENDING). 2. Merchant prepares package and arranges own delivery. 3. Merchant marks as shipped (IN_TRANSIT) with optional tracking number. 4. Merchant updates status as delivery progresses. 5. Merchant confirms delivery (DELIVERED). 6. Customer notified; COD recorded if applicable. |
| **Alternative Flows** | None. |
| **Postconditions** | Shipment delivered; status history recorded with timestamps. |
| **Related Requirements** | SHP-005, SHP-006, SHP-011, SHP-012, SHP-013 |

---

#### UC-046: Track Shipment (Customer)

| Field | Description |
|-------|-------------|
| **ID** | UC-028 |
| **Actor** | Customer (Shopper) |
| **Module** | SHP |
| **Priority** | P0 |
| **Preconditions** | Customer has placed an order; shipment record exists. |
| **Main Flow** | 1. Customer opens order in Client App or Web Storefront. 2. Customer sees current shipment state (PENDING / PICKED_UP / IN_TRANSIT / OUT_FOR_DELIVERY / DELIVERED) with timestamp of last update. |
| **Alternative Flows** | None. |
| **Postconditions** | Customer informed of delivery progress. |
| **Related Requirements** | SHP-014, ORD-006 |

---

#### UC-047: Manage Customers

| Field | Description |
|-------|-------------|
| **ID** | UC-029 |
| **Actor** | Merchant (Owner / Manager / Staff with permission) |
| **Module** | CUS |
| **Priority** | P0 |
| **Preconditions** | Store has received orders or customer registrations. |
| **Main Flow** | 1. Customer places first order → System auto-creates customer profile (name, email, phone, total spend). 2. Merchant opens customer list in admin panel. 3. Merchant searches/filters by name, order count, total spend. 4. Merchant views customer detail with order history. |
| **Alternative Flows** | **A1 — Customer Login:** Customer logs in → Sees order history, saved addresses, tracking. **A2 — Export (P2):** Merchant exports customer list as CSV. |
| **Postconditions** | Customer profiles maintained; merchant can view and manage customer data. |
| **Related Requirements** | CUS-001, CUS-002, CUS-003, CUS-005 |

---

#### UC-048: Manage Staff Accounts

| Field | Description |
|-------|-------------|
| **ID** | UC-030 |
| **Actor** | Merchant (Owner or Manager) |
| **Module** | STR |
| **Priority** | P0 |
| **Preconditions** | Merchant authenticated as Owner or Manager. |
| **Main Flow** | 1. Owner navigates to Staff Management in Store Settings. 2. Owner enters staff phone number, name, and selects permissions (e.g., `products:read`, `orders:write`). 3. System creates tenant-scoped staff account. 4. Staff member logs in via phone + WhatsApp OTP on Merchant Admin Panel. |
| **Alternative Flows** | **A1 — Permission Update:** Owner updates staff permissions → Next API request reflects new permission set. **A2 — Deactivation:** Owner deactivates staff → All active sessions invalidated immediately → Staff receives 403. **A3 — Deletion:** Owner permanently deletes staff account (soft-delete with 30-day purge). |
| **Postconditions** | Staff account created/updated/deactivated; permissions enforced via JWT claims. |
| **Related Requirements** | STR-009, STR-010, STR-011, STR-012 |

---

#### UC-049: Manage Store Settings

| Field | Description |
|-------|-------------|
| **ID** | UC-031 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | STR |
| **Priority** | P0 |
| **Preconditions** | Store created. |
| **Main Flow** | 1. Merchant opens Store Settings. 2. Merchant updates store profile (name AR/EN, description, contact info). 3. Merchant uploads/updates store logo and favicon. 4. Merchant configures currency display settings, business address, social links, business hours. 5. Changes reflected on storefront, invoices, and mobile app (via OTA) within 1 minute. |
| **Alternative Flows** | **A1 — Store Deletion:** Merchant requests deletion → 30-day soft-delete countdown → Merchant can cancel within window → After 30 days, all data purged permanently. |
| **Postconditions** | Store settings updated across all surfaces (storefront, invoices, mobile app). |
| **Related Requirements** | STR-001 through STR-008 |

---

#### UC-050: Send Order Notification

| Field | Description |
|-------|-------------|
| **ID** | UC-032 |
| **Actor** | System (triggered by order status change) |
| **Module** | NTF |
| **Priority** | P0 |
| **Preconditions** | Order status has changed; customer contact info available. |
| **Main Flow** | 1. Order status changes (e.g., CONFIRMED, SHIPPED, DELIVERED). 2. System selects bilingual notification template (AR/EN). 3. System sends email to customer within 5 minutes. 4. System sends push notification to Client App (if installed). |
| **Alternative Flows** | **A1 — Push to Driver:** Shipment assigned → Push notification sent to driver via FCM within 30 seconds. **A2 — Customer Opt-Out (P2):** Customer has disabled email → No email sent. |
| **Postconditions** | Customer/driver notified via configured channels. |
| **Related Requirements** | NTF-001 through NTF-006, APP-009, APP-018 |

---

#### UC-051: View Analytics Dashboard

| Field | Description |
|-------|-------------|
| **ID** | UC-033 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | ANL |
| **Priority** | P0 |
| **Preconditions** | Store has order/product data. |
| **Main Flow** | 1. Merchant opens dashboard. 2. System displays today's orders, revenue, and top products. 3. Merchant switches period (daily/weekly/monthly). 4. Revenue chart updates with correct data points. 5. Low stock items displayed with red badge. |
| **Alternative Flows** | **A1 — Export (P1):** Merchant exports analytics as CSV or PDF. **A2 — Profit View (P2):** Dashboard shows gross profit, margin %, best/worst-margin products. |
| **Postconditions** | Merchant sees accurate business metrics matching database aggregations. |
| **Related Requirements** | ANL-001 through ANL-010 |

---

#### UC-052: Manage SEO Settings

| Field | Description |
|-------|-------------|
| **ID** | UC-034 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | SEO |
| **Priority** | P1 |
| **Preconditions** | Store has products/pages. |
| **Main Flow** | 1. Merchant edits page-level meta tags (title, description). 2. System auto-generates XML sitemap on product/page changes. 3. System adds canonical URLs to variant pages. 4. System generates JSON-LD structured data for products. 5. System adds Open Graph meta tags for social sharing. |
| **Alternative Flows** | **A1 — Robots.txt:** Merchant customizes robots.txt. **A2 — 301 Redirect (P2):** Slug changes → Old URL auto-redirects to new. |
| **Postconditions** | SEO optimized: sitemap at /sitemap.xml, structured data validated, meta tags applied. |
| **Related Requirements** | SEO-001 through SEO-012 |

---

#### UC-053: Configure Exchange Rate

| Field | Description |
|-------|-------------|
| **ID** | UC-035 |
| **Actor** | Merchant (Owner) |
| **Module** | CUR |
| **Priority** | P1 |
| **Preconditions** | Store created. |
| **Main Flow** | 1. Merchant opens currency settings. 2. Merchant sets SYP/USD exchange rate (e.g., 1 USD = 14,500 SYP). 3. Storefront shows dual-currency display (e.g., "150,000 ل.س / $10.34 USD"). 4. On order confirmation, system snapshots current exchange rate with the order. |
| **Alternative Flows** | **A1 — Sanity Guard:** Rate deviates > 50% from last saved → System requires explicit confirmation. **A2 — Staleness Alert (P2):** Product price not updated in 30+ days → Dashboard warning. |
| **Postconditions** | Exchange rate saved; dual-currency display active; order-level rate snapshots preserved. |
| **Related Requirements** | CUR-001 through CUR-007 |

---

#### UC-054: Configure Tax Settings

| Field | Description |
|-------|-------------|
| **ID** | UC-036 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | TAX/LEG |
| **Priority** | P0 |
| **Preconditions** | Store created. |
| **Main Flow** | 1. Merchant opens tax configuration. 2. Merchant toggles "prices include tax" or "tax added at checkout." 3. Merchant sets tax rates per region (default 0% for Syria). 4. At checkout, system applies configured rate. 5. Invoice displays subtotal, tax amount, and total separately. |
| **Alternative Flows** | **A1 — Legal Pages (P1):** Merchant generates legal page templates (privacy, terms, refund) with store name auto-filled. |
| **Postconditions** | Tax rates applied at checkout; invoices display tax breakdown. |
| **Related Requirements** | TAX-001 through TAX-004, LEG-001, LEG-002 |

---

#### UC-055: Upload & Manage Media

| Field | Description |
|-------|-------------|
| **ID** | UC-037 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | MED |
| **Priority** | P0 |
| **Preconditions** | Store created; storage quota not exceeded. |
| **Main Flow** | 1. Merchant opens media library. 2. Merchant drags images into upload area. 3. System validates MIME type (JPEG/PNG/WebP, max 5MB). 4. System auto-generates thumbnails (150px, 300px, 600px) in WebP. 5. Images uploaded to S3 and appear in gallery. 6. Merchant can search, preview, and reuse images across products and builder components. |
| **Alternative Flows** | **A1 — Quota Exceeded:** Free-tier at 500MB → Upload rejected with "Storage full — upgrade plan." **A2 — Orphan Detection (P1):** Delete attempt on image used by 2 products → Warning shown → Merchant confirms force-delete → References removed. **A3 — Bulk Upload (P1):** Drag 10 images → All uploaded with progress bar; failures flagged individually. |
| **Postconditions** | Images stored on S3/CDN; thumbnails generated; available in media library for reuse. |
| **Related Requirements** | MED-001 through MED-008 |

---

#### UC-056: Browse Web Storefront

| Field | Description |
|-------|-------------|
| **ID** | UC-038 |
| **Actor** | Customer (Shopper) |
| **Module** | WEB |
| **Priority** | P0 |
| **Preconditions** | Merchant store is published and active. |
| **Main Flow** | 1. Customer visits `store.sooq.store`. 2. React app fetches `store_config.json`. 3. Storefront renders with merchant's theme, products, and layout. 4. Customer browses product listing with pagination and filters. 5. Customer views product detail (images, variants, description). 6. Customer adds to cart, proceeds through checkout. 7. Customer accesses account pages (order history, profile, addresses). |
| **Alternative Flows** | **A1 — Smart App Banner (P1):** Storefront shows "Open in App" / "Download App" banner linking to merchant's APK. |
| **Postconditions** | Customer can browse, search, and purchase products via web storefront. |
| **Related Requirements** | WEB-001 through WEB-010 |

---

#### UC-057: Manage Merchants (Platform Admin)

| Field | Description |
|-------|-------------|
| **ID** | UC-039 |
| **Actor** | Platform Admin (SOOQ internal) |
| **Module** | ADM |
| **Priority** | P0 |
| **Preconditions** | Admin authenticated with cross-tenant ADMIN role. |
| **Main Flow** | 1. Admin opens merchant list with search and filter. 2. Admin drills down into merchant details (plan, usage, order volume). 3. Admin manages subscription plan assignments. 4. Admin tracks usage per tenant (products, storage, builds, staff accounts). |
| **Alternative Flows** | **A1 — Suspension:** Admin suspends flagged store → Storefront shows "Store suspended" → All API endpoints return 403 → Admin can reactivate later. **A2 — Plan Enforcement:** Free-tier merchant adds 26th product → Blocked with "Upgrade required" prompt. **A3 — Announcement (P2):** Admin publishes maintenance notice → All merchants see banner. |
| **Postconditions** | Merchant managed; plan limits enforced; platform health monitored. |
| **Related Requirements** | ADM-001 through ADM-008 |

---

#### UC-058: Import Products from Spreadsheet

| Field | Description |
|-------|-------------|
| **ID** | UC-040 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | IMP |
| **Priority** | P2 |
| **Preconditions** | Merchant has product data in Excel/CSV format. |
| **Main Flow** | 1. Merchant uploads .xlsx or .csv file. 2. System detects columns (name, price, SKU, etc.). 3. System shows column mapping UI. 4. Merchant maps columns to SOOQ fields. 5. Merchant confirms. 6. System validates rows and creates products. 7. Summary displayed: "45 of 50 products imported; 5 failed." |
| **Alternative Flows** | **A1 — Shopify Migration:** Merchant uploads Shopify export CSV → System auto-detects format → Products created with variants, prices, and images. **A2 — Validation Error:** Per-row errors reported (e.g., "Row 15: Missing price"). |
| **Postconditions** | Products created from spreadsheet data; errors reported per row. |
| **Related Requirements** | IMP-001, IMP-002, IMP-003 |

---

#### UC-059: Generate AI Product Description

| Field | Description |
|-------|-------------|
| **ID** | UC-041 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | AI |
| **Priority** | P2 |
| **Preconditions** | External LLM API configured; merchant on product edit page. |
| **Main Flow** | 1. Merchant enters product title (e.g., "حذاء رياضي نايكي") + category + keywords. 2. Merchant clicks "Generate." 3. System calls LLM API. 4. System returns Arabic and English product descriptions. 5. Merchant edits and saves. |
| **Alternative Flows** | **A1 — SEO Auto-Generate:** Merchant clicks "Auto-generate SEO" → Meta title (≤ 60 chars) and description (≤ 155 chars) generated. **A2 — Smart Suggestion:** Dashboard shows seasonal prompt (e.g., "Ramadan starts in 7 days — create a promotion?"). **A3 — Category Suggestion:** Merchant types title → System suggests appropriate category. |
| **Postconditions** | AI-generated content available for merchant review and editing. |
| **Related Requirements** | AI-001 through AI-004 |

---

#### UC-060: Browse Category Gallery

| Field | Description |
|-------|-------------|
| **ID** | UC-042 |
| **Actor** | Customer (Shopper) |
| **Module** | GAL |
| **Priority** | P2 |
| **Preconditions** | Gallery has participating merchants. |
| **Main Flow** | 1. Customer navigates to SOOQ category gallery. 2. Customer selects a category (e.g., "ملابس"). 3. Customer sees grid of participating merchants (logo, name, tagline, products). 4. Customer clicks merchant card → Views products. 5. Customer adds to cart → Seamless checkout. |
| **Alternative Flows** | **A1 — Cross-Links:** Gallery shows "Visit Store" and "Download App" links to merchant's own storefront. |
| **Postconditions** | Customer discovers merchants by category; gallery-sourced orders tracked for reduced commission. |
| **Related Requirements** | GAL-001 through GAL-006 |

---

#### UC-061: Manage Delivery Drivers

| Field | Description |
|-------|-------------|
| **ID** | UC-043 |
| **Actor** | Merchant (Owner / Manager) |
| **Module** | SHP |
| **Priority** | P0 |
| **Preconditions** | Store uses Driver-Managed shipping workflow. |
| **Main Flow** | 1. Merchant opens Driver Management. 2. Merchant creates driver account (name, phone, governorate coverage). 3. Driver receives credentials to log in to Driver App. 4. Merchant views driver list with status. 5. Merchant views per-driver performance stats (P1): deliveries, success/fail count, COD collected. |
| **Alternative Flows** | **A1 — Deactivation:** Merchant deactivates driver → Sessions invalidated → Driver cannot access app. |
| **Postconditions** | Driver account created and scoped to merchant's store; driver can access Driver App. |
| **Related Requirements** | SHP-007, SHP-015 |

---

> **Use Case Count Summary:** 62 use cases covering 5 actors (Merchant Owner, Customer, Delivery Driver, Platform Admin, System) across 21 modules. Aligned with V9.8 scope (219 functional requirements; no LND module; frontend-only cart). PRD module expanded from 3 simplified use cases to 21 detailed specifications (UC-010 through UC-030).

---

### B.2 — Entity-Relationship Diagram (Core Domain)

```
┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Tenant     │──1:N─│      User        │      │   Subscription   │
│──────────────│      │──────────────────│      │──────────────────│
│ tenant_id PK │      │ user_id PK       │      │ subscription_id  │
│ store_name   │──1:1─│ tenant_id FK     │      │ tenant_id FK     │
│ slug         │      │ email            │      │ plan_tier        │
│ domain       │      │ role (ENUM:      │      │ status           │
│ config_json  │      │  OWNER, MANAGER, │      │ expires_at       │
│ created_at   │      │  STAFF, CUSTOMER,│      └──────────────────┘
│              │      │  DRIVER, ADMIN)  │
│              │      │ password_hash    │      ┌──────────────────┐
│              │      │ phone            │      │  DeliveryAgent   │
│              │      └────────┬─────────┘      │──────────────────│
│              │               │ 1:0..1          │ agent_id PK      │
│              │               └─────────────────│ user_id FK       │
└──────┬───────┘                                │ governorates[]   │
                                                │ is_active        │
                                                │ created_at       │
                                                └──────────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Category    │──1:N─│    Product       │──1:N─│ ProductVariant   │
│──────────────│      │──────────────────│      │──────────────────│
│ category_id  │      │ product_id PK    │      │ variant_id PK    │
│ tenant_id FK │      │ tenant_id FK     │      │ product_id FK    │
│ name_ar      │      │ category_id FK   │      │ tenant_id FK     │
│ name_en      │      │ title_ar, _en    │      │ sku              │
│ slug         │      │ description_ar   │      │ price (DECIMAL)  │
│ parent_id FK │      │ slug             │      │ stock_quantity   │
└──────────────┘      │ status (ENUM)    │      │ low_stock_thresh │
                      │ seo_title        │      │ option_values    │
                      │ created_at       │      │ weight_grams     │
                      └────────┬─────────┘      └──────────────────┘
                               │ 1:N
                               ▼
                      ┌──────────────────┐
                      │  ProductImage    │
                      │──────────────────│
                      │ image_id PK      │
                      │ product_id FK    │
                      │ url              │
                      │ alt_text_ar      │
                      │ sort_order       │
                      │ is_primary       │
                      └──────────────────┘

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Customer    │──1:N─│     Order        │──1:N─│   OrderItem      │
│──────────────│      │──────────────────│      │──────────────────│
│ customer_id  │      │ order_id PK      │      │ item_id PK       │
│ tenant_id FK │      │ tenant_id FK     │      │ order_id FK      │
│ name         │      │ customer_id FK   │      │ variant_id FK    │
│ email        │      │ status (ENUM)    │      │ quantity         │
│ phone        │      │ payment_status   │      │ unit_price       │
│ created_at   │      │ payment_method   │      │ total_price      │
└──────┬───────┘      │ subtotal         │      └──────────────────┘
       │              │ tax_amount       │
       │ 1:N          │ shipping_cost    │      ┌──────────────────┐
       ▼              │ discount_amount  │──1:N─│ OrderTimeline    │
┌──────────────┐      │ total            │      │──────────────────│
│   Address    │      │ shipping_address │      │ timeline_id      │
│──────────────│      │ tracking_number  │      │ order_id FK      │
│ address_id   │      │ checkout_token   │      │ action           │
│ customer_id  │      │ version (OL)     │      │ actor            │
│ tenant_id FK │      │ created_at       │      │ timestamp        │
│ governorate  │      └──────┬───────────┘      │ details          │
│ city, street │             │ N:1               └──────────────────┘
│ is_default   │             ▼
└──────────────┘      ┌──────────────────┐      ┌──────────────────┐
                      │  DiscountCode    │      │     Review       │
                      │──────────────────│      │──────────────────│
                      │ code_id PK       │      │ review_id PK     │
                      │ tenant_id FK     │      │ product_id FK    │
                      │ code             │      │ customer_id FK   │
                      │ type (%, $, ship)│      │ tenant_id FK     │
                      │ value            │      │ rating (1-5)     │
                      │ min_order_amount │      │ text             │
                      │ usage_limit      │      │ status (ENUM)    │
                      │ per_customer_max │      │ merchant_reply   │
                      │ starts_at        │      │ created_at       │
                      │ expires_at       │      └──────────────────┘
                      └──────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  ShippingZone    │      │   Notification   │      │   MediaFile      │
│──────────────────│      │──────────────────│      │──────────────────│
│ zone_id PK       │      │ notification_id  │      │ file_id PK       │
│ tenant_id FK     │      │ tenant_id FK     │      │ tenant_id FK     │
│ name             │      │ channel (ENUM)   │      │ url              │
│ governorates[]   │      │ recipient        │      │ filename         │
│ flat_rate        │      │ template_key     │      │ mime_type        │
│ free_above       │      │ payload (JSONB)  │      │ size_bytes       │
│ estimated_days   │      │ status           │      │ alt_text_ar      │
└──────────────────┘      │ sent_at          │      │ thumbnails JSONB │
                          └──────────────────┘      │ created_at       │
                                                    └──────────────────┘
```

> **Legend:** PK = Primary Key · FK = Foreign Key · ENUM = PostgreSQL enum type · OL = Optimistic Locking · JSONB = PostgreSQL binary JSON. All tables include `tenant_id` for RLS enforcement.

### B.3 — Order State Machine

```
CART → [checkout] → PENDING → [payment confirmed / COD accepted] → CONFIRMED
                          ↘ [cancelled by customer] → CANCELLED
CONFIRMED → [merchant prepares] → PROCESSING → [shipped] → SHIPPED → [delivered] → DELIVERED
                                                                          ↘ RETURNED → REFUNDED
DELIVERED → [no issues after grace period] → COMPLETED
```

### B.4 — Core Data Model: Product (19 Entities)

```
Product
├── tenant_id (UUID, FK)
├── product_id (UUID, PK)
├── title_ar (TEXT, required)
├── title_en (TEXT, optional)
├── description_ar, description_en (TEXT)
├── slug (TEXT, unique per tenant)
├── default_category_id (UUID, FK)
├── status (ENUM: DRAFT, ACTIVE, ARCHIVED)
├── base_price (DECIMAL)
├── compare_at_price (DECIMAL)
├── currency_code (VARCHAR(3))
├── seo_title, seo_description (TEXT)
├── allow_oversell (BOOLEAN, default FALSE)
├── created_at, updated_at (TIMESTAMP)
│
├── ProductCategoryMap (N:M via junction)
│   ├── product_id (FK), category_id (FK)
│   └── is_primary (BOOLEAN)
│
├── ProductVariant (1:N)
│   ├── variant_id (PK), product_id (FK), tenant_id (FK)
│   ├── sku (UNIQUE), barcode
│   ├── price, compare_at_price (DECIMAL)
│   ├── cost_price (DECIMAL), cost_currency_code (VARCHAR(3))
│   ├── stock_qty, low_stock_threshold
│   └── weight_grams, is_active
│
├── ProductOption (1:N, max 3 axes -- Shopify-style)
│   ├── product_option_id (PK), product_id (FK)
│   ├── option_name_ar, option_name_en (e.g., "المقاس" / "Size")
│   ├── sort_order
│   │
│   └── ProductOptionValue (1:N)
│       ├── option_value_id (PK), product_option_id (FK)
│       ├── value_ar, value_en (e.g., "أحمر" / "Red")
│       ├── color_hex (for swatches, nullable)
│       └── sort_order
│
├── VariantOptionValue (N:M junction -- links variant to option values)
│   ├── variant_id (FK → ProductVariant)
│   └── option_value_id (FK → ProductOptionValue)
│
├── ProductAttributeValue (1:N -- EAV system for custom attributes)
│   ├── attribute_value_id (PK), product_id (FK)
│   ├── attribute_def_id (FK → ProductAttributeDefinition)
│   ├── value_text (TEXT), attribute_option_id (FK, nullable)
│   └── UNIQUE(product_id, attribute_def_id)
│
└── ProductImage (1:N via PRODUCT_MEDIA)
    ├── product_id (FK), media_asset_id (FK)
    ├── sort_order, is_primary
    └── attached_at

Category
├── category_id (PK), tenant_id (FK), parent_category_id (FK, self-ref)
├── name_ar, name_en, slug
├── description_ar, description_en, image_url
├── depth (0-2, max 3 levels), sort_order
└── is_active

ProductAttributeDefinition (EAV schema -- per tenant/category)
├── attribute_def_id (PK), tenant_id (FK)
├── category_id (FK, nullable -- null = global for tenant)
├── attribute_name_ar, attribute_name_en, attribute_key
├── data_type (TEXT, NUMBER, BOOLEAN, SELECT, MULTI_SELECT)
├── is_required, is_filterable, is_visible_on_storefront
├── sort_order, created_at
│
└── ProductAttributeOption (1:N -- for SELECT/MULTI_SELECT)
    ├── attribute_option_id (PK), attribute_def_id (FK)
    └── option_value_ar, option_value_en, sort_order

ProductTag
├── product_tag_id (PK), tenant_id (FK)
├── tag_name, slug
└── ProductTagMap (N:M junction: product_id, product_tag_id, tagged_at)

Collection
├── collection_id (PK), tenant_id (FK)
├── collection_name, collection_slug
├── collection_type (MANUAL | AUTOMATED)
├── description_ar, description_en, image_url
├── is_active, published_at
│
├── CollectionRule (1:N -- for AUTOMATED type)
│   ├── collection_rule_id (PK), collection_id (FK)
│   └── field_key, operator, value, logic_group
│
└── CollectionProduct (N:M junction)
    ├── collection_id (FK), product_id (FK)
    └── sort_order, added_at

InventoryMovement (audit trail for stock changes)
├── inventory_movement_id (PK), variant_id (FK)
├── actor_user_id (FK), quantity_delta, balance_after
├── reason_code, reference_type, reference_id
└── created_at

SearchSuggestion
├── suggestion_id (PK), tenant_id (FK)
├── suggestion_text_ar, suggestion_text_en
├── suggestion_type (POPULAR, CORRECTION, TRENDING)
└── hit_count, updated_at

SearchQueryLog
├── query_log_id (PK), tenant_id (FK)
├── query_text, results_count
└── created_at
```

**Variant Matrix Generation (PRD-002):**
1. Merchant defines ProductOptions: Size (S, M, L) + Color (Red, Blue)
2. System computes Cartesian product: 3 x 2 = 6 ProductVariant records
3. Each variant linked to its option values via VariantOptionValue junction
4. Merchant fills SKU, price override, stock per variant

**Dynamic Attributes (PRD-017 filters):**
Merchants define custom attributes per tenant/category (e.g., Brand, Material).
Filterable attributes automatically appear as storefront faceted search filters.

### B.5 — Core Data Model: Order

```
Order
├── order_id, tenant_id
├── customer_id (FK)
├── status (ENUM: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED, REFUNDED, COMPLETED)
├── payment_status (ENUM: UNPAID, PENDING, PAID, REFUNDED, FAILED)
├── payment_method (ENUM: COD, BANK_TRANSFER, ONLINE, MOBILE_WALLET)
├── subtotal, tax_amount, shipping_cost, discount_amount, total
├── shipping_address (JSONB)
├── tracking_number, carrier_name
├── notes_internal, notes_customer
├── checkout_token (UUID, unique — idempotency key)
├── version (INT — optimistic locking)
├── created_at, updated_at
│
├── OrderItem (1:N)
│   ├── variant_id, quantity, unit_price, total_price
│
└── OrderTimeline (1:N)
    ├── action, actor, timestamp, details
```

### B.6 — Authentication Model

```
┌───────────────────────────────────────────────────────┐
│                   SOOQ Auth Model                      │
├───────────────────────────────────────────────────────┤
│  Merchant Owner ──► JWT (role: OWNER)                 │
│       ├── Store Manager ──► JWT (MANAGER)             │
│       └── Staff ──► JWT (STAFF)                       │
│            └── permissions: [products:read,            │
│                orders:read, orders:write]               │
│                                                       │
│  Customer (Shopper) ──► JWT (CUSTOMER)                │
│       └── scoped to storefront only                   │
│       └── uses: Client App or Web Storefront          │
│                                                       │
│  Delivery Driver ──► JWT (DRIVER, tenant-scoped)      │
│       └── authenticates via WhatsApp OTP              │
│       └── no passwords stored                         │
│       └── scoped to one merchant store                │
│       └── permissions: [shipments:read:own,            │
│            shipments:update:own, cod:record]            │
│       └── uses: Driver App exclusively                │
│                                                       │
│  Platform Admin ──► JWT (ADMIN)                       │
│       └── cross-tenant with audit log                 │
│       └── manages: merchants, billing, platform        │
└───────────────────────────────────────────────────────┘
```

### B.7 — Multi-Tenancy: RLS Request Lifecycle

```
1. JWT arrives with tenant_id claim
2. Spring Security filter extracts tenant_id
3. Hibernate filter sets: SET app.current_tenant = '<uuid>'
4. PostgreSQL RLS policy enforces: WHERE tenant_id = current_setting('app.current_tenant')
5. Even if application code forgets a WHERE clause, the DB blocks cross-tenant access
```

---

## Appendix C: To Be Determined List


| #   | TBD Item                                                                                                                  | Section     | Status       |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| 1   | Paymera eGate production onboarding: bank provisioning, IP whitelisting, terminal ID                                      | PAY-003–009 | Open         |
| 2   | ~~Shipping & logistics provider evaluation~~ — resolved: in-house shipping with Driver-Managed and Self-Managed workflows | SHP-001–015 | **Resolved** |
| 3   | External LLM API provider and pricing for AI merchant tools                                                               | AI-001–004  | Open         |
| 4   | Apple Developer Account for App Store publishing                                                                          | APP-014     | Open         |
| 5   | SYP/USD exchange rate management approach (manual vs real-time vs hybrid)                                                 | CUR-001     | Open         |

| 7   | ZATCA compliance requirements if expanding to Saudi Arabia                                                                | TAX-003     | Deferred     |
| 8   | ~~Minimum Android version target for merchant and customer devices~~ — set to Android 10+ (API level 29)                | APP, 3.2    | **Resolved** |
| 9   | DSN-005 Bound Block sub-specifications — pending Yasser's task                                                            | DSN-005     | Open         |


---

*End of Software Requirements Specification for SOOQ v9.6*