FROM node:latest as frontend-build
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ .
RUN npm run build

# TODO: Need block seo bots, like ahrefs, semrush, etc
FROM nginx:alpine
ENV DOMAIN_NAME=teya.gg
ARG BASIC_AUTH_PASSWORD

RUN apk --no-cache add apache2-utils openssl goaccess \
    && openssl genrsa -out /etc/ssl/private/$DOMAIN_NAME.key 2048 \
    && openssl req -new -x509 -key /etc/ssl/private/$DOMAIN_NAME.key -out /etc/ssl/certs/$DOMAIN_NAME.crt -days 365 -subj "/CN=$DOMAIN_NAME" \
    && htpasswd -cb /etc/nginx/.htpasswd $BASIC_AUTH_PASSWORD $BASIC_AUTH_PASSWORD

COPY ./nginx/configs /etc/nginx
COPY --from=frontend-build /app/build /usr/share/nginx/html/frontend
#COPY ./nginx/goaccess.conf /etc/goaccess/goaccess.conf
#RUN touch /var/log/nginx/access_pbn.log

#COPY ./nginx/start.sh /start.sh
#RUN chmod +x /start.sh
#CMD ["/start.sh"]
CMD ["nginx", "-g", "daemon off;"]
