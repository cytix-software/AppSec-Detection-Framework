FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN touch debug.log && chmod 666 debug.log
EXPOSE 80
CMD ["node", "server.js"]
