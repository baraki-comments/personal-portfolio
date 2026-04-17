const db = require('../config/db');

class SkillModel {
    static async create(skillData) {
        const { user_id, skill_name, level } = skillData;
        const [result] = await db.execute(
            'INSERT INTO skills (user_id, skill_name, level) VALUES (?, ?, ?)',
            [user_id, skill_name, level]
        );
        return result.insertId;
    }
    
    static async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM skills WHERE user_id = ?', [userId]);
        return rows;
    }
    
    static async update(id, userId, skillData) {
        const { skill_name, level } = skillData;
        const [result] = await db.execute(
            'UPDATE skills SET skill_name = ?, level = ? WHERE id = ? AND user_id = ?',
            [skill_name, level, id, userId]
        );
        return result.affectedRows;
    }
    
    static async delete(id, userId) {
        const [result] = await db.execute('DELETE FROM skills WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows;
    }
}

module.exports = SkillModel;