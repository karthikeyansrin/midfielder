# MIDFIELDER ⚡

**Live Demo:** https://midfielder-53525848512.europe-west1.run.app

> **An AI-powered stadium assistant that delivers personalized "Next Best Actions" to fans during live sporting events.**

---

# Chosen Vertical

**Sports Technology (SportsTech) – Smart Stadiums & Tournament Operations**

MIDFIELDER is an AI-powered decision support platform built for the FIFA World Cup 2026 stadium experience. It continuously monitors stadium operational events and provides each fan with context-aware recommendations that improve navigation, safety, convenience, and overall match-day experience.

---

# Problem Statement

During major sporting events, thousands of fans receive the same generic announcements despite having completely different situations.

A family arriving late, a wheelchair user, a fan looking for merchandise, and a VIP guest all require different guidance.

MIDFIELDER transforms live operational events into personalized recommendations by understanding each fan's context instead of broadcasting one-size-fits-all alerts.

---

# Approach & Logic

The solution follows an event-driven architecture.

1. Fans create their match-day profile through onboarding.
2. Stadium operators generate or receive operational events.
3. Events are stored in Firestore.
4. The Decision Coordinator determines whether an AI recommendation is actually required.
5. If necessary, Google Gemini analyzes the fan context together with relevant events.
6. The generated recommendation is stored and delivered to the fan dashboard in real time.

The Decision Coordinator prevents unnecessary AI calls through:

- Context hashing
- Request deduplication
- Cooldown windows
- Concurrency control
- Debouncing

This keeps the system responsive while minimizing AI usage.

---

# How the Solution Works

```
Mission Control
        │
        ▼
 Stadium Event Simulator
        │
        ▼
 Firebase Firestore
        │
        ▼
 Decision Coordinator
        │
        ▼
 Google Gemini
        │
        ▼
 Personalized Recommendation
        │
        ▼
 Fan Dashboard
```

---

# Features

## AI Decision Engine

- Google Gemini-powered recommendation engine
- Context-aware "Next Best Action" generation
- Personalized recommendations based on:
  - Seat location
  - Entry gate
  - Transport mode
  - Arrival time
  - Accessibility needs
  - Fan preferences

---

## Fan Dashboard

- Personalized AI recommendations
- Live stadium event updates
- Match information
- Dynamic onboarding experience
- Real-time Firestore synchronization

---

## Mission Control

- Stadium operations dashboard
- Event simulator
- Zone monitoring
- Crowd incident generation
- Gate closure simulation
- Medical emergency simulation
- Weather alerts
- Live event management

---

## Technical Highlights

- Next.js App Router
- Google Gemini integration
- Firebase Firestore real-time synchronization
- Event-driven architecture
- Server-side AI orchestration
- Responsive modern UI
- Dockerized deployment
- Google Cloud Run hosting

---

# Assumptions

- Stadium operational events are simulated for demonstration purposes.
- FIFA World Cup teams, venues, and fixtures are representative demo data.
- Firestore acts as the system's real-time event backbone.
- Recommendations are generated for a single fan profile at a time.
- Internet connectivity is available for Firebase and Gemini services.

---

# Demo Accounts

## Admin

URL

```
/admin/login
```

Credentials

```
Username: admin
Password: admin
```

Use Mission Control to generate stadium events and observe AI recommendations being produced.

---

## Fan

URL

```
/login
```

Credentials

```
Username: test
Password: test
```

Or complete the onboarding flow using **Get Started** from the landing page.

---

# Tech Stack

| Category | Technology |
|-----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | Firebase Firestore |
| AI | Google Gemini |
| Deployment | Google Cloud Run |
| Containerization | Docker |

---

# Local Setup

Clone the repository

```bash
git clone https://github.com/karthikeyansrin/midfielder
cd midfielder
```

Install dependencies

```bash
npm install
```

Create a `.env.local`

```env
GEMINI_API_KEY=...

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Run locally

```bash
npm run dev
```

---

# Future Enhancements

- Integration with live stadium IoT feeds
- Real-time public transport APIs
- Predictive crowd flow analysis
- Push notifications
- Multi-language recommendations
- Operator analytics dashboard

---

Built for **PromptWars Virtual Hackathon 2026** using Google Gemini.
