CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  details VARCHAR(255) NOT NULL
);

INSERT INTO invoices (id, user_id, amount, details) VALUES
  (1, 101, 150.00, 'Invoice for John Doe'),
  (2, 102, 200.50, 'Invoice for Jane Smith'),
  (3, 101,  50.25, 'Another invoice for John Doe'),
  (4, 103, 1000.00, 'Admin-only invoice')
ON DUPLICATE KEY UPDATE
  user_id=VALUES(user_id),
  amount=VALUES(amount),
  details=VALUES(details);