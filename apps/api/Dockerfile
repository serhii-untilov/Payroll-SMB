# ---------------------- BASE ----------------------------------
FROM node:20-alpine AS base

# ---------------------- BUILD ----------------------------------
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
COPY . .
# RUN chown -R node:node .
RUN npm ci
RUN npm i -g turbo
RUN turbo prune @repo/api --docker
RUN turbo prune @repo/web --docker

# ---------------------- INSTALL ----------------------------------
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm i -g turbo
RUN npm i -g typeorm
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm i

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY ./apps/api/locales ./locales

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN npm run build

# ---------------------- RUN ----------------------------------
FROM base AS runner
# For healthcheck
RUN apk --no-cache add curl
WORKDIR /app
# Don't run production as root
RUN chown -R node:node .
RUN addgroup --system --gid 1001 dockeruser
RUN adduser --system --uid 1001 dockeruser
USER node
COPY --from=installer /app .
COPY .env.docker .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE ${PORT}
CMD npm --workspace @repo/api run m:run && node apps/api/dist/main.js
