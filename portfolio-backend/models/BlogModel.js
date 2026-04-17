const db = require('../config/db');

class BlogModel {
    static async create(blogData) {
        const { user_id, title, content, tags } = blogData;
        const [result] = await db.execute(
            'INSERT INTO blogs (user_id, title, content, tags) VALUES (?, ?, ?, ?)',
            [user_id, title, content, tags]
        );
        return result.insertId;
    }
    
    static async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM blogs WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }
    
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM blogs ORDER BY created_at DESC');
        return rows;
    }
    
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM blogs WHERE id = ?', [id]);
        return rows[0];
    }
    
    static async update(id, userId, blogData) {
        const { title, content, tags } = blogData;
        const [result] = await db.execute(
            'UPDATE blogs SET title = ?, content = ?, tags = ? WHERE id = ? AND user_id = ?',
            [title, content, tags, id, userId]
        );
        return result.affectedRows;
    }
    
    static async delete(id, userId) {
        const [result] = await db.execute('DELETE FROM blogs WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows;
    }
}

module.exports = BlogModel;