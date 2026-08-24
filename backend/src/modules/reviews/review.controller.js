const Review = require('./review.model');
const User = require('../users/user.model');

exports.createReview = async (req, res) => {
  try {
    //Only members post reviews
    if (!req.user || req.user.role !== 'member') {
      return res.status(403).json({ message: 'Members only' });
    }

    const { text, rating } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ message: 'Review text is required' });
    }

    const reviewData = {
      author: req.user.id,
      text: text.trim(),
      rating: rating ? Number(rating) : undefined,
    };

    //uploaded images
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imagePaths = req.files.map(f => `/uploads/reviews/${f.filename}`);
      reviewData.images = imagePaths;
    }

    const review = new Review(reviewData);

    await review.save();

    const populated = await Review.findById(review._id).populate('author', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).populate('author', 'name');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const reviews = await Review.find({ author: req.user.id }).sort({ createdAt: -1 }).populate('author', 'name');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    //delete review owner or an admin
    if (String(review.author) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });

    const { text, rating } = req.body;
    if (text && typeof text === 'string') review.text = text.trim();
    if (rating) review.rating = Number(rating);

    //removeImages may be sent as JSON string or form values
    let removeImages = [];
    if (req.body.removeImages) {
      try {
        if (typeof req.body.removeImages === 'string') {
          // could be JSON or single value
          const val = req.body.removeImages;
          if (val.trim().startsWith('[')) removeImages = JSON.parse(val);
          else removeImages = [val];
        } else if (Array.isArray(req.body.removeImages)) {
          removeImages = req.body.removeImages;
        }
      } catch (e) {
        removeImages = [];
      }
    }

    //delete any requested images and filter them out
    if (removeImages.length > 0 && review.images && Array.isArray(review.images)) {
      const fs = require('fs');
      const path = require('path');
      for (const imgPath of removeImages) {
        const idx = review.images.indexOf(imgPath);
        if (idx !== -1) {
          try {
            const rel = imgPath.replace(/^\//, '');
            const full = path.join(__dirname, '..', '..', rel);
            if (fs.existsSync(full)) fs.unlinkSync(full);
          } catch (e) {}
          review.images.splice(idx, 1);
        }
      }
    }

    //if new files provided, append them to images
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      review.images = review.images || [];
      const imagePaths = req.files.map(f => `/uploads/reviews/${f.filename}`);
      //max 5 images
      review.images = review.images.concat(imagePaths).slice(0, 5);
    }

    await review.save();
    const populated = await Review.findById(review._id).populate('author', 'name');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    // defensive: determine author id value
    const authorId = review.author && review.author._id ? String(review.author._id) : String(review.author);
    const requesterId = req.user && (req.user.id || req.user._id) ? String(req.user.id || req.user._id) : null;

    if (!requesterId) console.warn('deleteReview: requester id missing on req.user', req.user);

    //allow deletion by the review owner or an admin
    if (authorId !== requesterId && req.user.role !== 'admin') {
      console.warn('deleteReview: unauthorized', { reviewId: req.params.id, authorId, requesterId, role: req.user.role });
      return res.status(403).json({ message: 'Not allowed' });
    }

    try {
      if (review.images && Array.isArray(review.images) && review.images.length > 0) {
        const fs = require('fs');
        const path = require('path');
        for (const imgPath of review.images) {
          try {
            const rel = imgPath.replace(/^\//, '');
            const full = path.join(__dirname, '..', '..', rel);
            if (fs.existsSync(full)) fs.unlinkSync(full);
          } catch (e) {
            console.warn('deleteReview: failed to unlink image', imgPath, e && e.message);
          }
        }
      }

      await Review.findByIdAndDelete(review._id);
      return res.json({ message: 'Deleted', id: req.params.id });
    } catch (e) {
      console.error('deleteReview: failed to remove review', e);
      return res.status(500).json({ message: 'Failed to delete review' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
