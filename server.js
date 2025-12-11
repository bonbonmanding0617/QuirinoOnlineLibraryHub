const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const db = require('./database/db-connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const safe = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
        cb(null, `${unique}-${safe}`);
    }
});
const upload = multer({ storage });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets and uploads
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(UPLOAD_DIR));

// Helper: log activity
async function logActivity(userId, action, description = '', resourceType = null, resourceId = null, adminIp = null) {
    try {
        const payload = {
            user_id: userId || null,
            action,
            description,
            resource_type: resourceType,
            resource_id: resourceId,
            created_at: new Date()
        };
        if (adminIp) payload.admin_ip = adminIp;
        await db.insert('activity_log', payload);
    } catch (err) {
        console.error('Failed to write activity_log:', err.message);
    }
}

// --- API Endpoints ---

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));

// Create user (registration)
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, role, password } = req.body;
        if (!email || !name) return res.status(400).json({ error: 'name and email required' });

        const insert = await db.insert('users', {
            name,
            email,
            role: role || 'student',
            password: password || null,
            created_at: new Date()
        });

        const userId = insert.insertId;
        await logActivity(userId, 'create_user', `User ${email} created`, 'user', userId);

        const user = await db.getOne('SELECT id, name, email, role, profile_picture, created_at FROM users WHERE id = ?', [userId]);
        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Upload/Update profile picture
