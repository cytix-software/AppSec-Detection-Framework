FROM node:18-alpine
WORKDIR /app
COPY package.json index.js index.html ./
RUN npm install
COPY . .
EXPOSE 80
CMD ["node", "index.js"] 