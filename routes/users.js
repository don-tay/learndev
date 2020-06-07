const express = require('express');
const { 
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
 } = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

 // Include protect middleware for protected routes
const { protect, authorise } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// all route to use protect and authorise middleware
router.use(protect);
router.use(authorise('admin'));

router.route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
