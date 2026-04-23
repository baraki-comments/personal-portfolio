const Skill = require('../models/Skill');

const getUserSkills = async (req, res) => {
    try {
        const skills = await Skill.findAll({ where: { user_id: req.params.userId } });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSkill = async (req, res) => {
    try {
        const skill = await Skill.create({
            user_id: req.user.id,
            skill_name: req.body.skill_name,
            level: req.body.level
        });
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByPk(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        await skill.update(req.body);
        res.json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByPk(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        await skill.destroy();
        res.json({ message: 'Skill deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserSkills, createSkill, updateSkill, deleteSkill };