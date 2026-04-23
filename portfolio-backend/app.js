const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db'
});

db.connect((err) => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Database connected');
});

// ============ ADMIN LOGIN ============
const ADMIN = {
    email: 'barakitemesgen388@gmail.com',
    password: 'admin123',
    name: 'Baraki Temesgen'
};

app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN.email && password === ADMIN.password) {
        res.json({ success: true, message: 'Login successful!', admin: { name: ADMIN.name, email: ADMIN.email, role: 'admin' } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// ============ PROFILE ENDPOINTS ============
app.get('/api/profile', (req, res) => {
    db.query('SELECT id, name, email, bio, education, profile_photo FROM users LIMIT 1', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || { name: ADMIN.name, email: ADMIN.email });
    });
});

app.put('/api/profile', upload.fields([{ name: 'profile_photo' }, { name: 'cv' }]), (req, res) => {
    const { name, bio, education } = req.body;
    let profile_photo = null;
    let cv_url = null;
    
    if (req.files && req.files['profile_photo']) {
        profile_photo = '/uploads/' + req.files['profile_photo'][0].filename;
    }
    if (req.files && req.files['cv']) {
        cv_url = '/uploads/' + req.files['cv'][0].filename;
    }
    
    let query = 'UPDATE users SET name = ?, bio = ?, education = ?';
    let params = [name, bio || '', education || ''];
    
    if (profile_photo) {
        query += ', profile_photo = ?';
        params.push(profile_photo);
    }
    if (cv_url) {
        query += ', cv_url = ?';
        params.push(cv_url);
    }
    query += ' WHERE id = (SELECT id FROM users LIMIT 1)';
    
    db.query(query, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Profile updated' });
    });
});

// ============ SKILLS ENDPOINTS ============
app.get('/api/skills', (req, res) => {
    db.query('SELECT * FROM skills', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/skills', (req, res) => {
    const { skill_name, level } = req.body;
    db.query('INSERT INTO skills (skill_name, level) VALUES (?, ?)', [skill_name, level], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId });
    });
});

app.put('/api/skills/:id', (req, res) => {
    const { skill_name, level } = req.body;
    db.query('UPDATE skills SET skill_name = ?, level = ? WHERE id = ?', [skill_name, level, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/skills/:id', (req, res) => {
    db.query('DELETE FROM skills WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ============ PROJECTS ENDPOINTS ============
app.get('/api/projects', (req, res) => {
    db.query('SELECT * FROM projects ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/projects', upload.single('image'), (req, res) => {
    const { title, description, technologies, github_link, demo_link } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    db.query('INSERT INTO projects (title, description, technologies, github_link, demo_link, image) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, technologies, github_link, demo_link, image], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId });
        });
});

app.put('/api/projects/:id', upload.single('image'), (req, res) => {
    const { title, description, technologies, github_link, demo_link } = req.body;
    let query = 'UPDATE projects SET title = ?, description = ?, technologies = ?, github_link = ?, demo_link = ?';
    let params = [title, description, technologies, github_link, demo_link];
    if (req.file) {
        query += ', image = ?';
        params.push('/uploads/' + req.file.filename);
    }
    query += ' WHERE id = ?';
    params.push(req.params.id);
    db.query(query, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/projects/:id', (req, res) => {
    db.query('DELETE FROM projects WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ============ BLOGS ENDPOINTS ============
app.get('/api/blogs', (req, res) => {
    db.query('SELECT * FROM blogs ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/blogs', (req, res) => {
    const { title, content, tags } = req.body;
    db.query('INSERT INTO blogs (title, content, tags) VALUES (?, ?, ?)', [title, content, tags], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId });
    });
});

app.put('/api/blogs/:id', (req, res) => {
    const { title, content, tags } = req.body;
    db.query('UPDATE blogs SET title = ?, content = ?, tags = ? WHERE id = ?', [title, content, tags, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/blogs/:id', (req, res) => {
    db.query('DELETE FROM blogs WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ============ MESSAGES ENDPOINTS ============
app.get('/api/messages', (req, res) => {
    db.query('SELECT * FROM messages ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/messages', (req, res) => {
    const { name, email, message } = req.body;
    db.query('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId });
    });
});

app.delete('/api/messages/:id', (req, res) => {
    db.query('DELETE FROM messages WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ============ REGISTER ENDPOINT ============
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'User registered' });
    });
});

const PORT = 5004;
app.listen(PORT, () => {
    console.log(`? API server running on http://localhost:${PORT}`);
    console.log(`?? Admin: ${ADMIN.email} / ${ADMIN.password}`);
});
// ============ PROJECTS ENDPOINTS ============
app.get('/api/projects', (req, res) => {
    db.query('SELECT * FROM projects ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/projects', upload.single('image'), (req, res) => {
    const { title, description, technologies, github_link, demo_link } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    console.log('Creating project:', { title, description, technologies, github_link, demo_link, image });
    
    db.query(
        'INSERT INTO projects (title, description, technologies, github_link, demo_link, image) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, technologies, github_link, demo_link, image],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: result.insertId });
        }
    );
});

app.put('/api/projects/:id', upload.single('image'), (req, res) => {
    const { title, description, technologies, github_link, demo_link } = req.body;
    let query = 'UPDATE projects SET title = ?, description = ?, technologies = ?, github_link = ?, demo_link = ?';
    let params = [title, description, technologies, github_link, demo_link];
    
    if (req.file) {
        query += ', image = ?';
        params.push('/uploads/' + req.file.filename);
    }
    query += ' WHERE id = ?';
    params.push(req.params.id);
    
    db.query(query, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/projects/:id', (req, res) => {
    db.query('DELETE FROM projects WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});
// ============ PROJECTS ENDPOINTS ============
app.get('/api/projects', (req, res) => {
    db.query('SELECT * FROM projects ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/projects', upload.single('image'), (req, res) => {
    const { title, description, technologies, github_link, demo_link } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    console.log('Creating project:', { title, description, technologies, github_link, demo_link, image });
    
    db.query(
        'INSERT INTO projects (title, description, technologies, github_link, demo_link, image) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, technologies, github_link, demo_link, image],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: result.insertId });
        }
    );
});

app.put('/api/projects/:id', upload.single('image'), (req, res) => {
    const { title, description, technologies, github_link, demo_link } = req.body;
    let query = 'UPDATE projects SET title = ?, description = ?, technologies = ?, github_link = ?, demo_link = ?';
    let params = [title, description, technologies, github_link, demo_link];
    
    if (req.file) {
        query += ', image = ?';
        params.push('/uploads/' + req.file.filename);
    }
    query += ' WHERE id = ?';
    params.push(req.params.id);
    
    db.query(query, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/projects/:id', (req, res) => {
    db.query('DELETE FROM projects WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});
app.get('/api/profile', (req, res) => {
    db.query('SELECT id, name, email, bio, education, profile_photo FROM users LIMIT 1', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || { name: '', bio: '', education: '', profile_photo: '' });
    });
});
// GET profile endpoint
app.get('/api/profile', (req, res) => {
    db.query('SELECT id, name, email, bio, education, profile_photo FROM users LIMIT 1', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || { name: '', bio: '', education: '', profile_photo: '' });
    });
});
