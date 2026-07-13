# MIDFIELDER ⚡

**App URL**: https://midfielder-53525848512.europe-west1.run.app
#

> **The intelligent stadium fan engagement platform. Powered by AI. Built for matchday.**

MIDFIELDER is a real-time, context-aware web application built for stadium operators and fans. By ingesting live stadium operational events and passing them through a smart AI Decision Engine (powered by Gemini 3.1 Flash Lite), MIDFIELDER delivers hyper-personalized, actionable recommendations directly to a fan's dashboard. 

## 🌟 Key Features

### 1. Smart Decision Coordinator & AI Engine
- **Gemini 3.1 Flash Lite Integration**: Analyzes incoming stadium events against a fan's specific context (seat location, travel plans, accessibility needs) to generate tailored alerts.
- **Server-Side Gatekeeper**: A robust `DecisionCoordinator` intercepts event streams, implementing debouncing, context-hashing, and concurrency locks to prevent quota exhaustion. It ensures Gemini is only queried when a *meaningful* context shift occurs.

### 2. Immersive Fan Experience
- **Dynamic Onboarding Wizard**: A slick, multi-step setup flow where fans configure their unique context:
  - **Match Info**: Stadium selection and seat zones (e.g., North Gate, Section 101, VIP Lounge).
  - **Travel Profile**: Transport mode, arrival times, and parking requirements.
  - **Preferences & Accessibility**: Food/merch interests, and critical needs like wheelchair assistance.
- **Personalized Fan Hub**: A live dashboard that updates dynamically with AI recommendations (e.g., "Use South Gate to avoid congestion," "Flash sale near Section 101") based exclusively on the fan's current profile.

### 3. Mission Control (Admin Panel)
- **Live Event Simulator**: Operators can inject randomized, realistic stadium events (Crowd Congestion, Medical Emergencies, Gate Closures) into the central event bus.
- **Zone Monitoring**: Real-time visual monitoring of stadium zones. As simulated events occur in specific areas (e.g., "Food Court A"), the corresponding UI zones react and display severity levels (Healthy, Warning, Critical).

### 4. Technical Highlights
- **Realistic Tournament Context**: Incorporates real FIFA World Cup 2026 teams, match schedules, and host stadiums for an authentic demo experience, while keeping underlying operational intelligence fully AI-driven.
- **Real-time Sync**: Firebase Firestore integration for seamless, instant state updates across all connected clients.
- **Modern UI/UX**: Built with Next.js, Framer Motion, and Tailwind CSS. Features glassmorphism, dynamic breadcrumbs, responsive grids, and highly polished micro-animations.

## 🚀 Quick Start (Demo Mode)

We have pre-configured test accounts for quick hackathon demonstrations.

### Admin Access (Mission Control)
1. Navigate to `/admin/login`
2. Use the test credentials: `admin` / `admin`
3. Generate simulated events using the **Simulator Controls** and watch the stadium zones react in real-time.

### Fan Access (Dashboard)
1. Navigate to `/login`
2. Use the test credentials: `test` / `test`
3. (Alternatively, hit **Get Started** on the landing page to experience the full onboarding flow).
4. Watch as the AI generates personalized alerts in response to the Admin's simulated events.

## 🛠️ Built With
- **Framework**: Next.js (App Router), React
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Firebase (Firestore)
- **AI**: Google Gemini SDK (Gemini 3.1 Flash Lite)