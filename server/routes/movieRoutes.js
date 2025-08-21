const express = require('express');
const { getAllMovies, getMovieById, deleteMovie, updateMovie, addMovies } = require('../controllers/movieController');

const router = express.Router();

router.post('/add',addMovies),
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.delete('/delete/:id', deleteMovie);
router.put('/update/:id', updateMovie);

module.exports = router;
