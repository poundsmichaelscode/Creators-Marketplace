# Creators Marketplace

Production-shaped monorepo MVP for an AI-powered digital marketplace where creators sell digital products, build landing pages, and track analytics.

## Stack
- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style components, Zustand, TanStack Query
- Backend: Django, Django REST Framework, PostgreSQL, Redis, Celery, Channels
- Payments: Stripe Checkout + webhooks
- Storage: S3-compatible storage via django-storages
- Observability: Sentry-ready logging hooks

## Features included
- JWT auth with refresh support
- Buyer / Creator / Admin roles
- Creator profile and dashboard
- Products CRUD and publishing
- Marketplace listing and product detail pages
- Stripe checkout session creation and webhook processing
- Download entitlement delivery model
- Landing page builder with JSON schema
- AI content generation endpoints and Celery job
- Notifications API + websocket consumer
- Analytics events + rollup endpoint
- Audit logs and feature flags
- Payout models and future-improvement extension points
- Affiliate/referral, subscriptions, teams, reviews, recommendations scaffolds

## Monorepo layout
```text
frontend/   Next.js app
backend/    Django API + workers
infra/      docker/dev infra helpers
```

## Quick start
### 1) Copy env files
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2) Run with Docker
```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1/
- Django admin: http://localhost:8000/admin/

### 3) Apply migrations
```bash
docker compose exec backend python manage.py migrate
```

### 4) Create a superuser
```bash
docker compose exec backend python manage.py createsuperuser
```

### 5) Run Celery worker
Included in compose as `worker` service.

## Backend app map
- accounts: auth, JWT endpoints, roles
- creators: creator profiles
- products: product catalog, media metadata, reviews placeholder
- orders: orders, order items, download entitlements
- payments: stripe checkout, webhooks, payouts
- landing_pages: section-based page builder schema storage
- analytics_app: event tracking and dashboard summaries
- notifications: in-app notifications + websocket fanout
- ai_tools: AI generation jobs
- audit: audit logs
- feature_flags: runtime feature toggles
- affiliates: future affiliate/referral scaffold
- subscriptions: future memberships scaffold
- teams: creator team accounts scaffold
- recommendations: recommendation scaffold

## Frontend app map
- Marketing home page
- Marketplace listing and product details
- Checkout success page
- Dashboard overview, products, analytics, landing pages, AI tools
- Reusable API client, React Query provider, auth/cart stores

## Notes
This repo is intentionally production-shaped and extendable. A few integrations are scaffolded with placeholders where secrets or paid services are required.
