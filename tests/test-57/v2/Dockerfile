FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /usr/src/app/uploads
EXPOSE 80
CMD [ "node", "server.js" ]