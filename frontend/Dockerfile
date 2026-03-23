FROM node:22-alpine AS builder

WORKDIR /app

ARG PUBLIC_API_BASE_URL=/api
ARG TRUSTED_ORIGINS=

ENV PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL
ENV TRUSTED_ORIGINS=$TRUSTED_ORIGINS

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["node", "build"]
