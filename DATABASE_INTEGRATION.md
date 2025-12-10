# Database Integration Setup Guide

## Overview
Your Online Library Hub now includes complete database integration with MySQL. This guide walks you through setting up and connecting everything.

## Prerequisites
- Node.js 18.x or higher installed
- MySQL 5.7+ or MariaDB 10.2+ installed
- Basic familiarity with command line and MySQL

## Step 1: Install MySQL Database Driver

In your project root directory, run:

```bash
npm install mysql2
npm install dotenv
```

This installs:
- **mysql2**: MySQL database driver with promise support
- **dotenv**: Environment variable management

## Step 2: Create .env File

Copy the example file and create your environment configuration:

```bash
cp .env.example .env
```

Then edit `.env` and update database credentials:

```ini
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_hub
```

**Important:** Never commit `.env` to git (it's in .gitignore). It contains sensitive credentials.

## Step 3: Initialize the Database

### Option A: Using Command Line (MySQL CLI)

1. Open a terminal/command prompt
2. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
3. Enter your MySQL password

4. Run the initialization script:
   ```sql
   SOURCE database/init.sql;
   SOURCE database/schema.sql;
   SOURCE database/sample-data.sql;
   ```

5. Exit MySQL:
   ```sql
   EXIT;
   ```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `database/init.sql`
4. Execute the script (⚡ button or Ctrl+Shift+Enter)
5. Repeat for `database/schema.sql` and `database/sample-data.sql`

### Option C: Using a GUI Tool (MySQL Adminer, phpMyAdmin, etc.)
1. Access your database management tool
2. Create a new database named `library_hub`
3. Import `database/schema.sql`
4. Import `database/sample-data.sql`

## Step 4: Update server.js

The database connection is already set up in the database modules. Update your `server.js` to use them:

```javascript
require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./database/db-connection');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'assets')));

// Initialize database connection
db.initializePool().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'student-dashboard.html'));
});

app.get('/teacher-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'teacher-dashboard.html'));
});

// Example API endpoint using database service
const dbService = require('./database/db-service');

app.get('/api/books', async (req, res) => {
  try {
    const books = await dbService.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await dbService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Step 5: Test the Connection

Run the server:

```bash
npm start
```

You should see:
```
✓ Database connected successfully
Server running on http://localhost:3000
```

## Database Structure

### Tables Created

1. **users** - User accounts (students, teachers, admins)
2. **books** - Library book catalog
3. **borrowings** - Book borrowing/lending records
4. **assignments** - Teacher assignments
5. **submissions** - Student assignment submissions
6. **reading_progress** - Student reading progress tracking
7. **wishlist** - Student book wishlists
8. **notifications** - System notifications
9. **activity_log** - User activity logging
10. **user_preferences** - User preferences and settings

### Sample Data

The database includes:
- **5 Student accounts** with class assignments
- **3 Teacher accounts** with departments
- **1 Admin account**
- **10 Sample books** in various categories
- **7 Borrowing records** with different statuses
- **4 Assignments** with due dates
- **4 Submissions** with grades and feedback

### Default Credentials

**Students:**
- Email: john.doe@school.com / Password: Not hashed (implement bcrypt)
- Email: jane.smith@school.com / Password: Not hashed

**Teachers:**
- Email: teacher1@school.com / Department: Math
- Email: teacher2@school.com / Department: Literature

**Admin:**
- Email: admin@school.com / Role: admin

**Note:** Passwords are stored as plain text in sample data. Always implement bcrypt for production!

## Using the Database Service

The `database/db-service.js` file provides convenient functions for common operations:

### User Queries
```javascript
const dbService = require('./database/db-service');

// Get user by ID
const user = await dbService.getUserById(1);

// Get user by email
const user = await dbService.getUserByEmail('john.doe@school.com');

// Get all students
const students = await dbService.getAllStudents();

// Get students by class
const classStudents = await dbService.getStudentsByClass('Class A');

// Create new user
const result = await dbService.createUser({
  email: 'newstudent@school.com',
  password: 'hashed_password', // Use bcrypt!
  first_name: 'New',
  last_name: 'Student',
  role: 'student',
  class: 'Class A'
});

// Update user
await dbService.updateUser(1, {
  first_name: 'Updated',
  class: 'Class B'
});
```

### Book Queries
```javascript
// Get all books
const books = await dbService.getAllBooks();

// Get books by category
const mathBooks = await dbService.getBooksByCategory('Mathematics');

// Search books
const results = await dbService.searchBooks('Python');

// Get available books
const available = await dbService.getAvailableBooks();

// Create book
const result = await dbService.createBook({
  title: 'New Book',
  author: 'Author Name',
  isbn: '978-0-123456-78-9',
  category: 'Fiction',
  total_copies: 5,
  available_copies: 5
});

// Get popular books
const popular = await dbService.getPopularBooks(10);
```

### Borrowing Queries
```javascript
// Get user's borrowed books
const borrowed = await dbService.getUserBorrowings(1);

// Get overdue books
const overdue = await dbService.getOverdueBooks();

// Create borrowing record
const result = await dbService.createBorrowing({
  user_id: 1,
  book_id: 5,
  borrowed_date: new Date(),
  due_date: new Date(Date.now() + 14*24*60*60*1000), // 14 days from now
  status: 'borrowed'
});

// Return a book
await dbService.returnBook(borrowingId);

// Mark overdue books
await dbService.markOverdueBooks();
```

### Assignment & Submission Queries
```javascript
// Get teacher's assignments
const assignments = await dbService.getTeacherAssignments(teacherId);

// Get assignment submissions
const submissions = await dbService.getAssignmentSubmissions(assignmentId);

// Grade a submission
await dbService.gradeSubmission(submissionId, 95, 'Excellent work!', teacherId);

// Get student stats
const stats = await dbService.getStudentStats(studentId);
// Returns: books_borrowed, overdue_books, assignments_completed, average_score
```

### Statistics Queries
```javascript
// Get library statistics
const stats = await dbService.getLibraryStats();
// Returns: total_books, available_books, currently_borrowed, total_assignments, graded_assignments

// Get student statistics
const studentStats = await dbService.getStudentStats(userId);

// Get popular books
const popular = await dbService.getPopularBooks(10);
```

## Troubleshooting

### Connection Refused Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**
1. Check MySQL is running: `mysql --version`
2. Start MySQL service (Windows): `net start MySQL80` (or your version)
3. Start MySQL service (Mac): `brew services start mysql`
4. Verify DB_HOST and DB_PORT in .env file

### Access Denied Error
```
Error: ER_ACCESS_DENIED_FOR_USER 'root'@'localhost'
```

**Solutions:**
1. Verify DB_USER and DB_PASSWORD in .env
2. Check if MySQL password has changed
3. Reset MySQL root password if forgotten

### Database Not Found Error
```
Error: ER_BAD_DB_NAME 'library_hub'
```

**Solution:** Re-run the initialization scripts:
```sql
SOURCE database/init.sql;
SOURCE database/schema.sql;
SOURCE database/sample-data.sql;
```

### Foreign Key Constraint Error
```
Error: ER_NO_REFERENCED_ROW_2: Cannot add or update a child row
```

**Solution:** Ensure parent records exist before referencing them. Use existing IDs from sample data.

## Next Steps

1. **Implement Authentication API**
   - Hash passwords with bcrypt
   - Create login endpoint
   - Generate JWT tokens

2. **Create REST API Endpoints**
   - Use db-service.js functions
   - Add error handling
   - Implement input validation

3. **Update Frontend**
   - Replace SessionStorage with API calls
   - Handle real authentication
   - Display database data

4. **Add Advanced Features**
   - Email notifications
   - Search and filtering
   - Reporting and analytics
   - File uploads for submissions

## Database Backup & Restore

### Backup Database
```bash
mysqldump -u root -p library_hub > backup.sql
```

### Restore Database
```bash
mysql -u root -p library_hub < backup.sql
```

## For Production Deployment (Render.com)

1. Create MySQL database on a hosted service (e.g., Railway, PlanetScale)
2. Update .env with production database URL
3. Deploy to Render.com
4. Run initialization scripts on production database
5. Monitor database performance and backups

## Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 Package](https://github.com/sidorares/node-mysql2)
- [SQL Best Practices](https://sqlperformance.com/)
- [Database Design Patterns](https://www.postgresql.org/docs/)

---

**Your database is ready! Start building those API endpoints!** 🚀
