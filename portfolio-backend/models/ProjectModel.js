const db = require('../config/db');

class ProjectModel {
    static async create(projectData) {
        const { user_id, title, description, technologies, github_link, demo_link, image } = projectData;
        const [result] = await db.execute(
            'INSERT INTO projects (user_id, title, description, technologies, github_link, demo_link, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, title, description, technologies, github_link, demo_link, image]
        );
        return result.insertId;
    }
    
    static async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM projects WHERE user_id = ? ORDER BY id DESC', [userId]);
        return rows;
    }
    
    static async update(id, userId, projectData) {
        const { title, description, technologies, github_link, demo_link, image } = projectData;
        const [result] = await db.execute(
            'UPDATE projects SET title = ?, description = ?, technologies = ?, github_link = ?, demo_link = ?, image = ? WHERE id = ? AND user_id = ?',
            [title, description, technologies, github_link, demo_link, image, id, userId]
        );
        return result.affectedRows;
    }
    
    static async delete(id, userId) {
        const [result] = await db.execute('DELETE FROM projects WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows;
    }
}

module.exports = ProjectModel;