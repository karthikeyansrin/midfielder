# ─────────────────────────────────────────────────────────────────
#  MIDFIELDER — Multi-stage Dockerfile
#  Deploys on Google Cloud Run using Next.js standalone output
#  Build: docker build -t midfielder .
#  Run:   docker run -p 3000:3000 midfielder
# ─────────────────────────────────────────────────────────────────

# ── Stage 1: Dependencies ─────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install libc++ for native modules on Alpine
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ── Stage 2: Builder ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars (non-sensitive, public values only)
ARG NEXT_PUBLIC_APP_URL=https://midfielder.app
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: Runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what is needed to run (standalone output)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/decide || exit 1

CMD ["node", "server.js"]
