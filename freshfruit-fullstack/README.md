# FreshFruit — Online Fruit Shopping Website

Full-stack starter project using React + Vite (frontend), Node.js + Express (backend), and MongoDB (database).

## Requirements
- Node.js 18+
- MongoDB local server OR MongoDB Atlas connection string

## 1. Setup backend
Open a terminal:
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and set `MONGO_URI`. Example local MongoDB:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/freshfruit
JWT_SECRET=change_this_to_a_long_random_secret
```
Run:
```bash
npm run dev
```
Backend API: http://localhost:5000/api/health

## 2. Setup frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually http://localhost:5173).

## Features included
- Responsive fruit shop UI
- Product listing from backend API
- Search and category filters
- Add to cart, quantity changes, remove items (cart saved in localStorage)
- Product CRUD API (create/update/delete endpoints)
- Sample product seed endpoint for local development

## Seed sample fruits
With the backend running, open a third terminal and run:
```bash
cd backend
npm run seed
```
This adds any missing sample fruits to MongoDB. Existing products, prices and stock are preserved; duplicate fruit names are not inserted again. The starter list includes 15 fruits with picture URLs.

## API endpoints
- `GET /api/health` — server health
- `GET /api/products` — list products (supports `?search=apple&category=Fresh%20Fruits`)
- `GET /api/products/:id` — one product
- `POST /api/products` — create product
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product

**Note:** This is a learning starter, not a production-ready store. Admin authorization, real payments, order persistence, and secure user authentication should be added before public deployment. Never commit `.env` to GitHub.
