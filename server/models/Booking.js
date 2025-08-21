const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  paymentId: { type: String, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieTitle: { type: String, required: true }, 
  showtime: {
    date: String,
    time: String,
  },
  theater: {
    name: String,
    location: String,
  },
  selectedSeats: [String],
  totalAmount: Number,
  status: { type: String, required: true, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
