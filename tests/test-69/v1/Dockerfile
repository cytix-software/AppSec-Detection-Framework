FROM php:8.2-apache
WORKDIR /var/www/html

# Install SQLite3 development libraries and PHP SQLite extension
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    sqlite3 \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create SQLite database with sample data
RUN echo "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, email TEXT);" > /tmp/setup.sql && \
    echo "INSERT INTO users (id, username, email) VALUES (1, 'admin', 'admin@example.com');" >> /tmp/setup.sql && \
    echo "INSERT INTO users (id, username, email) VALUES (2, 'john_doe', 'john@example.com');" >> /tmp/setup.sql && \
    echo "INSERT INTO users (id, username, email) VALUES (3, 'jane_smith', 'jane@example.com');" >> /tmp/setup.sql && \
    echo "INSERT INTO users (id, username, email) VALUES (4, 'bob_wilson', 'bob@example.com');" >> /tmp/setup.sql && \
    echo "INSERT INTO users (id, username, email) VALUES (5, 'alice_brown', 'alice@example.com');" >> /tmp/setup.sql

# Initialize SQLite database
RUN sqlite3 /var/www/html/users.db < /tmp/setup.sql && \
    chown www-data:www-data /var/www/html/users.db

COPY index.php ./
EXPOSE 80 