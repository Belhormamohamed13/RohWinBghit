# =========================
# Build stage
# =========================
FROM node:18-alpine AS build
WORKDIR /repo

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# Copy workspace config + lockfile
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copy package manifests
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# Install deps (workspace-aware)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

# Build Vite app
RUN pnpm --filter web build


# =========================
# Runtime stage (nginx)
# =========================
FROM nginx:1.27-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
