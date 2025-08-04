FROM php:8.2-apache

# Copy application files
COPY . /var/www/html/

# Ensure uploads directory exists and is writable
RUN mkdir -p /var/www/html/uploads && chmod 777 /var/www/html/uploads

# Expose port 80
EXPOSE 80
