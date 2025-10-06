FROM node:18-alpine

# Required for libxmljs
RUN apk add --no-cache python3 g++ make

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD ["node", "server.js"]
