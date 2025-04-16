FROM php:8.2-apache
WORKDIR /var/www/html
COPY index.php ./
RUN mkdir -p /var/www/html/uploads && \
    chown -R www-data:www-data /var/www/html/uploads && \
    chmod -R 755 /var/www/html/uploads
EXPOSE 80