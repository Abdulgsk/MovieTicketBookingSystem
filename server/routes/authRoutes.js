const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteUser, editUser } = require('../controllers/authController');

const router = express.Router();

router.put('/edit/:email', editUser);
router.delete('/:email', deleteUser);
router.get('/', getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