app.put('/api/users/:id/profile-picture', upload.single('profile'), async (req, res) => {
    try {
        const userId = req.params.id;
        if (!req.file) return res.status(400).json({ error: 'no_file' });

        const relPath = path.join('uploads', path.basename(req.file.path)).replace(/\\/g, '/');
        await db.update('users', { profile_picture: relPath }, 'id = ?', [userId]);
        await logActivity(userId, 'update_profile_picture', `Updated profile picture`, 'user', userId);

        res.json({ ok: true, profile_picture: relPath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Add a book (with optional cover upload)
app.post('/api/books', upload.single('cover'), async (req, res) => {
    try {
        const { title, author, isbn, created_by } = req.body;
        if (!title) return res.status(400).json({ error: 'title required' });

        const coverPath = req.file ? path.join('uploads', path.basename(req.file.path)).replace(/\\/g, '/') : null;

        const insert = await db.insert('books', {
            title,
            author: author || null,
            isbn: isbn || null,
            cover: coverPath,
            created_by: created_by || null,
            created_at: new Date()
        });

        const bookId = insert.insertId;
        await logActivity(created_by || null, 'create_book', `Created book ${title}`, 'book', bookId);

        const book = await db.getOne('SELECT * FROM books WHERE id = ?', [bookId]);
        res.status(201).json({ book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// List books
app.get('/api/books', async (req, res) => {
    try {
        const books = await db.getAll('SELECT * FROM books ORDER BY created_at DESC');
        res.json({ books });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// List users (public-safe)
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.getAll('SELECT id, name, email, role, profile_picture, created_at FROM users ORDER BY id DESC');
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Borrowing statistics: top books
app.get('/api/borrowings/top-books', async (req, res) => {
    try {
        const period = req.query.period === 'month' ? 'month' : 'week';
        const sql = period === 'month'
            ? `SELECT b.id, b.title, b.author, b.cover, COUNT(*) AS borrow_count
                 FROM borrowings br
                 JOIN books b ON b.id = br.book_id
                 WHERE br.borrowed_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
                 GROUP BY b.id
                 ORDER BY borrow_count DESC
                 LIMIT 10`
            : `SELECT b.id, b.title, b.author, b.cover, COUNT(*) AS borrow_count
                 FROM borrowings br
                 JOIN books b ON b.id = br.book_id
                 WHERE br.borrowed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                 GROUP BY b.id
                 ORDER BY borrow_count DESC
                 LIMIT 10`;

        const rows = await db.getAll(sql);
        res.json({ period, top: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Borrowing statistics: top borrowers
app.get('/api/borrowings/top-borrowers', async (req, res) => {
    try {
        const period = req.query.period === 'month' ? 'month' : 'week';
        const sql = period === 'month'
            ? `SELECT u.id, u.name, u.email, COUNT(*) AS borrow_count
                 FROM borrowings br
                 JOIN users u ON u.id = br.user_id
                 WHERE br.borrowed_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
                 GROUP BY u.id
                 ORDER BY borrow_count DESC
                 LIMIT 10`
            : `SELECT u.id, u.name, u.email, COUNT(*) AS borrow_count
                 FROM borrowings br
                 JOIN users u ON u.id = br.user_id
                 WHERE br.borrowed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                 GROUP BY u.id
                 ORDER BY borrow_count DESC
                 LIMIT 10`;

        const rows = await db.getAll(sql);
        res.json({ period, top: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Update user profile (partial)
app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const allowed = ['name', 'email', 'phone', 'address', 'school', 'department', 'specialization', 'bio', 'password', 'status'];
        const data = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) data[key] = req.body[key];
        }

        if (Object.keys(data).length === 0) return res.status(400).json({ error: 'no_fields' });

        await db.update('users', data, 'id = ?', [userId]);
        await logActivity(userId, 'update_user', `Updated profile`, 'user', userId);

        const user = await db.getOne('SELECT id, name, email, phone, address, school, department, specialization, bio, profile_picture, status, created_at FROM users WHERE id = ?', [userId]);
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Generic borrowings summary (counts)
app.get('/api/borrowings/summary', async (req, res) => {
    try {
        const sinceDays = parseInt(req.query.days || '7', 10);
        const rows = await db.getOne(`SELECT COUNT(*) AS total FROM borrowings WHERE borrowed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`, [sinceDays]);
        res.json({ days: sinceDays, totalBorrowings: rows.total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Delete a book (best-effort: remove cover file and DB record)
app.delete('/api/books/:id', requireApiKey, async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await db.getOne('SELECT * FROM books WHERE id = ?', [bookId]);
        if (!book) return res.status(404).json({ error: 'not_found' });

        // remove cover file if present
        if (book.cover) {
            const coverPath = path.join(__dirname, book.cover);
            try {
                if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
            } catch (err) {
                console.warn('Failed to remove cover file:', err.message);
            }
        }

        await db.remove('books', 'id = ?', [bookId]);
        await logActivity(null, 'delete_book', `Deleted book ${bookId}`, 'book', bookId, req.admin && req.admin.ip);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Delete a user (best-effort: remove profile picture and DB record)
app.delete('/api/users/:id', requireApiKey, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await db.getOne('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) return res.status(404).json({ error: 'not_found' });

        if (user.profile_picture) {
            const picPath = path.join(__dirname, user.profile_picture);
            try {
                if (fs.existsSync(picPath)) fs.unlinkSync(picPath);
            } catch (err) {
                console.warn('Failed to remove profile picture file:', err.message);
            }
        }

        await db.remove('users', 'id = ?', [userId]);
        await logActivity(null, 'delete_user', `Deleted user ${userId}`, 'user', userId, req.admin && req.admin.ip);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server_error' });
    }
});

// Fallback: serve index.html for front-end routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API-key middleware for admin operations
function requireApiKey(req, res, next) {
    const configured = process.env.ADMIN_API_KEY;
    if (!configured) return res.status(503).json({ error: 'admin_api_key_not_configured' });

    // Accept either `x-api-key: <key>` or `Authorization: Bearer <key>`
    const headerKey = req.get('x-api-key') || req.headers['x-api-key'];
    const authHeader = req.get('authorization') || req.headers['authorization'] || '';
    let sent = headerKey;
    if (!sent && typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
        sent = authHeader.slice(7).trim();
    }

    // Enforce HTTPS for admin endpoints in production unless explicitly allowed
    const forwardedProto = (req.get('x-forwarded-proto') || '').split(',')[0].trim();
    const isSecure = req.secure || forwardedProto === 'https';
    if (process.env.NODE_ENV === 'production' && !isSecure && !process.env.ALLOW_INSECURE_ADMIN) {
        return res.status(403).json({ error: 'admin_endpoint_requires_https' });
    }

    if (!sent || sent !== configured) return res.status(401).json({ error: 'unauthorized' });

    // attach admin info for downstream logging
    req.admin = { apiKeyUsed: sent, ip: req.ip };
    next();
}

// Start server after DB pool initializes
db.initializePool().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to initialize DB pool:', err);
    process.exit(1);
});



