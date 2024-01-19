FROM node:21
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update && apt-get install -y dos2unix
RUN npm install
COPY . .
RUN npm run build

# RUN mkdir -p ./_websites/content && touch ./_websites/content/.init

COPY wait-for-it.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-it.sh
RUN dos2unix /usr/local/bin/wait-for-it.sh


CMD ["node", "dist/src/main"]