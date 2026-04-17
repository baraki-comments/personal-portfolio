const MessageModel = require('../models/MessageModel');

exports.createMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const messageId = await MessageModel.create({ name, email, message });
        res.status(201).json({ message: 'Message sent successfully', id: messageId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await MessageModel.findAll();
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await MessageModel.delete(id);
        if (deleted) {
            res.json({ message: 'Message deleted successfully' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};