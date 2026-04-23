const Blog = require('../models/Blog');

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({ order: [['created_at', 'DESC']] });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBlog = async (req, res) => {
    try {
        let tags = req.body.tags;
        if (typeof tags === 'string') {
            try { tags = JSON.parse(tags); } catch { tags = tags.split(',').map(t => t.trim()); }
        }
        const blog = await Blog.create({
            user_id: req.user.id,
            title: req.body.title,
            content: req.body.content,
            tags: JSON.stringify(tags)
        });
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        await blog.update(req.body);
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        await blog.destroy();
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllBlogs, createBlog, updateBlog, deleteBlog };