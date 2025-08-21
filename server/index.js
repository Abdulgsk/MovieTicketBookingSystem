const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes.js');
const theaterRoutes = require('./routes/theaterRoutes.js');
const showTimeRoutes = require('./routes/showtimeRoutes.js');
const paymentRoutes = require('./routes/payment');
const bookingRoutes = require('./routes/bookings.js');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoute = require('./routes/chatbot.js');

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/admin/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/showtimes', showTimeRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoute); 



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
