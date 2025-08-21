const Theater = require('../models/Theater');

const getTheaters = async (req, res) => {
  try {
    const city = req.query.city;
    const query = city ? { city } : {};
    const theaters = await Theater.find(query);
    res.json(theaters);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching theaters' });
  }
};

const getTheatersById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) return res.status(404).json({ message: 'Theater not found' });
    res.json(theater);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {getTheaters,getTheatersById};
