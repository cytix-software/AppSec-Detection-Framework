FROM php:8.2-apache

RUN docker-php-ext-install pdo pdo_mysql

COPY index.php /var/www/html/index.php

EXPOSE 80
