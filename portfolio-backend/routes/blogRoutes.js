const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, blogController.createBlog);
router.get('/my-blogs', authMiddleware, blogController.getMyBlogs);
router.get('/', blogController.getAllBlogs); // public
router.get('/:id', blogController.getBlogById);
router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;
