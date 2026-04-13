import sqlite3
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATABASE = os.path.join(os.path.dirname(__file__), 'database.db')
SCHEMA = os.path.join(os.path.dirname(__file__), 'schema.sql')

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DATABASE):
        with open(SCHEMA, 'r') as f:
            schema_content = f.read()
        conn = get_db()
        conn.executescript(schema_content)
        conn.commit()
        conn.close()
        print("Database re-initialized with expanded schema.")

@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db()
    products = conn.execute("""
        SELECT p.*, c.name as category_name, s.name as seller_name, 
        (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as avg_rating
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN sellers s ON p.seller_id = s.id
    """).fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in products])

@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db()
    categories = conn.execute("SELECT * FROM categories").fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in categories])

@app.route('/api/sellers', methods=['GET'])
def get_sellers():
    conn = get_db()
    sellers = conn.execute("SELECT * FROM sellers").fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in sellers])

# --- NEW ANALYTICS ENDPOINTS ---

@app.route('/api/analytics/sales-trends', methods=['GET'])
def get_sales_trends():
    conn = get_db()
    # Query sales by month
    trends = conn.execute("""
        SELECT order_month, SUM(total_amount) as revenue, COUNT(id) as order_count
        FROM orders 
        GROUP BY order_month 
        ORDER BY order_month ASC
    """).fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in trends])

@app.route('/api/analytics/top-products', methods=['GET'])
def get_top_products():
    conn = get_db()
    # Identify top selling products
    top = conn.execute("""
        SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.price) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY p.id
        ORDER BY total_sold DESC
        LIMIT 5
    """).fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in top])

@app.route('/api/analytics/satisfaction', methods=['GET'])
def get_satisfaction():
    conn = get_db()
    # Calculate customer satisfaction scores per product
    stats = conn.execute("""
        SELECT p.name, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        GROUP BY p.id
        HAVING review_count > 0
        ORDER BY avg_rating DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in stats])

@app.route('/api/order', methods=['POST'])
def place_order():
    data = request.json
    items = data.get('items', [])
    total = data.get('total', 0)
    user_id = data.get('user_id', 1)  # Default to user 1 (Alice) for demo
    month = "2026-04" # Current month for trends
    
    if not items:
        return jsonify({"error": "No items in order"}), 400
        
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO orders (user_id, total_amount, order_month) VALUES (?, ?, ?)", (user_id, total, month))
        order_id = cur.lastrowid
        
        for item in items:
            cur.execute("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                        (order_id, item['id'], item['quantity'], item['price']))
            # Reduce stock
            cur.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (item['quantity'], item['id']))
            
        conn.commit()
        return jsonify({"success": True, "order_id": order_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/analytics/cohorts', methods=['GET'])
def get_cohorts():
    conn = get_db()
    # Sophisticated Cohort Analysis Query
    # Part 1: Define User Cohorts by Signup Month
    # Part 2: Track Retention in Subsequent Months
    query = """
    WITH cohort_users AS (
        SELECT id, signup_month FROM users
    ),
    user_orders AS (
        SELECT user_id, order_month FROM orders
    ),
    cohort_retention AS (
        SELECT 
            cu.signup_month,
            uo.order_month,
            COUNT(DISTINCT uo.user_id) as retained_users
        FROM cohort_users cu
        JOIN user_orders uo ON cu.id = uo.user_id
        GROUP BY cu.signup_month, uo.order_month
    )
    SELECT * FROM cohort_retention ORDER BY signup_month, order_month;
    """
    cohorts = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in cohorts])

@app.route('/api/admin/products', methods=['POST'])
def add_product():
    data = request.json
    conn = get_db()
    conn.execute("INSERT INTO products (name, description, price, image_url, category_id, seller_id, stock) VALUES (?,?,?,?,?,?,?)",
                 (data['name'], data['description'], data['price'], data['image_url'], data['category_id'], data['seller_id'], data['stock']))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
