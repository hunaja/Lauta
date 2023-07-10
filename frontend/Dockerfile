FROM node:18 AS builder

WORKDIR /build

COPY package* .
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

FROM nginx

COPY --from=builder /build/dist /var/www/lauta

COPY ./nginx.conf /etc/nginx/nginx.conf

# Nginx config
COPY nginx_init.sh /nginx_init.sh
RUN chmod +x /nginx_init.sh

ENTRYPOINT ["/nginx_init.sh"]
CMD ["nginx", "-c", "/etc/nginx/nginx.conf"]