# Install dependencies only when needed
FROM node:16 AS deps

#RUN apk add --no-cache libc6-compat
WORKDIR /app

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
COPY package.json package-lock.json ./

RUN npm ci

# Rebuild the source code only when needed
FROM node:16 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./ ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# If using npm comment out above and use below instead
RUN npm run build

# Production image, copy all the files and run next
FROM node:16 AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app ./

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV DATABASE_NAME "dusty"
ENV DATABASE_PASSWORD "202@siTTe2022"
ENV DATBASE_PORT "5432"
ENV DATABASE_SERVER "45.67.231.101"
ENV DATABASE_USER  "dusty"
ENV FEE  "0.1"
ENV JSON_WEB_TOKEN_SECERT  "sdmvawrwevs234DFgsdfg#sfg66%d"

ENV URL_SERVER  "https://ctrlx.net"


CMD ["npm", "start"]