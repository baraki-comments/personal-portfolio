const db = require('../config/db');

class MessageModel {
    static async create(messageData) {
        const { name, email, message } = messageData;
        const [result] = await db.execute(
            'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        return result.insertId;
    }
    
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM messages ORDER BY created_at DESC');
        return rows;
    }
    
    static async delete(id) {
        const [result] = await db.execute('DELETE FROM messages WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = MessageModel;