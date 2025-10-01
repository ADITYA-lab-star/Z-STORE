# Z-STORE

Z-STORE is a full-stack e-commerce platform designed for seamless online shopping and store management. The project is divided into two main parts:

- **backend**: Node.js/Express backend API for product, user, and order management.
- **frontend**: React-based frontend for customers to browse products, add items to cart, and checkout.

## Features

- Product listing, search, and filtering
- Shopping cart and checkout flow
- RESTful API backend with authentication and data storage
- Modern UI built with React and Vite

## Folder Structure

`backend/`: Backend server (Express, MongoDB)
`frontend/`: User-facing shop frontend (React)

## Getting Started


1. Clone the repository.
2. Install dependencies in each folder (`npm install`).
3. Set up environment variables in `backend/.env`.
4. Start the backend (`npm start` in `backend`).
5. Start the frontend (`npm run dev` in `frontend`).

## Deployment

### Frontend (Vercel)

- Push your code to GitHub (or another supported Git provider).
- Go to [Vercel](https://vercel.com) and import your project.
- Deploy the `frontend` folder as a Vercel project. It will get its own domain (e.g., `your-frontend.vercel.app`).
- Vercel will auto-detect React/Vite and build your app.

### Backend

- Vercel is not designed for Node.js/Express backends. Deploy your backend on platforms like Render, Railway, or Heroku.
- Set the API URL in your frontend environment variables to point to the deployed backend (not localhost).

### Notes

If your frontend app tries to access the backend using a localhost URL, it won’t work on Vercel. Use the deployed backend’s public URL.
- Make sure your `vite.config.js` and environment variables are set up for production.
- Static assets (images, etc.) should be inside the `public` folder.


