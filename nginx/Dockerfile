FROM node:latest as frontend-build
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ .
RUN npm run build

FROM nginx:alpine
ENV DOMAIN_NAME=teya.gg
ARG BASIC_AUTH_PASSWORD

RUN apk --no-cache add apache2-utils openssl \
    && openssl genrsa -out /etc/ssl/private/$DOMAIN_NAME.key 2048 \
    && openssl req -new -x509 -key /etc/ssl/private/$DOMAIN_NAME.key -out /etc/ssl/certs/$DOMAIN_NAME.crt -days 365 -subj "/CN=$DOMAIN_NAME" \
    && htpasswd -cb /etc/nginx/.htpasswd $BASIC_AUTH_PASSWORD $BASIC_AUTH_PASSWORD

COPY ./nginx/configs /etc/nginx

COPY --from=frontend-build /app/build /usr/share/nginx/html/frontend

CMD ["nginx", "-g", "daemon off;"]
