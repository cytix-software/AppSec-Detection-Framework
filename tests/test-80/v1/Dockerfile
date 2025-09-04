# Dockerfile for CWE-296 test case (PHP + cURL)
FROM php:8.2-apache
RUN apt-get update && apt-get install -y libcurl4-openssl-dev \
    && docker-php-ext-install curl
COPY index.php /var/www/html/index.php
