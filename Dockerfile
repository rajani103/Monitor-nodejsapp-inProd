# Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install prom-client express
EXPOSE 3000
CMD ["node", "app.js"]
