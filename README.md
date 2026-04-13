# SQL Marketplace Analytics System

A comprehensive online marketplace system built with a React frontend and a Flask backend. It features an advanced analytics dashboard with SQL-driven insights, product management, and a seamless shopping experience.

## 🚀 Features

- **Storefront**: Browse products with categories and ratings.
- **Admin Panel**: Add and manage products.
- **Analytics Dashboard**:
  - Sales Trends (Revenue & Order volume)
  - Top Selling Products
  - Customer Satisfaction Metrics
  - **Cohort Analysis**: Sophisticated SQL queries tracking user retention over time.
- **Responsive Design**: Modern UI built with Vanilla CSS and Lucide icons.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Axios, Lucide React, React Router.
- **Backend**: Python, Flask, Flask-CORS.
- **Database**: SQLite3.

## 📦 Project Structure

```text
dbmsp/
├── backend/            # Flask API & SQLite Database
│   ├── app.py          # Main application logic
│   ├── schema.sql      # Database schema
│   └── requirements.txt # Python dependencies
├── frontend/           # React application
│   ├── src/            # Components, Pages, and Assets
│   └── package.json    # Node.js dependencies
├── .gitignore          # Root-level ignore rules
├── LICENSE             # MIT License
└── README.md           # Project documentation
```

## ⚙️ Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application (this will initialize the database):
   ```bash
   python app.py
   ```
   *The backend will run on `http://127.0.0.1:5000`*

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
**Author**
Name: Akansha
Rollno: 2401010195
BTech CSE Core A
