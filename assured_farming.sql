-- -----------------------------------------------------
-- DATABASE CREATION
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS assured_contract_farming;
USE assured_contract_farming;

-- -----------------------------------------------------
-- USERS TABLE
-- -----------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('FARMER', 'BUYER', 'ADMIN') NOT NULL,
    address TEXT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- PRODUCTS TABLE
-- -----------------------------------------------------
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    buyer_id INT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    quantity DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- CONTRACTS TABLE
-- -----------------------------------------------------
CREATE TABLE contracts (
    contract_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    crop VARCHAR(100),
    status ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- PAYMENTS TABLE
-- -----------------------------------------------------
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('BANK_TRANSFER', 'UPI', 'CASH', 'OTHER'),
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    FOREIGN KEY (contract_id) REFERENCES contracts(contract_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- INDEXES (for better performance)
-- -----------------------------------------------------
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_product_farmer ON products(farmer_id);
CREATE INDEX idx_product_buyer ON products(buyer_id);
CREATE INDEX idx_contract_farmer ON contracts(farmer_id);
CREATE INDEX idx_contract_buyer ON contracts(buyer_id);
CREATE INDEX idx_payment_contract ON payments(contract_id);

-- -----------------------------------------------------
-- SAMPLE DATA (for quick testing)
-- -----------------------------------------------------
INSERT INTO users (name, email, password, phone, role, address, status)
VALUES 
('John Farmer', 'john@farm.com', 'password123', '1234567890', 'FARMER', 'Village A', 'ACTIVE'),
('Alice Buyer', 'alice@market.com', 'password456', '0987654321', 'BUYER', 'City B', 'ACTIVE');

-- -----------------------------------------------------
-- SAMPLE PRODUCT (farmer_id = 1)
-- -----------------------------------------------------
INSERT INTO products (farmer_id, name, description, category, quantity, price)
VALUES 
(1, 'Tomatoes', 'Fresh organic tomatoes', 'Vegetable', 100, 20.00);

-- -----------------------------------------------------
-- SAMPLE CONTRACT (buyer_id = 2, farmer_id = 1, product_id = 1)
-- -----------------------------------------------------
INSERT INTO contracts (product_id, buyer_id, farmer_id, quantity, price, crop, status, start_date, end_date)
VALUES 
(1, 2, 1, 50, 18.50, 'Tomatoes', 'ACTIVE', '2025-10-01', '2025-12-01');

-- -----------------------------------------------------
-- SAMPLE PAYMENT (contract_id = 1)
-- -----------------------------------------------------
INSERT INTO payments (contract_id, amount, payment_method, status)
VALUES 
(1, 925.00, 'BANK_TRANSFER', 'COMPLETED');

-- -----------------------------------------------------
-- VIEW DATA
-- -----------------------------------------------------
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM contracts;
SELECT * FROM payments;
