FROM httpd:2.4-alpine

RUN apk add --no-cache nodejs npm
COPY backend.js /backend.js
COPY httpd.conf /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["sh", "-c", "httpd-foreground & node /backend.js"]