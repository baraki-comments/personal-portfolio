const Message = require('../models/Message');

const createMessage = async (req, res) => {
    try {
        const message = await Message.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });
        res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({ order: [['created_at', 'DESC']] });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        await message.destroy();
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createMessage, getAllMessages, deleteMessage };