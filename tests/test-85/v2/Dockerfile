FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# Enable OpenSSL legacy algorithms (DES, etc.)
ENV NODE_OPTIONS=--openssl-legacy-provider

EXPOSE 80
CMD ["node", "server.js"]
