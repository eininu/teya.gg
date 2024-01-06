FROM node:21
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install
RUN npm run typeorm migration:run
CMD ["node", "dist/main"]