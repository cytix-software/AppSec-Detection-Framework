FROM php:8.2-apache
WORKDIR /var/www/html
COPY index.php ./
COPY .htaccess ./

# Enable SSI (Server Side Includes)
RUN a2enmod include

EXPOSE 80 