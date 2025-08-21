const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const User = require('../models/User');

const getAdminDashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    const totalRevenueAgg = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const activeMovies = await Movie.countDocuments({ comingSoon: false });
    const activeUsers = await User.countDocuments();

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'email');

    const recent = recentBookings.map(b => ({
      id: b.bookingId,
      movieTitle: b.movieTitle,
      user: b.userId?.email || 'N/A',
      date: b.createdAt,
      seats: b.selectedSeats.length,
      amount: b.totalAmount
    }));

    res.json({
      stats: {
        totalBookings,
        todayBookings,
        totalRevenue,
        activeMovies,
        activeUsers
      },
      recentBookings: recent
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {getAdminDashboard};