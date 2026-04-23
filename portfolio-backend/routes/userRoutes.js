const express = require('express');
const multer = require('multer');
const path = require('path');
const { getUserProfile, updateUserProfile, getUserDashboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/profile/:id', getUserProfile);
router.put('/profile', protect, upload.fields([
    { name: 'profile_photo' },
    { name: 'cv' }
]), updateUserProfile);
router.get('/dashboard', protect, getUserDashboard);

module.exports = router;