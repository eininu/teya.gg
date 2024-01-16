FROM node:21 as pbn-build
WORKDIR /app
RUN npm install -g @11ty/eleventy
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build