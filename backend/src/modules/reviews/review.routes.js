const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');

//list reviews
router.get('/', reviewController.getReviews);

//5 image files under field name 'images'
router.post('/', auth, upload.array('images', 5), reviewController.createReview);

//get current user's reviews
router.get('/me', auth, reviewController.getMyReviews);

//update a review (owner only)
router.put('/:id', auth, upload.array('images', 5), reviewController.updateReview);

//delete a review (owner only)
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
