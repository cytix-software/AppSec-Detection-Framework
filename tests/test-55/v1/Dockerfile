FROM php:8.2-apache

COPY . /var/www/html/

# Ensure the debug log file is writable
RUN touch /var/www/html/debug.log && \
    chmod 666 /var/www/html/debug.log

EXPOSE 80 