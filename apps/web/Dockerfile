FROM node:18-alpine AS build
WORKDIR /repo

# Install monorepo deps (workspaces)
COPY package.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN npm install

# Build web
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
RUN npm --workspace apps/web run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80

