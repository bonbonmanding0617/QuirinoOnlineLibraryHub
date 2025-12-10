# Online Library Hub - Database Setup Guide

## Quick Start

This directory contains SQL files to set up a local MySQL database for the Online Library Hub application.

## Files Included

### 1. `init.sql`
- Creates the database
- Sets up proper character encoding
- Enables foreign keys
- Verifies installation

### 2. `schema.sql` (Main Database Structure)
- **users** - User accounts (students, teachers, admins)
- **books** - Book catalog
- **borrowings** - Book lending records
- **assignments** - Teacher assignments
- **submissions** - Student assignment submissions
- **reading_progress** - Student reading tracking
- **wishlist** - Student book wishlists
- **notifications** - System notifications
- **activity_log** - User activity tracking
- **user_preferences** - User settings

### 3. `sample-data.sql`
- 5 sample students
- 3 sample teachers
- 1 admin user
- 10 sample books
- Sample borrowings, assignments, and submissions
- Great for testing and development

### 4. `queries.sql`
- Common queries for students
- Common queries for teachers
- Book management queries
- Statistics and reporting queries
- Maintenance queries

## Setup Instructions

### Prerequisites
- MySQL 5.7+ or MariaDB
- MySQL Client or GUI tool (MySQL Workbench, DBeaver, etc.)
- Local MySQL Server running on `localhost:3306`

### Step 1: Create Database
```bash
mysql -u root -p < init.sql
```

### Step 2: Create Tables
```bash
mysql -u root -p library_hub < schema.sql
```

### Step 3: Insert Sample Data (Optional)
```bash
mysql -u root -p library_hub < sample-data.sql
```

### Alternative: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to localhost
3. Go to File → Open SQL Script
4. Select `init.sql` and run
5. Open `schema.sql` and run
6. Open `sample-data.sql` and run

### Alternative: Using Command Line
```sql
mysql -u root -p
mysql> CREATE DATABASE library_hub;
mysql> USE library_hub;
mysql> SOURCE /path/to/schema.sql;
mysql> SOURCE /path/to/sample-data.sql;
```

## Database Connection Details

### Default Configuration
```
Host: localhost
Port: 3306
Database: library_hub
User: root
Password: (your MySQL root password)
```

### MySQL Connection String
```
mysql://root:password@localhost:3306/library_hub
```

### Node.js Connection (with mysql2)
```javascript
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'your_password',
  database: 'library_hub'
});
```

## Sample Login Credentials

### Students
- Email: john.doe@school.com (Password: hashed_password_1)
- Email: jane.smith@school.com (Password: hashed_password_2)

### Teachers
- Email: teacher1@school.com (Password: hashed_password_6)
- Email: teacher2@school.com (Password: hashed_password_7)

### Admin
- Email: admin@school.com (Password: hashed_password_9)

**Note:** Passwords are hashed in the database. When implementing authentication, use proper password hashing (bcrypt, argon2, etc.)

## Table Structure Overview

### users
- Stores user accounts
- Roles: student, teacher, admin
- Fields: id, email, password, first_name, last_name, role, class/department, timestamps

### books
- Library catalog
- Tracks total and available copies
- Fields: id, title, author, isbn, category, description, copies, published_year

### borrowings
- Book lending history
- Status: borrowed, returned, overdue
- Links users to books

### assignments
- Teacher-created tasks
- Fields: id, teacher_id, title, description, book_id, due_date, class

### submissions
- Student assignment submissions
- Status: pending, submitted, graded
- Stores scores and feedback

### reading_progress
- Tracks student reading
- Fields: user_id, book_id, pages_read, total_pages, rating, review

### wishlist
- Student book wishlists
- Tracks desired books

### notifications
- System notifications
- Tracks read/unread status

### activity_log
- User action tracking
- For analytics and auditing

### user_preferences
- User settings
- Notification preferences, theme, language

## Key Features

- **Foreign Keys**: Ensures data integrity
- **Indexes**: Optimizes query performance
- **Timestamps**: Tracks creation and updates
- **Enums**: Restricts column values (e.g., role, status)
- **Unique Constraints**: Prevents duplicate data

## Useful Queries

### Check Database Connection
```sql
SELECT 1;
```

### View All Tables
```sql
SHOW TABLES;
```

### Check Table Structure
```sql
DESCRIBE users;
```

### Count Records
```sql
SELECT COUNT(*) FROM users;
```

### View Sample Student
```sql
SELECT * FROM users WHERE role = 'student' LIMIT 1;
```

### Get Books List
```sql
SELECT * FROM books;
```

## Troubleshooting

### Connection Refused
- Ensure MySQL is running
- Check port 3306 is not blocked
- Verify credentials

### Database Already Exists
```sql
DROP DATABASE library_hub;
-- Then run init.sql again
```

### Access Denied
- Ensure you're using correct credentials
- Check MySQL user permissions
- May need to create new MySQL user

### Foreign Key Errors
- Check all referenced tables exist
- Ensure data consistency
- Run: `SET FOREIGN_KEY_CHECKS = 0;` if needed (use carefully)

## Next Steps

1. **Connect from Application**
   - Update your Node.js/Express app with database credentials
   - Install mysql2 package: `npm install mysql2`

2. **Create API Routes**
   - Implement REST endpoints for CRUD operations
   - Use the queries.sql file as reference

3. **Implement Authentication**
   - Use bcrypt to hash passwords
   - Implement JWT tokens
   - Add session management

4. **Add Validation**
   - Server-side data validation
   - Input sanitization
   - Error handling

5. **Performance Optimization**
   - Monitor slow queries
   - Add database backups
   - Implement caching

## Database Backup

### Backup
```bash
mysqldump -u root -p library_hub > backup.sql
```

### Restore
```bash
mysql -u root -p library_hub < backup.sql
```

## Additional Resources

- MySQL Documentation: https://dev.mysql.com/doc/
- SQL Tutorial: https://www.w3schools.com/sql/
- Database Design: https://www.guru99.com/database-design.html

## Support

For issues or questions:
1. Check MySQL error logs
2. Review table structures in schema.sql
3. Test queries in MySQL client
4. Verify data integrity with provided queries

---

**Database Version**: 1.0.0
**Created**: December 11, 2025
**Compatible with**: MySQL 5.7+, MariaDB 10.3+

