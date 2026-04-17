const ProjectModel = require('../models/ProjectModel');

exports.createProject = async (req, res) => {
    try {
        const { title, description, technologies, github_link, demo_link } = req.body;
        let image = null;
        
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }
        
        const projectId = await ProjectModel.create({
            user_id: req.userId,
            title,
            description,
            technologies,
            github_link,
            demo_link,
            image
        });
        
        res.status(201).json({ message: 'Project created successfully', id: projectId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.findByUserId(req.userId);
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, technologies, github_link, demo_link } = req.body;
        let image = null;
        
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }
        
        const updated = await ProjectModel.update(id, req.userId, {
            title,
            description,
            technologies,
            github_link,
            demo_link,
            image
        });
        
        if (updated) {
            res.json({ message: 'Project updated successfully' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ProjectModel.delete(id, req.userId);
        if (deleted) {
            res.json({ message: 'Project deleted successfully' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};