FROM node:21

RUN apt-get update && apt-get install -y iputils-ping

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
#CMD ["node", "server.js"]
