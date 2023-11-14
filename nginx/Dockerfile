FROM nginx:1.25.3-bookworm

ENV DOMAIN_NAME=teya.gg
ARG BASIC_AUTH_PASSWORD

RUN apt-get update \
    && apt-get install -y apache2-utils \
    && openssl genrsa -out /etc/ssl/private/$DOMAIN_NAME.key 2048 \
    && openssl req -new -x509 -key /etc/ssl/private/$DOMAIN_NAME.key -out /etc/ssl/certs/$DOMAIN_NAME.crt -days 365 -subj "/CN=$DOMAIN_NAME" \
    && htpasswd -cb /etc/nginx/.htpasswd $BASIC_AUTH_PASSWORD $BASIC_AUTH_PASSWORD

COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
