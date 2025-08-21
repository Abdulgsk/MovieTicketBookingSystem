const express  = require('express');
const { createBooking, getUserBookings, getAllBookings, updateStatus } = require('../controllers/bookingController.js');

const router = express.Router();

router.put('/updateStatus/:id',updateStatus);
router.get("/",getAllBookings);
router.post("/create", createBooking);
router.get("/user/:userId", getUserBookings);


module.exports = router;
