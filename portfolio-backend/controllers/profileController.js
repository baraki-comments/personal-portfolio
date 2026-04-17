const UserModel = require('../models/UserModel');
const path = require('path');
const fs = require('fs');

exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, education } = req.body;
        const userId = req.userId;
        
        let profile_photo = null;
        let cv_url = null;
        
        if (req.files) {
            if (req.files.profile_photo) {
                profile_photo = `/uploads/${req.files.profile_photo[0].filename}`;
            }
            if (req.files.cv) {
                cv_url = `/uploads/${req.files.cv[0].filename}`;
            }
        }
        
        const updated = await UserModel.updateProfile(userId, {
            name,
            bio,
            education,
            profile_photo,
            cv_url
        });
        
        const user = await UserModel.findById(userId);
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};