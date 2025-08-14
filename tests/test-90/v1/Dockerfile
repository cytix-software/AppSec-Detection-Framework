FROM php:8.2-apache
RUN apt-get update && apt-get install -y libzip-dev \
    && docker-php-ext-install zip
WORKDIR /var/www/html
COPY index.php ./
EXPOSE 80