# 🎬 CineTicket - Movie Ticket Booking System

A modern, user-friendly movie ticket booking platform built with **React, Vite, Tailwind CSS**, **Node.js**, **Express.js**, **MongoDB** and **Stripe** for Payment Gateway.  
This application allows users to browse movies, select showtimes, book seats, interact with an AI chatbot for support, and complete payments securely via Stripe.

---

# 🎨 Figma Design
- Check out the Figma Design for the CineTicket platform:
- **Figma Design Link**: https://www.figma.com/design/oBOTBwhVQZZ7dnaXyu691Z/Untitled?node-id=3-2&t=H7crLS7ShnGINfJD-1
  
- **User Desgin prototype**: https://www.figma.com/proto/oBOTBwhVQZZ7dnaXyu691Z/Untitled?node-id=3-2&t=H7crLS7ShnGINfJD-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A2
  
- **Admin Desgin prototype**: https://www.figma.com/proto/oBOTBwhVQZZ7dnaXyu691Z/Untitled?node-id=15-1827&t=w482Wwv8gwFyGvyd-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A2

---

## 🎥 Video Explanation

- **Watch a full walkthrough of CineTicket**:  
  [Video Walkthrough](https://drive.google.com/file/d/1cPv7LF8IAOlZp-Y4HB7tjLYokwepqe72/view?usp=drive_link)

  ---


## 🌐 Live Demo

- You can try out the live version of CineTicket below:
- **CineTicket**: (https://movie-ticket-booking-zeta-swart.vercel.app/)
- Feel free to explore the platform, browse movies, and make bookings!

---

## 👨‍💻 Demo Accounts
- **Login Accounts**:
- Regular User:
- Email: user@example.com
- Password: password
- Admin User:
- Email: admin@gmail.com
- Password: 123456
  
- **Payment Account**:
- Card Number: 4242 4242 4242 4242
- CVV: 123
- Expriy: 05/25
- Zip : 12345

---

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Movie Browsing**: Browse latest releases, upcoming movies, and search functionality
- **Seat Selection**: Interactive seat selection interface
- **Booking Management**: View and manage your bookings
- **Admin Dashboard**: Manage movies, theaters, and bookings
- **Stripe Payment Integration**: Secure online payments for bookings
- **AI Chatbot Support**: Chatbot responds to user queries and guides them through the application
- **Responsive Design**: Fully responsive interface that works on all devices

---

## 🛠 Tech Stack

- **Frontend**: React with JavaScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payments**: Stripe Payment Gateway

---

## 🧩 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Hemanths05/Movie_ticket_booking
   cd Movie_ticket_booking
   ```

2. Install dependencies for both client and server:
   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Set up environment variables:  
   Create a `.env` file inside the `server` folder and add the following.
   
    ```PORT=5000
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    JWT_EXPIRES_IN=1d
    STRIPE_SECRET_KEY=your-stripe-secret-key
    GEMINI_API_KEY=your-gemini-api-key
    ```


5. Start both servers:
   - Start backend server:
     ```bash
     cd server
     npm start
     ```
   - Start frontend client:
     ```bash
     cd client
     npm run dev
     ```

6. Open your browser and visit:  
   `http://localhost:5173`

---

## 👨‍💻 Demo Accounts

- **Regular User**:
  - Email: `user@example.com`
  - Password: `password`
- **Admin User**:
  - Email: `admin@gmail.com`
  - Password: `123456`

---

## 📂 Project Structure

### Client Side (`/client`)

```
client
│
├── dist
├── node_modules
├── public
├── src
│   ├── assets
│   ├── components
│   ├── context
│   ├── data
│   ├── pages
│   ├── services
│   ├── types
│   └── utils
│
├── index.html
├── package.json
└── vite.config.ts
```

### Server Side (`/server`)

```
server
│
├── config
├── controllers
├── models
├── node_modules
├── routes
│
├── .env
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
```

---

## 📢 Key Features 

### 🎥 Movie Browsing
- Browse latest releases and upcoming movies
- Filter movies by genre
- Search functionality
- View detailed movie information

### 🎟️ Booking Process
1. Select a movie
2. Choose showtime and theater
3. Select seats
4. Complete payment
5. Receive booking confirmation

### 🛠️ Admin Features
- Manage movies, showtimes, theaters
- View and manage all bookings
- Manage users
- Adjust system settings

### 🤖 AI Chatbot
- Integrated AI chatbot that assists users by answering common queries
- Helps guide users through movie selection, booking, and payment processes
- Improves overall user experience

### 💳 Stripe Payment
- Seamless integration with Stripe for secure payments
- Accepts major debit and credit cards
- Sends confirmation upon successful transaction
  
---

## 🤖 AI Tools Utilized
- **Gemini**: Integrated for the AI chatbot to answer user queries, enhancing the support system within the application.
- **ChatGPT**: Used during development to fix errors, debug, and optimize code, ensuring smooth functionality of the application.
- **Claude**: Utilized for creating the basic UI structure and assisting with various design and development tasks to improve the user experience.

---

## 🚀 Deployment Steps

### Frontend Deployment (Vercel)
1. Push the `client` folder to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and sign in or create an account.
3. Create a new project and link your GitHub repository.
4. Select the `client` folder as the project directory.
5. Vercel will automatically deploy your frontend, and you will get a live URL for your application.

### Backend Deployment (Render)
1. Push the `server` folder to your GitHub repository.
2. Go to [Render](https://render.com/) and sign in or create an account.
3. Create a new web service and link your GitHub repository.
4. Choose the `server` folder as the directory for the backend.
5. Set up environment variables on Render (same as in `.env` file).
6. Render will deploy your backend, and you will get a live URL for your backend API.

### Update API Calls
After deploying the backend on Render, you will need to update the API calls in the frontend to point to the deployed backend URL instead of the local one. 
1. Locate the API endpoint references in your frontend code (e.g., `axios` or `fetch` calls).
2. Replace the local API URL (`http://localhost:5000`) with the deployed backend URL from Render (e.g., `https://your-backend-url.onrender.com`).

Once both frontend and backend are deployed and the API calls are updated, you can access your application by visiting the live frontend URL and interacting with the deployed backend API.

---
