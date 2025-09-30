FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund --prefer-offline --no-optional
COPY . .
EXPOSE 80
CMD ["node", "server.js"]


