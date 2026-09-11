# Stage 1: Build der Angular-App
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Bereitstellung via Nginx
FROM nginx:alpine
COPY --from=build /app/dist/angular-test /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
