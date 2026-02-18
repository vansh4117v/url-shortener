FROM node:18-alpine AS builder

ARG VITE_API_BASE_URL
ARG VITE_BASE_URL
ARG VITE_SITE_NAME

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_SITE_NAME=$VITE_SITE_NAME

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html