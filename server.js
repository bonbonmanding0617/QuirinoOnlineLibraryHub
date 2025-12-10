const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Routes for main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'student-dashboard.html'));
});

app.get('/pages/teacher-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'teacher-dashboard.html'));
});

// Fallback to index for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Online Library Hub server running on port ${PORT}`);
});
