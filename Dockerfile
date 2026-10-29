# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variáveis VITE_* são embutidas no bundle em tempo de build.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# Endereço público do site (URLs absolutas de canonical e Open Graph) e ID do cliente do "Entrar com o Google".
ARG VITE_SITE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

FROM nginx:1.27-alpine
# A imagem faz envsubst dos arquivos em /etc/nginx/templates; as variáveis abaixo vêm do ambiente.
#   API_ORIGIN           endereço da API visto pelo navegador (CSP)
#   API_INTERNAL_ORIGIN  endereço da API visto por este contêiner (SEO: sitemap e etiquetas por página)
#   SITE_URL             endereço público do site (robots.txt); o mesmo de VITE_SITE_URL e Seo__SiteUrl da API
#   NGINX_RESOLVER       DNS usado para achar a API (127.0.0.11 no Docker; no Kubernetes, o do cluster)
ENV PORT=8080
ENV API_ORIGIN=http://localhost:5399
ENV API_INTERNAL_ORIGIN=http://api:8080
ENV SITE_URL=http://localhost:5173
ENV NGINX_RESOLVER=127.0.0.11
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
