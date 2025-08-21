const express = require('express');
const Showtime = require('../models/Showtime');

const showTime = async (req, res) => {
  try {
    const { movieId } = req.query;
    const showtimes = await Showtime.find({ movieId }).populate('theaterId');
    res.json(showtimes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching showtimes');
  }
};

const createShowTimes = async (req, res) => {
  try {
    const showtimes = req.body.showtimes;
    const inserted = await Showtime.insertMany(showtimes);
    res.status(201).json(inserted);
  } catch (err) {
    console.error('Error saving showtimes:', err);
    res.status(500).json({ message: 'Failed to save showtimes' });
  }
};

module.exports = { showTime, createShowTimes };
