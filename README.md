# StyleSense - AI-Powered MERN Analytics Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC)

> **"Not just a shop, but a Business Intelligence tool."**

**StyleSense** is a full-stack e-commerce application that bridges the gap between modern shopping experiences and data-driven business management. Beyond standard CRUD operations, it features a **Predictive Analytics Engine** that forecasts revenue and flags low-stock risks in real-time.

---

## 🚀 Key Features

### 🧠 Intelligent Admin Dashboard
*   **Revenue Forecasting**: Uses **Linear Regression algorithms** to analyze historical sales data and predict next week's revenue.
*   **Inventory Risk Alerts**: Automatically detects "high-velocity" items that are at risk of stocking out based on sales trends, not just absolute numbers.
*   **Visual Data**: Interactive charts powered by `Recharts` for visualizing sales by category and top-performing products.

### 🛍️ Premium Shopping Experience
*   **Optimistic UI**: Instant interactions for "Add to Cart" and "Wishlist" using React Context API.
*   **Masonry Layout**: A dynamic, Pinterest-style product grid that adapts to any screen size.
*   **Smart Search & Filtering**: Client-side filtering for instant results by category, price, and color.

### 🛡️ Robust Backend Architecture
*   **Atomic Inventory Management**: Ensures stock is deducted instantly and accurately upon order placement to prevent overselling.
*   **Secure Authentication**: JWT-based stateless authentication with secure cookie/header management.
*   **RESTful API**: Clean, documented endpoints for scalable frontend integration.

---

## 🛠️ Tech Stack

| Component | Technology | Why? |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Fast HMR and efficient building. |
| **Styling** | Tailwind CSS | Utility-first CSS for rapid, responsive UI development. |
| **State** | React Context + Hooks | Lightweight global state management without Redux bloat. |
| **Backend** | Node.js + Express | Non-blocking I/O for handling concurrent requests. |
| **Database** | MongoDB + Mongoose | Flexible schema for complex product attributes and order nesting. |
| **Analytics** | `simple-statistics` | For implementing regression and statistical analysis. |

---

## 📸 Screenshots

*(Add your screenshots here)*

| **Analytics Dashboard** | **Shop Interface** |
|:---:|:---:|
| ![Dashboard Mockup](client/public/placeholder.png) | ![Shop Mockup](client/public/placeholder.png) |
| *Real-time forecasting and risk alerts* | *Clean, responsive masonry grid* |

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Dilshan118/StyleSense-MERN-Analytics.git
    cd StyleSense-MERN-Analytics
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd backend
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Seed Data (Optional)**
    Populate the database with realistic demo data for analytics:
    ```bash
    cd backend
    node seedAnalytics.js
    node seedRisks.js
    ```

5.  **Run the App**
    ```bash
    # Run Backend (http://localhost:5001)
    cd backend
    npm run dev

    # Run Frontend (http://localhost:5173)
    cd client
    npm run dev
    ```

---

## 🔮 Future Improvements
*   **AI Recommendations**: Implement collaborative filtering to suggest products based on user history.
*   **Payment Gateway**: Integrate Stripe for real credit card processing.
*   **Dockerization**: Containerize the application for easy deployment.

---

## 👨‍💻 Author

**Dilshan Rajapakshe**
*   [LinkedIn](https://www.linkedin.com/in/your-profile)
*   [GitHub](https://github.com/Dilshan118)

---
*Built with ❤️ for the MERN Stack Community.*
