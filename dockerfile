# Stage 1: Build Angular
FROM node:22.17 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Pass prod config to ng build via npm script
RUN npm run build -- --configuration=production

# Stage 2: Nginx to serve Angular
FROM nginx:alpine
# Copy compiled app
COPY --from=build /app/dist/<YourAppName> /usr/share/nginx/html
# Copy SPA + proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
