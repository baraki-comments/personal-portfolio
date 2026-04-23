const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null,'uploads/'),
  filename: (req,file,cb) => cb(null, Date.now()+'-'+Math.round(Math.random()*1E9)+path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 }, fileFilter: (req,file,cb) => { const allowed = /jpeg|jpg|png|gif/; const ext = allowed.test(path.extname(file.originalname).toLowerCase()); const mime = allowed.test(file.mimetype); ext && mime ? cb(null,true) : cb(new Error('Only images')); } });

router.post('/', authMiddleware, upload.single('image'), projectController.createProject);
router.get('/', projectController.getProjects); // public
router.put('/:id', authMiddleware, upload.single('image'), projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;
