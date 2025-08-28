FROM php:5.6-apache

# Fix apt sources for old Debian and remove stretch-updates
RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list \
 && sed -i 's|http://security.debian.org/debian-security|http://archive.debian.org/debian-security|g' /etc/apt/sources.list \
 && sed -i '/stretch-updates/d' /etc/apt/sources.list \
 && apt-get update -o Acquire::AllowInsecureRepositories=true -o Acquire::AllowUnsignedRepositories=true \
 && apt-get install -y --allow-unauthenticated libxml2-dev

RUN docker-php-ext-install dom

COPY index.php /var/www/html/index.php

EXPOSE 80