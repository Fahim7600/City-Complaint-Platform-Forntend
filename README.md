# CityFix — City Complaint & Service Platform (Frontend)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-UI_Primitives-black?style=for-the-badge)](https://ui.shadcn.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query/latest)

**CityFix** is a modern, high-performance civic complaint management and municipal workflow automation platform built for smart cities. It bridges citizens, municipal departments, field repair technicians, managers, and city administrators into a unified, transparent digital ecosystem. Citizens can report civic issues with photo evidence, monitor real-time repair progress against guaranteed Service Level Agreements (SLAs), and rate technicians. Municipal staff leverage dedicated role-based portals for automated triage, intelligent dispatch, field work updates, subscription revenue auditing, and comprehensive governance analytics.

---

## 🔗 Live Links

- **Live Application**: Coming soon — will be added after deployment
- **Backend API**: [https://city-complaint-platform-1.onrender.com/api/v1](https://city-complaint-platform-1.onrender.com/api/v1)
- **API Documentation (Swagger UI)**: [https://city-complaint-platform-1.onrender.com/api-docs](https://city-complaint-platform-1.onrender.com/api-docs)
- **Backend Repository**: [https://github.com/Fahim7600/City-Complaint-Platform](https://github.com/Fahim7600/City-Complaint-Platform)

---

## 🔑 Demo Credentials

Evaluators can access all system roles directly using the credentials below, or click the **One-Click Demo Login** buttons available on the [`/login`](/login) page:

| Role | Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@citycomplaints.com` | `Admin@2026Secure` | [`/admin`](/admin) |
| **Manager** (Roads & Infrastructure) | `manager.roads@citycomplaints.com` | `DemoStaff2026!` | [`/manager`](/manager) |
| **Technician** (Field Operations) | `ttech1.roads@citycomplaints.com` | `DemoStaff2026!` | [`/technician`](/technician) |
| **Citizen** | `citizen@example.com` | `Password123!` | [`/dashboard`](/dashboard) |

> [!TIP]
> **Stripe Test Mode Payments**: When testing Premium citizen upgrades on `/dashboard/subscription` or `/pricing`, use the Stripe test card:
> - **Card Number**: `4242 4242 4242 4242`
> - **Expiration**: Any future date (e.g. `12/34`)
> - **CVC**: Any 3-digit code (e.g. `123`)

---

## 🌟 Features by Role

### 👤 Citizen
- **Multi-Step Complaint Filing**: 5-step wizard covering department selection, SLA-guaranteed category, title/description, address, and Cloudinary photo evidence uploads (up to 5 images for free tier, 10 for premium).
- **Interactive Tracking**: Detailed complaint sheet with status badges, priority markers, resolution countdown, assigned technician info, and a step-by-step audit history timeline.
- **Complaint Lifecycle Actions**: Reopen unresolved complaints within 7 days, cancel pending complaints, and edit filed complaint details.
- **Citizen Reviews**: 5-star rating and written review submission once complaints reach `RESOLVED` status.
- **Premium Subscription**: Stripe Checkout integration to unlock 20 monthly complaints, 10 photo attachments, priority SLA triage, and instant municipal notification routing.
- **Staff Application**: Apply to become a municipal Technician or Department Manager with qualification and experience credentials.

### 🛠️ Technician
- **Field Work Order Queue**: View assigned repair jobs sorted by urgency, priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and lifecycle status.
- **Operational Status Transitions**: Transition assigned jobs from `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` with technician completion notes.
- **Photo Evidence Documentation**: Upload mandatory `BEFORE_WORK` and `AFTER_WORK` repair photos to document field execution.
- **Availability Management**: Toggle on-duty availability status (`AVAILABLE` vs `UNAVAILABLE`) affecting manager dispatch algorithms.
- **Performance Analytics**: Track resolution rate, average turnaround hours, completed jobs, and citizen review ratings with Recharts performance visualizations.

### 📋 Department Manager
- **Department Queue Management**: Monitor complaints routed specifically to the manager's assigned municipal department.
- **Technician Dispatch**: Assign unassigned complaints to active, available technicians within the department.
- **Direct Staff Invitation**: Invite technicians directly by email with temporary passwords (valid 7 days). Technicians display an amber "Invite pending" badge with one-click "Resend invite" until first sign-in.
- **Technician Removal & Safety Safeguards**: Remove technicians from the municipal roster (converting them to regular citizens). If the technician has active assigned work orders, the backend returns a `409 Conflict` listing blocking complaint IDs with direct links to `/manager?id=...` and guidance for Admin reassignment.
- **Quality Control Actions**: On `RESOLVED` complaints, verify field repairs to `CLOSE` complaints or send them back to the technician with required rework notes.
- **Escalation**: Escalate blocked or high-severity issues directly to City Administration with mandatory escalation notes.
- **Staff Application Review**: Review incoming citizen applications for Department Technician or Manager roles with one-click approval or rejection with feedback.

### 👑 System Administrator
- **Citywide Governance Analytics**: Real-time statistical dashboards with resolution rate KPIs, monthly trends, and department performance comparisons.
- **Master Complaint Supervision**: Full administrative authority across all municipal complaints, status transitions, technician reassignments, and soft deletion.
- **Department & Category Configuration**: Create and configure municipal departments, icon mappings, service categories, and SLA resolution hours.
- **User Management & Staff Invitations**: Oversee citizens and staff, override user roles, assign department affiliations, deactivate/reactivate accounts, and directly invite `TECHNICIAN` or `MANAGER` staff by email with temporary passwords and resend-invite capabilities.
- **Subscription & Payment Auditing**: Audit Stripe subscription statuses (`ACTIVE`, `CANCELED`, `PAST_DUE`, `INCOMPLETE`) with page-level transaction filters and revenue charts.
- **Audit Logging**: Searchable system-wide audit trail with JSON state diff modal and one-click CSV export.

### 🔐 Authentication, Password Security & Recovery
- **Forced Password Change (`/set-password`)**: All invited staff signing in with temporary passwords (`mustChangePassword: true`) are automatically routed to set their own secure password before accessing any municipal portal. Dashboard rendering and HTTP queries are guarded to eliminate 403 error flashes, and fresh session tokens are automatically issued upon completion.
- **Self-Service Forgot Password (`/forgot-password`)**: Citizens and staff can recover access via an emailed 6-digit OTP code sent through Brevo. Includes a 60-second cooldown timer, lockout protection, and a fluid 6-digit `OtpInput` supporting paste, keyboard navigation, and automatic submission.
- **Brevo Email Dispatch Notice**: Transactional invitation passwords and OTP codes are delivered by the backend via Brevo. Because emails originate from a Gmail address, users are advised to check their **Spam/Junk** folder if the message does not appear within 60 seconds.

### 🌐 Public Portal (Unauthenticated)
- **High-Impact Landing Page**: Animated gradient hero with civic photo showcase, floating metrics card, live count-up stats strip, 4-step civic resolution timeline, department previews, and FAQ accordion.
- **About Page**: Civic mission narrative, 4 roles explained, horizontal complaint lifecycle stepper, and core transparency values.
- **Departments & SLAs**: Searchable department directory with SLA target resolution chips and individual department detail pages displaying technician star ratings.
- **Citywide Transparency Stats**: Real-time resolution metrics with dynamic Recharts breakdowns refreshed every 5 minutes.
- **Pricing & Comparison**: Free vs. Premium comparison matrix and live Stripe billing terms.
- **Contact Directory**: Hotline `16263`, phone, email, support operating hours, 999 emergency banner, and an embedded Mirpur-10 Dhaka Google Maps view.

---

## 🗺️ Pages and Routes

| Category | Route | Description |
| :--- | :--- | :--- |
| **Public** | `/` | Civic hero, live stats strip, how it works, department preview, and FAQs |
| **Public** | `/about` | Mission, 4 roles explained, resolution lifecycle stepper, and core principles |
| **Public** | `/departments` | All municipal departments with SLA category chips and URL-synced search |
| **Public** | `/departments/[id]` | Department details, SLA targets, and technician team star ratings |
| **Public** | `/stats` | Citywide complaint resolution statistics and Recharts status distribution |
| **Public** | `/pricing` | Free vs. Premium plan comparison matrix, Stripe pricing, and billing FAQs |
| **Public** | `/contact` | Office address, Google Maps iframe, hotline, email, and 999 notice |
| **Auth** | `/login` | Email/password sign-in with One-Click Demo Login buttons and Google OAuth |
| **Auth** | `/register` | New citizen registration with instant authentication and onboarding |
| **Auth** | `/set-password` | Mandatory password update on first sign-in for staff invited with temporary credentials |
| **Auth** | `/forgot-password` | Self-service password recovery email request with 6-digit code dispatch |
| **Auth** | `/forgot-password/verify` | 6-digit OTP verification with 60-second cooldown timer and lockout handling |
| **Auth** | `/reset-password` | New password selection with 15-minute token countdown and strength meter |
| **Citizen** | `/dashboard` | Citizen overview, quick complaint submission CTA, and recent ticket activity |
| **Citizen** | `/dashboard/complaints` | Master citizen complaints list with search, status filters, and pagination |
| **Citizen** | `/dashboard/complaints/new` | 5-step interactive wizard for filing new municipal complaints |
| **Citizen** | `/dashboard/complaints/[id]` | Real-time complaint detail, timeline stepper, and review submission |
| **Citizen** | `/dashboard/subscription` | Current tier overview, Stripe upgrade button, and subscription management |
| **Citizen** | `/dashboard/apply-staff` | Staff application form for Manager or Technician roles with status tracking |
| **Citizen** | `/dashboard/profile` | Citizen profile information, avatar management, and password security |
| **Technician**| `/technician` | Field work order queue, filter by priority, and job detail drawer |
| **Technician**| `/technician/jobs/[id]` | Full-page work order view with before/after photo uploader and status update |
| **Technician**| `/technician/performance` | Personal performance metrics, resolution rate, and completion charts |
| **Technician**| `/technician/profile` | Technician credentials, department affiliation, and availability toggle |
| **Manager** | `/manager` | Department complaint triage queue, technician assignment dialog, and filters |
| **Manager** | `/manager/applications` | Citizen applications for department roles with approve/reject dialogs |
| **Manager** | `/manager/technicians` | Department technician directory with availability indicators and workloads |
| **Manager** | `/manager/profile` | Department manager profile information and security settings |
| **Admin** | `/admin` | Citywide administrative overview, resolution KPIs, and monthly volume charts |
| **Admin** | `/admin/complaints` | Global complaint queue with status, department, and priority filters |
| **Admin** | `/admin/complaints/[id]` | Deep-link complaint redirection opening the administrative inspector sheet |
| **Admin** | `/admin/departments` | Department CRUD management with modal creation and deactivation |
| **Admin** | `/admin/categories` | Service category management with SLA hour configuration |
| **Admin** | `/admin/users` | User management directory, role overrides, and account deactivation |
| **Admin** | `/admin/payments` | Stripe subscription audit, monthly revenue charts, and transaction inspection |
| **Admin** | `/admin/audit-logs` | Platform audit logs with JSON diff inspector and CSV download |
| **Admin** | `/admin/pricing` | System-wide subscription tier configuration and limit management |
| **Shared** | `/notifications` | Role-aware notification center with mark-all-as-read and deep-linking |
| **Payment** | `/payment/success` | Legacy payment success confirmation screen |
| **Payment** | `/payment/cancel` | Checkout cancellation notice with return to dashboard CTA |
| **Payment** | `/premium/success` | Stripe session confirmation verifying checkout session with backend |
| **Payment** | `/premium/cancel` | Stripe checkout cancellation notice returning user to subscription tab |
| **Utility** | `/sitemap.xml` | Dynamic XML sitemap covering all public pages and department detail routes |
| **Utility** | `/robots.txt` | Robots crawler configuration protecting internal portal paths |

---

## 💻 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Server Components, hybrid ISR, routing, and metadata optimization |
| **Language** | TypeScript 5 (Strict Mode) | Full-stack end-to-end type safety with zero `any` usage |
| **Styling** | Tailwind CSS v4 | Modern styling, curated dark/light palettes, glassmorphism, and neon gradients |
| **UI Primitives** | shadcn/ui & Base UI | Accessible dialogs, sheets, dropdowns, forms, badges, and avatars |
| **Data Fetching** | TanStack Query v5 (React Query) | Client cache management, optimistic mutations, background refetching |
| **Server Fetch** | Native `fetch` with Next.js ISR | 5-minute revalidation on public endpoints matching backend Redis cache |
| **State Management**| Zustand & `useUrlState` | Lightweight client state and URL query parameter synchronization |
| **Forms & Validation**| React Hook Form + Zod | Schema-driven form validation with accessible field error indicators |
| **Visualizations** | Recharts (Dynamic Import) | Responsive area charts, status distribution bars, and donut breakdowns |
| **Notifications** | Sonner | Top-center stacked toast notifications for mutation successes and errors |
| **Icons** | Lucide React | Curated, consistent SVG icons across all portals and public landing pages |

---

## 🏗️ Architecture Decisions

### 1. Server vs. Client Component Strategy
- **Public Pages (`src/app/(public)`)**: Built as **Server Components** leveraging `serverFetch` with a `revalidate: 300` cache configuration. This matches the backend's 5-minute Redis caching strategy, delivering instant static HTML delivery with Incremental Static Regeneration (ISR). Small interactive islands (`PublicAuthButtons`, `HomeStatsStrip`, `DepartmentsSearchGrid`) are scoped to `"use client"`.
- **Authenticated Portals (`/dashboard`, `/technician`, `/manager`, `/admin`)**: Built with client-side data fetching via **TanStack Query** over Axios. Because cross-origin refresh tokens reside in `httpOnly` cookies on the backend domain (`onrender.com`), client-side requests maintain authenticated sessions seamlessly without exposing sensitive refresh tokens to the frontend server.

### 2. Dual-Token Authentication & Refresh Queue
- **Token Storage**: The short-lived `accessToken` is stored in client memory and synchronized to a lightweight cookie for Next.js route protection. The long-lived `refreshToken` is held securely in an `httpOnly`, `SameSite=None` cookie on the backend domain.
- **Concurrent Refresh Queue**: In `src/lib/axios.ts`, an Axios interceptor catches `401 Unauthorized` responses and triggers `/auth/refresh-token`. A module-scoped `refreshPromise` ensures simultaneous API requests queue up and replay automatically once the single refresh operation completes, eliminating token stampedes.
- **Route Guarding**: Next.js middleware (`src/proxy.ts`) validates access tokens against requested route prefixes (`/admin`, `/manager`, `/technician`, `/dashboard`), redirecting unauthenticated visitors to `/login` with return parameters.

### 3. URL State Synchronization
All tables, filter bars, search inputs, tabs, and pagination controls synchronize their state directly to URL search parameters using `useUrlState` and `useSearchParams`. This enables deep linking, browser back/forward history retention, and link sharing without loss of filter context.

### 4. Optimistic UI Updates
Critical municipal operations—such as technician assignment, status transitions (`ASSIGNED` → `IN_PROGRESS` → `RESOLVED`), and ticket closures—implement TanStack Query optimistic updates with automatic rollback on error. The UI reflects changes immediately, providing an ultra-responsive experience for municipal workers in the field.

### 5. Stripe Checkout Lifecycle
When a citizen upgrades to Premium:
1. Frontend calls `POST /payments/create-checkout-session`.
2. Citizen is redirected to Stripe's secure checkout page.
3. Upon completion, Stripe redirects to `/premium/success?session_id={CHECKOUT_SESSION_ID}`.
4. The success page immediately calls `POST /payments/confirm-session` with the session ID to verify payment status, upgrade user permissions, and refresh cached profile credentials before returning the citizen to their upgraded dashboard.

### 6. Robust Error Boundaries & User Feedback
Every route segment includes a dedicated `error.tsx` boundary powered by `RoleErrorCard` alongside skeleton `loading.tsx` loaders. All client mutations trigger informative top-center Sonner toasts on both success and error, providing actionable feedback across all operations.

---

## 📁 Folder Structure

```text
src/
├── app/                        # Next.js App Router root
│   ├── (auth)/                 # Authentication routes (/login, /register)
│   ├── (public)/               # Public marketing pages (/, /about, /departments, /stats, /pricing, /contact)
│   ├── admin/                  # Municipal administration portal
│   ├── dashboard/              # Citizen service portal
│   ├── manager/                # Department manager operations portal
│   ├── technician/             # Field technician work order portal
│   ├── notifications/          # Centralized user notifications
│   ├── payment/                # Payment redirect handlers
│   ├── premium/                # Stripe subscription confirmation handlers
│   ├── layout.tsx              # Root HTML shell with providers and font setup
│   ├── robots.ts               # Robots crawler policy
│   └── sitemap.ts              # Dynamic XML sitemap generator
├── components/                 # Reusable UI component library
│   ├── admin/                  # Admin views, tables, and management sheets
│   ├── auth/                   # Login/register forms and demo login buttons
│   ├── citizen/                # Complaint filing wizard, tracking, review cards
│   ├── layout/                 # Navbar, footer, sidebar, topbar, dashboard shells
│   ├── manager/                # Department queues, assignment dialogs, triage actions
│   ├── notifications/          # Notification drawer and notification center views
│   ├── payment/                # Checkout cancel cards and billing status alerts
│   ├── public/                 # Home sections, stats charts, search grids
│   ├── shared/                 # Status badges, stat cards, empty states, search inputs
│   ├── technician/             # Work panels, job cards, photo uploaders, charts
│   └── ui/                     # shadcn/ui and Base UI primitives
├── hooks/                      # Custom React hooks (useAuth, useUrlState, useInView, useDebounce)
├── lib/                        # Core utilities (axios, serverFetch, env, siteConfig, utils)
├── schemas/                    # Zod schemas for forms and validation
├── services/                   # API service modules (admin, auth, complaint, department, public)
├── store/                      # Zustand state stores (auth, draft, UI)
└── types/                      # TypeScript definitions (api, complaint, department, user, stats)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (v9+)

### Installation
1. Clone the frontend repository:
   ```bash
   git clone https://github.com/Fahim7600/City-Complaint-Platform-Forntend.git
   cd City-Complaint-Platform-Forntend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Populate `.env.local` with your configuration:
   | Variable | Required | Description | Example |
   | :--- | :---: | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | Yes | Backend REST API endpoint | `https://city-complaint-platform-1.onrender.com/api/v1` |
   | `NEXT_PUBLIC_APP_URL` | Yes | Base URL of the frontend application | `http://localhost:3000` |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID`| Optional | Google OAuth 2.0 Web Client ID | `324054328969-...apps.googleusercontent.com` |
   | `NEXT_PUBLIC_DEMO_*` | Optional | Demo credentials for one-click login | See Demo Credentials section |

5. Launch the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verification & Quality Scripts
```bash
# Type check TypeScript without emitting files
npx tsc --noEmit

# Run ESLint across all components and pages
npm run lint

# Build production bundle and verify static/ISR routes
npm run build
```

---

## 🌐 Deployment Guide

### Vercel (Frontend Deployment)
1. Push your code to your GitHub repository.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Import Project** and select `City-Complaint-Platform-Forntend`.
3. Set the Framework Preset to **Next.js**.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://city-complaint-platform-1.onrender.com/api/v1`)
   - `NEXT_PUBLIC_APP_URL`: Your production Vercel URL (e.g., `https://cityfix.vercel.app`)
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - All `NEXT_PUBLIC_DEMO_*` variables
5. Click **Deploy**.

### Render (Backend CORS & Cookie Configuration)
To allow cross-origin authentication and cookies between Vercel and Render:
1. In the Render Dashboard for `City-Complaint-Platform`:
2. Add your Vercel deployment URL to `ALLOWED_ORIGINS` (e.g., `https://cityfix.vercel.app,http://localhost:3000`).
3. Set `FRONTEND_BASE_URL` to your Vercel deployment URL.
4. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), under **Authorized JavaScript Origins**, add your Vercel URL.

---

## 📝 Commit Convention

This project strictly adheres to [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: New user-facing features or pages
- `fix`: Bug fixes and error resolutions
- `refactor`: Code reorganization without functional changes
- `perf`: Performance optimizations (lazy loading, ISR, bundle size)
- `docs`: Documentation updates and README additions
- `chore`: Tooling, dependency, and configuration maintenance

---

## 👨‍💻 Author

**Md. Habibur Rahman**  
- **GitHub**: [@Fahim7600](https://github.com/Fahim7600)  
- **Project**: CityFix City Complaint & Service Platform (Frontend)
