FROM node:21 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# !don't use nginx:latest, it broke my build (work only first time, then it broke)
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/frontend/browser /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
