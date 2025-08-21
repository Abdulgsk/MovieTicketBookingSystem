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

// CORS configuration to support credentials (cookies, auth headers)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser tools (no origin) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed for this origin: ' + origin), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

//health check and status
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('health', (req, res) => {
    res.send('OK');
})


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
