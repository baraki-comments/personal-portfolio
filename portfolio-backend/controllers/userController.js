const User = require('../models/User');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Skill = require('../models/Skill');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const { name, bio, education, phone, location, github, linkedin } = req.body;
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (education) user.education = education;
        if (phone) user.phone = phone;
        if (location) user.location = location;
        if (github) user.github = github;
        if (linkedin) user.linkedin = linkedin;
        
        if (req.files) {
            if (req.files.profile_photo) user.profile_photo = req.files.profile_photo[0].filename;
            if (req.files.cv) user.cv_url = req.files.cv[0].filename;
        }
        
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserDashboard = async (req, res) => {
    try {
        const projects = await Project.findAll({ where: { user_id: req.user.id }, order: [['created_at', 'DESC']] });
        const blogs = await Blog.findAll({ where: { user_id: req.user.id }, order: [['created_at', 'DESC']] });
        const skills = await Skill.findAll({ where: { user_id: req.user.id } });
        res.json({ projects, blogs, skills });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, getUserDashboard };