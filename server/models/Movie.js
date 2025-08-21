const mongoose = require('mongoose');
const { Schema } = mongoose;

const MovieSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  posterUrl: { type: String, required: true },
  backdropUrl: { type: String, required: true },
  rating: { type: Number, required: true },
  duration: { type: String, required: true },
  language: { type: String, required: true },
  genres: { type: [String], required: true },
  releaseDate: { type: String, required: true },
  isNewRelease: { type: Boolean, default: false },
  comingSoon: { type: Boolean, default: false },
  availableCities: { type: [String], required: true },
});

module.exports = mongoose.model('Movie', MovieSchema);
