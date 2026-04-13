CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    rating REAL DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    signup_month TEXT, -- Format YYYY-MM for cohort analysis
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category_id INTEGER,
    seller_id INTEGER,
    stock INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (seller_id) REFERENCES sellers (id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'completed',
    order_month TEXT, -- Format YYYY-MM for trends
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Seed Categories
INSERT OR IGNORE INTO categories (name) VALUES ('Electronics'), ('Home'), ('Books'), ('Fashion');

-- Seed Sellers
INSERT OR IGNORE INTO sellers (name, email, rating) VALUES 
('FutureTech', 'contact@futuretech.com', 4.9),
('GigaStore', 'sales@gigastore.com', 4.7),
('EcoLiving', 'hello@ecoliving.com', 4.8);

-- Seed Users (with varied signup dates for cohort analysis)
INSERT OR IGNORE INTO users (username, email, signup_month) VALUES 
('Alice', 'alice@example.com', '2026-01'),
('Bob', 'bob@example.com', '2026-01'),
('Charlie', 'charlie@example.com', '2026-02'),
('David', 'david@example.com', '2026-02'),
('Eve', 'eve@example.com', '2026-03'),
('Frank', 'frank@example.com', '2026-03');

-- Seed Products
INSERT OR IGNORE INTO products (name, description, price, image_url, category_id, seller_id, stock) VALUES 
('Quantum X1 Drone', '4K Camera, 30min flight.', 799.99, 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9', 1, 1, 10),
('AeroFlow Air Purifier', 'HEPA filter, smart monitor.', 149.99, 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a', 2, 3, 25),
('Obsidian Mouse', 'RGB, 25K DPI.', 59.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', 1, 2, 50),
('Leather Journal', 'Handcrafted.', 34.50, 'https://images.unsplash.com/photo-1544816155-12df9643f363', 3, 3, 30),
('Pulse Headphones', 'Noise-cancelling.', 199.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 1, 1, 15);

-- Seed Synthetic Orders (for Trends and Cohort Analysis)
-- Cohort 2026-01: Alice and Bob
INSERT INTO orders (user_id, total_amount, order_month) VALUES 
(1, 800.00, '2026-01'), (2, 150.00, '2026-01'), -- Alice & Bob first orders
(1, 60.00, '2026-02'), (2, 200.00, '2026-02'),   -- Alice & Bob return in Feb
(1, 35.00, '2026-03');                          -- Alice returns in Mar

-- Cohort 2026-02: Charlie and David
INSERT INTO orders (user_id, total_amount, order_month) VALUES 
(3, 1000.00, '2026-02'), (4, 45.00, '2026-02'), -- Charlie & David first orders
(3, 99.00, '2026-03');                          -- Charlie returns in Mar

-- Cohort 2026-03: Eve and Frank
INSERT INTO orders (user_id, total_amount, order_month) VALUES 
(5, 500.00, '2026-03'), (6, 120.00, '2026-03'); -- Eve & Frank first orders

-- Seed Reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES 
(1, 1, 5, 'Absolutely incredible tech!'),
(1, 3, 4, 'Great value for money.'),
(2, 2, 5, 'Silent and effective.'),
(5, 5, 2, 'Battery life could be better.');
