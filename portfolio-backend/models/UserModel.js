const db = require('../config/db');

class UserModel {
    static async create(userData) {
        const { name, email, password } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        return result.insertId;
    }
    
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }
    
    static async findById(id) {
        const [rows] = await db.execute('SELECT id, name, email, profile_photo, bio, education, cv_url, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }
    
    static async updateProfile(id, updateData) {
        const { name, bio, education, profile_photo, cv_url } = updateData;
        const [result] = await db.execute(
            'UPDATE users SET name = ?, bio = ?, education = ?, profile_photo = ?, cv_url = ? WHERE id = ?',
            [name, bio, education, profile_photo, cv_url, id]
        );
        return result.affectedRows;
    }
}

module.exports = UserModel;