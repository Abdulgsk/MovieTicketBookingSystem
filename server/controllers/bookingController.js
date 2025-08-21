const Booking = require('../models/Booking.js');
const mongoose = require('mongoose');

const createBooking = async (req, res) => {
  try {
    const {
      bookingId,
      paymentId,
      userId,
      movieTitle,
      showtime,
      theater,
      selectedSeats,
      totalAmount
    } = req.body;

    const newBooking = new Booking({
      bookingId,
      paymentId,
      userId,
      movieTitle,
      showtime,
      theater,
      selectedSeats,
      totalAmount
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid booking ID' });
  }

  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: id }, 
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateStatus,
  createBooking,
  getUserBookings,
  getAllBookings
};
