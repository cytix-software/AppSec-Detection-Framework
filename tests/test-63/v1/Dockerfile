FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Enable .htaccess overrides
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf
# Add .htaccess to enable directory listing
RUN echo 'Options +Indexes' > .htaccess

# Copy application files
COPY home.php ./

# Expose port 80
EXPOSE 80