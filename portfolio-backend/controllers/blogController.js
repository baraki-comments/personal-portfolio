const BlogModel = require('../models/BlogModel');

exports.createBlog = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const blogId = await BlogModel.create({
            user_id: req.userId,
            title,
            content,
            tags
        });
        res.status(201).json({ message: 'Blog created successfully', id: blogId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.findByUserId(req.userId);
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.findAll();
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await BlogModel.findById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;
        const updated = await BlogModel.update(id, req.userId, { title, content, tags });
        if (updated) {
            res.json({ message: 'Blog updated successfully' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await BlogModel.delete(id, req.userId);
        if (deleted) {
            res.json({ message: 'Blog deleted successfully' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};