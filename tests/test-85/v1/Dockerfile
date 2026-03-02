FROM php:8.2-apache
WORKDIR /var/www/html

# Enable OpenSSL legacy provider so DES works
COPY openssl-legacy.cnf /etc/ssl/openssl-legacy.cnf
ENV OPENSSL_CONF=/etc/ssl/openssl-legacy.cnf

COPY index.php ./
EXPOSE 80
