const SkillModel = require('../models/SkillModel');

exports.createSkill = async (req, res) => {
    try {
        const { skill_name, level } = req.body;
        const skillId = await SkillModel.create({
            user_id: req.userId,
            skill_name,
            level
        });
        res.status(201).json({ message: 'Skill created successfully', id: skillId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSkills = async (req, res) => {
    try {
        const skills = await SkillModel.findByUserId(req.userId);
        res.json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { skill_name, level } = req.body;
        const updated = await SkillModel.update(id, req.userId, { skill_name, level });
        if (updated) {
            res.json({ message: 'Skill updated successfully' });
        } else {
            res.status(404).json({ message: 'Skill not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SkillModel.delete(id, req.userId);
        if (deleted) {
            res.json({ message: 'Skill deleted successfully' });
        } else {
            res.status(404).json({ message: 'Skill not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};