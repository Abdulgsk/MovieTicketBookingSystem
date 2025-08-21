const express = require('express');
const router = express.Router();
const {getTheaters,getTheatersById} = require('../controllers/theaterController');

router.get('/:id',getTheatersById);
router.get('/', getTheaters);
module.exports = router;
