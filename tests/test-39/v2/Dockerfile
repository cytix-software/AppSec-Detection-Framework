FROM node:18-alpine

# Install openssl
RUN apk add --no-cache openssl

# Create directory for SSL certificates
RUN mkdir -p /app/ssl

# Generate self-signed certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /app/ssl/server.key \
    -out /app/ssl/server.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Expose HTTPS port
EXPOSE 443

CMD ["node", "server.js"]

