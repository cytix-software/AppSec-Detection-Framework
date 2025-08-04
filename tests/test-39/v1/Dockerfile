FROM php:8.2-apache

# Enable SSL module
RUN a2enmod ssl

# Create directory for SSL certificates
RUN mkdir -p /etc/apache2/ssl

# Generate self-signed certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/server.key \
    -out /etc/apache2/ssl/server.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Copy SSL configuration
COPY ssl.conf /etc/apache2/sites-available/default-ssl.conf
RUN a2ensite default-ssl

WORKDIR /var/www/html
COPY index.php ./

# Expose HTTPS port
EXPOSE 443