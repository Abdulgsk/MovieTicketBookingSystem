const express = require('express');
const { showTime,createShowTimes } = require('../controllers/showtimeController');

const router = express.Router();

router.get('/', showTime);       
router.post('/', createShowTimes)

module.exports = router;
